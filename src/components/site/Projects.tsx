import { useMemo, useState } from "react";
import {
  PORTFOLIO,
  FEATURED_PORTFOLIO,
  CATEGORY_LABEL,
  ROOM_LABEL,
  type PrimaryCategory,
  type Room,
} from "@/data/site";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURED_SPANS = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-7",
  "lg:col-span-5",
];

const CATEGORY_TABS: { id: "all" | PrimaryCategory; label: string }[] = [
  { id: "all", label: "All Work" },
  { id: "art", label: "Art & Portraits" },
  { id: "mirror", label: "Mirrors" },
  { id: "decor", label: "Furniture & Decor" },
];

const ROOM_FILTERS: ("all" | Room)[] = [
  "all",
  "lounge",
  "dining",
  "bedroom",
  "corridor",
  "stairway",
  "kitchen",
  "washroom",
  "office",
];

const Projects = () => {
  const [category, setCategory] = useState<"all" | PrimaryCategory>("all");
  const [room, setRoom] = useState<"all" | Room>("all");

  const filtered = useMemo(() => {
    return PORTFOLIO.filter((p) => {
      if (category !== "all" && p.primary !== category) return false;
      if (room !== "all" && p.room !== room) return false;
      return true;
    });
  }, [category, room]);

  return (
    <section id="projects" className="py-24 md:py-36">
      <div className="container-edge">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-20 reveal">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="hairline" />
              <span className="eyebrow">Selected Work · 49 Homes</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.02] text-foreground">
              A portfolio of <span className="italic font-light">mirrors, portraits</span> and styled rooms.
            </h2>
          </div>
          <p className="md:max-w-sm text-[15px] leading-[1.8] text-muted-foreground">
            Composed across corridors, lounges, dining rooms, bedrooms and
            stairways — every piece shown here is real work, in real homes.
          </p>
        </div>

        {/* Featured editorial grid */}
        <div className="mb-24 md:mb-32">
          <div className="flex items-baseline justify-between mb-10 reveal">
            <div className="eyebrow">Featured Work</div>
            <div className="hidden md:block text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              Six pieces · Selected
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 auto-rows-auto">
            {FEATURED_PORTFOLIO.map((p, i) => (
              <article
                key={p.id}
                className={cn(
                  "reveal group relative",
                  FEATURED_SPANS[i] ?? "lg:col-span-6",
                )}
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
              >
                <div className="relative overflow-hidden bg-stone aspect-[4/5] lg:aspect-[5/6]">
                  <img
                    src={p.image}
                    alt={p.alt}
                    loading="lazy"
                    width={1024}
                    height={1280}
                    className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-80" />
                  <div className="absolute top-5 left-5 right-5 flex items-start justify-between text-background/90">
                    <span className="text-[10px] uppercase tracking-[0.32em] bg-background/15 backdrop-blur-sm px-3 py-1.5 border border-background/20">
                      {CATEGORY_LABEL[p.primary]}
                    </span>
                    <span className="font-serif text-base">{ROOM_LABEL[p.room]}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2">
                      {ROOM_LABEL[p.room]}
                    </div>
                    <h3 className="font-serif text-2xl md:text-[1.75rem] leading-tight text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm leading-[1.75] text-muted-foreground max-w-md">
                      {p.caption}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-foreground/40 mt-1 transition-all duration-500 group-hover:text-accent group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Filterable catalogue */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="eyebrow mb-3">The Full Portfolio</div>
              <h3 className="font-serif text-3xl md:text-4xl text-foreground leading-tight">
                Browse by category <span className="italic font-light">or by space.</span>
              </h3>
            </div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </div>
          </div>

          {/* Category tabs */}
          <div className="border-y border-hairline">
            <div className="flex flex-wrap items-center -mx-3">
              {CATEGORY_TABS.map((t) => {
                const active = category === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setCategory(t.id)}
                    className={cn(
                      "relative px-3 md:px-5 py-5 text-[11px] md:text-[12px] uppercase tracking-[0.28em] transition-colors duration-300",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t.label}
                    <span
                      className={cn(
                        "absolute left-3 md:left-5 right-3 md:right-5 -bottom-px h-px transition-all duration-500",
                        active ? "bg-foreground" : "bg-transparent",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Room filter chips */}
          <div className="flex flex-wrap gap-2 mt-8">
            {ROOM_FILTERS.map((r) => {
              const active = room === r;
              return (
                <button
                  key={r}
                  onClick={() => setRoom(r)}
                  className={cn(
                    "px-4 py-2 text-[10px] uppercase tracking-[0.24em] border transition-colors duration-300",
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "border-hairline text-muted-foreground hover:text-foreground hover:border-foreground/60",
                  )}
                >
                  {r === "all" ? "All Spaces" : ROOM_LABEL[r]}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((p) => (
                <figure key={p.id} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                    <img
                      src={p.image}
                      alt={p.alt}
                      loading="lazy"
                      width={900}
                      height={1125}
                      className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent opacity-50 transition-opacity duration-700 group-hover:opacity-70" />
                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between text-background/90">
                      <span className="text-[9px] uppercase tracking-[0.28em] bg-background/15 backdrop-blur-sm px-2.5 py-1 border border-background/20">
                        {CATEGORY_LABEL[p.primary]}
                      </span>
                    </div>
                  </div>
                  <figcaption className="mt-4">
                    <div className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground mb-1.5">
                      {ROOM_LABEL[p.room]}
                    </div>
                    <div className="font-serif text-lg text-foreground leading-snug">
                      {p.title}
                    </div>
                    <p className="mt-1.5 text-[13px] leading-[1.7] text-muted-foreground">
                      {p.caption}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="mt-16 py-16 text-center text-muted-foreground text-sm border border-hairline">
              No pieces in this combination yet — try another space.
            </div>
          )}
        </div>

        <div className="mt-20 flex justify-center reveal">
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-foreground"
          >
            <span className="h-px w-10 bg-foreground/40 transition-all duration-500 group-hover:w-16 group-hover:bg-foreground" />
            Enquire about a project
            <span className="h-px w-10 bg-foreground/40 transition-all duration-500 group-hover:w-16 group-hover:bg-foreground" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
