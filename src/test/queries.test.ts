import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Guards the seam where "content is in the database but the site is blank" bugs
 * live: the column names each query asks for, and the row -> domain mapping.
 */

type Result = { data: unknown; error: { message: string } | null };

const calls: { table: string; columns: string; filters: [string, unknown][] }[] = [];
let nextResult: Result = { data: null, error: null };

function builder(table: string) {
  const record = { table, columns: "", filters: [] as [string, unknown][] };
  calls.push(record);

  const chain: Record<string, unknown> = {};
  const self = () => chain;

  chain.select = vi.fn((columns: string) => {
    record.columns = columns;
    return chain;
  });
  chain.eq = vi.fn((column: string, value: unknown) => {
    record.filters.push([column, value]);
    return chain;
  });

  for (const method of ["order", "limit", "returns", "gte", "in"]) chain[method] = vi.fn(self);

  chain.maybeSingle = vi.fn(() => Promise.resolve(nextResult));
  chain.single = vi.fn(() => Promise.resolve(nextResult));
  chain.then = (resolve: (value: Result) => unknown, reject?: (reason: unknown) => unknown) =>
    Promise.resolve(nextResult).then(resolve, reject);

  return chain;
}

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: vi.fn((table: string) => builder(table)) },
}));

const {
  fetchProjects,
  fetchServices,
  fetchSiteSettings,
  fetchContentBlocks,
  fetchTestimonials,
  fetchSizeOptions,
  mediaUrl,
} = await import("@/lib/content/queries");

beforeEach(() => {
  calls.length = 0;
  nextResult = { data: null, error: null };
});

describe("mediaUrl", () => {
  it("builds a public storage URL from a storage path", () => {
    expect(mediaUrl("portfolio/a.jpg")).toBe(
      "https://test.supabase.co/storage/v1/object/public/media/portfolio/a.jpg",
    );
  });

  it("passes absolute URLs through untouched", () => {
    expect(mediaUrl("https://cdn.example.com/a.jpg")).toBe("https://cdn.example.com/a.jpg");
  });

  it("returns null when there is no path", () => {
    expect(mediaUrl(null)).toBeNull();
    expect(mediaUrl("")).toBeNull();
  });
});

describe("fetchProjects", () => {
  const row = {
    id: "p1",
    slug: "six-panel-mirror-cluster",
    title: "Six-panel mirror cluster",
    caption: "Composed against a botanical wall.",
    summary: null,
    brief: null,
    approach: null,
    outcome: null,
    category: "mirror",
    room: "stairway",
    location: null,
    completed_on: null,
    dimensions: null,
    frame_finish_id: null,
    lead_time_days: null,
    price_from_kes: null,
    featured: true,
    seo_title: null,
    seo_description: null,
    project_images: [
      { id: "i2", storage_path: "portfolio/b.jpg", alt: "after", role: "after", width: null, height: null, blur_data_url: null, sort_order: 2 },
      { id: "i1", storage_path: "portfolio/a.jpg", alt: "hero shot", role: "hero", width: 1024, height: 1280, blur_data_url: null, sort_order: 0 },
    ],
  };

  it("only asks for published rows", async () => {
    nextResult = { data: [row], error: null };
    await fetchProjects();
    expect(calls[0].table).toBe("projects");
    expect(calls[0].filters).toContainEqual(["status", "published"]);
  });

  it("requests the join the UI depends on", async () => {
    nextResult = { data: [row], error: null };
    await fetchProjects();
    expect(calls[0].columns).toContain("project_images");
    expect(calls[0].columns).toContain("storage_path");
  });

  it("maps a row to the domain shape the components read", async () => {
    nextResult = { data: [row], error: null };
    const [project] = await fetchProjects();

    expect(project.slug).toBe("six-panel-mirror-cluster");
    expect(project.featured).toBe(true);
    expect(project.leadTimeDays).toBeNull();
    expect(project.heroImage?.url).toBe(
      "https://test.supabase.co/storage/v1/object/public/media/portfolio/a.jpg",
    );
    expect(project.heroImage?.alt).toBe("hero shot");
    expect(project.afterImage?.alt).toBe("after");
  });

  it("sorts images by sort_order regardless of the order returned", async () => {
    nextResult = { data: [row], error: null };
    const [project] = await fetchProjects();
    expect(project.images.map((i) => i.id)).toEqual(["i1", "i2"]);
  });

  it("falls back to the first image when none is marked hero", async () => {
    nextResult = {
      data: [{ ...row, project_images: [{ ...row.project_images[0], role: "gallery" }] }],
      error: null,
    };
    const [project] = await fetchProjects();
    expect(project.heroImage?.id).toBe("i2");
  });

  it("survives a project with no images", async () => {
    nextResult = { data: [{ ...row, project_images: null }], error: null };
    const [project] = await fetchProjects();
    expect(project.images).toEqual([]);
    expect(project.heroImage).toBeNull();
  });

  it("surfaces database errors instead of rendering blank", async () => {
    nextResult = { data: null, error: { message: "permission denied for table projects" } };
    await expect(fetchProjects()).rejects.toThrow(/permission denied/);
  });
});

