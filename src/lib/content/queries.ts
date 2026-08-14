import { supabase } from "@/integrations/supabase/client";
import { env } from "@/lib/env";
import type {
  ContentBlock,
  Faq,
  FrameFinish,
  PrimaryCategory,
  Project,
  ProjectImage,
  Room,
  Service,
  SiteSettings,
  SizeOption,
  Stat,
  Testimonial,
} from "./types";

const MEDIA_BUCKET = "media";

/** Storage path -> public URL. Cheap string build; avoids a client round-trip. */
export function mediaUrl(storagePath: string | null | undefined): string | null {
  if (!storagePath) return null;
  if (/^https?:\/\//.test(storagePath)) return storagePath;
  return `${env.VITE_SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${storagePath}`;
}

// --- row shapes -------------------------------------------------------------

type ImageRow = {
  id: string;
  storage_path: string;
  alt: string;
  role: ProjectImage["role"];
  width: number | null;
  height: number | null;
  blur_data_url: string | null;
  sort_order: number;
};

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  caption: string;
  summary: string | null;
  brief: string | null;
  approach: string | null;
  outcome: string | null;
  category: PrimaryCategory;
  room: Room;
  location: string | null;
  completed_on: string | null;
  dimensions: string | null;
  frame_finish_id: string | null;
  lead_time_days: number | null;
  price_from_kes: number | null;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  project_images: ImageRow[] | null;
};

// --- mappers ----------------------------------------------------------------

function toImage(row: ImageRow): ProjectImage {
  return {
    id: row.id,
    url: mediaUrl(row.storage_path) ?? "",
    alt: row.alt,
    role: row.role,
    width: row.width,
    height: row.height,
    blurDataUrl: row.blur_data_url,
  };
}

function toProject(row: ProjectRow): Project {
  const images = (row.project_images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(toImage);

  const find = (role: ProjectImage["role"]) => images.find((i) => i.role === role) ?? null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    caption: row.caption,
    summary: row.summary,
    brief: row.brief,
    approach: row.approach,
    outcome: row.outcome,
    category: row.category,
    room: row.room,
    location: row.location,
    completedOn: row.completed_on,
    dimensions: row.dimensions,
    frameFinishId: row.frame_finish_id,
    leadTimeDays: row.lead_time_days,
    priceFromKes: row.price_from_kes,
    featured: row.featured,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    images,
    heroImage: find("hero") ?? images[0] ?? null,
    beforeImage: find("before"),
    afterImage: find("after"),
  };
}

const PROJECT_SELECT = `
  id, slug, title, caption, summary, brief, approach, outcome,
  category, room, location, completed_on, dimensions, frame_finish_id,
  lead_time_days, price_from_kes, featured, seo_title, seo_description,
  project_images ( id, storage_path, alt, role, width, height, blur_data_url, sort_order )
`;

function unwrap<T>(result: { data: T | null; error: { message: string } | null }, label: string): T {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  if (result.data === null) throw new Error(`${label}: no data returned`);
  return result.data;
}

// --- queries ----------------------------------------------------------------

export async function fetchProjects(): Promise<Project[]> {
  const result = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .returns<ProjectRow[]>();

  return unwrap(result, "fetchProjects").map(toProject);
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle<ProjectRow>();

  if (error) throw new Error(`fetchProjectBySlug: ${error.message}`);
  return data ? toProject(data) : null;
}

export async function fetchServices(): Promise<Service[]> {
  type Row = {
    id: string;
    slug: string;
    number: string;
    title: string;
    body: string;
    detail: string | null;
    price_from_kes: number | null;
    lead_time_days: number | null;
  };

  const result = await supabase
    .from("services")
    .select("id, slug, number, title, body, detail, price_from_kes, lead_time_days")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .returns<Row[]>();

  return unwrap(result, "fetchServices").map((r) => ({
    id: r.id,
    slug: r.slug,
    number: r.number,
    title: r.title,
    body: r.body,
    detail: r.detail,
    priceFromKes: r.price_from_kes,
    leadTimeDays: r.lead_time_days,
  }));
}

export async function fetchFrameFinishes(): Promise<FrameFinish[]> {
  type Row = {
    id: string;
    slug: string;
    name: string;
    note: string;
    image_path: string | null;
    image_alt: string | null;
    price_multiplier: number;
  };

  const result = await supabase
    .from("frame_finishes")
    .select("id, slug, name, note, image_path, image_alt, price_multiplier")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .returns<Row[]>();

  return unwrap(result, "fetchFrameFinishes").map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    note: r.note,
    imageUrl: mediaUrl(r.image_path),
    imageAlt: r.image_alt ?? "",
    priceMultiplier: Number(r.price_multiplier),
  }));
}

export async function fetchSizeOptions(): Promise<SizeOption[]> {
  type Row = {
    id: string;
    category: PrimaryCategory;
    label: string;
    width_cm: number | null;
    height_cm: number | null;
    diameter_cm: number | null;
    base_price_kes: number;
  };

  const result = await supabase
    .from("size_options")
    .select("id, category, label, width_cm, height_cm, diameter_cm, base_price_kes")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .returns<Row[]>();

  return unwrap(result, "fetchSizeOptions").map((r) => ({
    id: r.id,
    category: r.category,
    label: r.label,
    widthCm: r.width_cm === null ? null : Number(r.width_cm),
    heightCm: r.height_cm === null ? null : Number(r.height_cm),
    diameterCm: r.diameter_cm === null ? null : Number(r.diameter_cm),
    basePriceKes: Number(r.base_price_kes),
  }));
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  type Row = {
    id: string;
    quote: string;
    author_name: string;
    author_label: string;
    project_id: string | null;
    rating: number | null;
    given_on: string | null;
  };

  const result = await supabase
    .from("testimonials")
    .select("id, quote, author_name, author_label, project_id, rating, given_on")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .returns<Row[]>();

  return unwrap(result, "fetchTestimonials").map((r) => ({
    id: r.id,
    quote: r.quote,
    authorName: r.author_name,
    authorLabel: r.author_label,
    projectId: r.project_id,
    rating: r.rating,
    givenOn: r.given_on,
  }));
}

export async function fetchFaqs(): Promise<Faq[]> {
  const result = await supabase
    .from("faqs")
    .select("id, question, answer")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .returns<Faq[]>();

  return unwrap(result, "fetchFaqs");
}

export async function fetchContentBlocks(): Promise<Record<string, ContentBlock>> {
  type Row = {
    key: string;
    eyebrow: string | null;
    heading: string | null;
    heading_emphasis: string | null;
    body: string[] | null;
    image_path: string | null;
    image_alt: string | null;
    cta_label: string | null;
    cta_href: string | null;
  };

  const result = await supabase
    .from("content_blocks")
    .select("key, eyebrow, heading, heading_emphasis, body, image_path, image_alt, cta_label, cta_href")
    .eq("status", "published")
    .returns<Row[]>();

  const blocks: Record<string, ContentBlock> = {};
  for (const r of unwrap(result, "fetchContentBlocks")) {
    blocks[r.key] = {
      key: r.key,
      eyebrow: r.eyebrow,
      heading: r.heading,
      headingEmphasis: r.heading_emphasis,
      body: r.body ?? [],
      imageUrl: mediaUrl(r.image_path),
      imageAlt: r.image_alt ?? "",
      ctaLabel: r.cta_label,
      ctaHref: r.cta_href,
    };
  }
  return blocks;
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  type Row = {
    legal_name: string;
    display_name: string;
    tagline: string;
    phone_display: string;
    phone_e164: string;
    whatsapp_e164: string;
    email: string;
    hours: string;
    location: string;
    street_address: string | null;
    city: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    service_areas: string[] | null;
    socials: Record<string, string> | null;
    stats: Stat[] | null;
    seo_title: string;
    seo_description: string;
    og_image_path: string | null;
    price_disclaimer: string;
    currency: string;
  };

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle<Row>();

  if (error) throw new Error(`fetchSiteSettings: ${error.message}`);
  if (!data) throw new Error("fetchSiteSettings: site_settings has no row — run the seed");

  const digits = (value: string) => value.replace(/[^\d+]/g, "");

  return {
    legalName: data.legal_name,
    displayName: data.display_name,
    tagline: data.tagline,
    phoneDisplay: data.phone_display,
    phoneE164: data.phone_e164,
    whatsappE164: data.whatsapp_e164,
    email: data.email,
    hours: data.hours,
    location: data.location,
    streetAddress: data.street_address,
    city: data.city,
    country: data.country,
    latitude: data.latitude,
    longitude: data.longitude,
    serviceAreas: data.service_areas ?? [],
    socials: data.socials ?? {},
    stats: data.stats ?? [],
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    ogImageUrl: mediaUrl(data.og_image_path),
    priceDisclaimer: data.price_disclaimer,
    currency: data.currency,
    telHref: `tel:${digits(data.phone_e164)}`,
    mailtoHref: `mailto:${data.email}`,
    whatsappHref: `https://wa.me/${digits(data.whatsapp_e164).replace("+", "")}`,
  };
}