describe("fetchServices", () => {
  it("maps snake_case columns onto the camelCase domain type", async () => {
    nextResult = {
      data: [
        { id: "s1", slug: "mirrors", number: "02", title: "Mirrors", body: "Framed mirrors.", detail: null, price_from_kes: 45000, lead_time_days: 21 },
      ],
      error: null,
    };
    const [service] = await fetchServices();
    expect(service.priceFromKes).toBe(45000);
    expect(service.leadTimeDays).toBe(21);
  });
});

describe("fetchSizeOptions", () => {
  it("coerces numerics, which Postgres returns as strings", async () => {
    nextResult = {
      data: [
        { id: "z1", category: "mirror", label: "100 × 100 cm", width_cm: "100.0", height_cm: "100.0", diameter_cm: null, base_price_kes: "12000.00" },
      ],
      error: null,
    };
    const [size] = await fetchSizeOptions();
    expect(size.widthCm).toBe(100);
    expect(size.basePriceKes).toBe(12000);
    expect(size.diameterCm).toBeNull();
  });
});

describe("fetchContentBlocks", () => {
  it("keys blocks so the hero and about sections can find theirs", async () => {
    nextResult = {
      data: [
        { key: "hero", eyebrow: "Nairobi", heading: "Mirrors", heading_emphasis: "and decor", body: ["one", "two"], image_path: "portfolio/a.jpg", image_alt: "alt", cta_label: null, cta_href: null },
      ],
      error: null,
    };
    const blocks = await fetchContentBlocks();
    expect(blocks.hero.heading).toBe("Mirrors");
    expect(blocks.hero.body).toEqual(["one", "two"]);
    expect(blocks.hero.imageUrl).toContain("/media/portfolio/a.jpg");
  });

  it("defaults a null body to an empty array rather than crashing the map", async () => {
    nextResult = {
      data: [{ key: "about", eyebrow: null, heading: null, heading_emphasis: null, body: null, image_path: null, image_alt: null, cta_label: null, cta_href: null }],
      error: null,
    };
    const blocks = await fetchContentBlocks();
    expect(blocks.about.body).toEqual([]);
  });
});

describe("fetchTestimonials", () => {
  it("maps author columns", async () => {
    nextResult = {
      data: [{ id: "t1", quote: "Lovely work.", author_name: "Wanjiku M.", author_label: "Nairobi", project_id: null, rating: 5, given_on: null }],
      error: null,
    };
    const [testimonial] = await fetchTestimonials();
    expect(testimonial.authorName).toBe("Wanjiku M.");
    expect(testimonial.authorLabel).toBe("Nairobi");
  });
});

describe("fetchSiteSettings", () => {
  const row = {
    legal_name: "JECMWA LIMITED",
    display_name: "JECMWA",
    tagline: "Mirrors and decor.",
    phone_display: "0711 722 331",
    phone_e164: "+254711722331",
    whatsapp_e164: "+254711722331",
    email: "jecmwa03@gmail.com",
    hours: "By appointment",
    location: "Nairobi",
    street_address: null,
    city: "Nairobi",
    country: "KE",
    latitude: null,
    longitude: null,
    service_areas: ["Nairobi"],
    socials: {},
    stats: [{ value: "4", label: "Years styling" }],
    seo_title: "JECMWA",
    seo_description: "Interiors.",
    og_image_path: null,
    price_disclaimer: "Indicative only.",
    currency: "KES",
  };

  it("derives the contact links components render", async () => {
    nextResult = { data: row, error: null };
    const settings = await fetchSiteSettings();
    expect(settings.telHref).toBe("tel:+254711722331");
    expect(settings.mailtoHref).toBe("mailto:jecmwa03@gmail.com");
    expect(settings.whatsappHref).toBe("https://wa.me/254711722331");
  });

  it("keeps the stats array the hero iterates over", async () => {
    nextResult = { data: row, error: null };
    const settings = await fetchSiteSettings();
    expect(settings.stats).toEqual([{ value: "4", label: "Years styling" }]);
  });

  it("gives a pointed error when the table is empty", async () => {
    nextResult = { data: null, error: null };
    await expect(fetchSiteSettings()).rejects.toThrow(/run the seed/i);
  });
});
