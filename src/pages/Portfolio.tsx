import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Section, SectionHeading, Reveal } from "@/components/primitives";
import { ProjectCard } from "@/components/ProjectCard";
import { Lightbox } from "@/components/Lightbox";
import { QueryBoundary, GridSkeleton, EmptyState } from "@/components/QueryBoundary";
import { useProjects, useSiteSettings } from "@/lib/content/hooks";
import {
  CATEGORY_SHORT_LABEL,
  ROOM_LABEL,
  ROOM_ORDER,
  type PrimaryCategory,
  type Project,
  type Room,
} from "@/lib/content/types";
import { CATEGORY_TABS } from "@/lib/navigation";
import { useSeo } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

const isCategory = (value: string | null): value is PrimaryCategory =>
  value === "art" || value === "mirror" || value === "decor";

const isRoom = (value: string | null): value is Room =>
  value !== null && (ROOM_ORDER as string[]).includes(value);

const Portfolio = () => {
  const query = useProjects();
  const { data: settings } = useSiteSettings();
  const [params, setParams] = useSearchParams();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const rawCategory = params.get("category");
  const rawRoom = params.get("room");
  const category: PrimaryCategory | "all" = isCategory(rawCategory) ? rawCategory : "all";
  const room: Room | "all" = isRoom(rawRoom) ? rawRoom : "all";

  const setFilter = (key: "category" | "room", value: string) => {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
    setLightboxIndex(null);
  };

  const activeLabel = [
    category === "all" ? null : CATEGORY_SHORT_LABEL[category],
    room === "all" ? null : ROOM_LABEL[room],
  ]
    .filter(Boolean)
    .join(" · ");

  useSeo({
    title: activeLabel ? `${activeLabel} — Portfolio` : "Portfolio",
    description:
      settings?.seoDescription ??
      "Mirrors, portraits, art pieces and curated decor styled across homes in Nairobi.",
    path: "/portfolio",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Portfolio", path: "/portfolio" },
    ]),
  });

  const filtered = useMemo(() => {
    const all: Project[] = query.data ?? [];
    return all.filter(
      (p) =>
        (category === "all" || p.category === category) && (room === "all" || p.room === room),
    );
  }, [query.data, category, room]);

  const availableRooms = useMemo(() => {
    const present = new Set((query.data ?? []).map((p) => p.room));
    return ROOM_ORDER.filter((r) => present.has(r));
  }, [query.data]);

  return (
    <Section className="pt-32 md:pt-40">
      <SectionHeading
        eyebrow="The Full Portfolio"
        title="Browse by category"
        emphasis="or by space."
        lede="Every piece here is real work in a real home. Filter to the room you have in mind."
      />

      <div className="border-y border-hairline">
        <div className="-mx-3 flex flex-wrap items-center" role="tablist" aria-label="Category">
          {CATEGORY_TABS.map((tab) => {
            const active = category === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter("category", tab.id)}
                className={cn(
                  "focus-ring relative px-3 py-5 text-[11px] uppercase tracking-[0.28em] transition-colors duration-300 md:px-5 md:text-[12px]",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "absolute -bottom-px left-3 right-3 h-px transition-all duration-500 md:left-5 md:right-5",
                    active ? "bg-foreground" : "bg-transparent",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2" aria-label="Space">
        {(["all", ...availableRooms] as (Room | "all")[]).map((value) => {
          const active = room === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter("room", value)}
              className={cn(
                "focus-ring border px-4 py-2 text-[10px] uppercase tracking-[0.24em] transition-colors duration-300",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-hairline text-muted-foreground hover:border-foreground/60 hover:text-foreground",
              )}
            >
              {value === "all" ? "All Spaces" : ROOM_LABEL[value]}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
      </p>

      <div className="mt-12">
        <QueryBoundary
          query={query}
          loading={<GridSkeleton count={9} />}
          isEmpty={() => filtered.length === 0}
          empty={<EmptyState>No pieces in this combination yet — try another space.</EmptyState>}
        >
          {() => (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {filtered.map((project, i) => (
                  <Reveal key={project.id} delay={(i % 3) * 60}>
                    <ProjectCard
                      project={project}
                      priority={i < 3}
                      onExpand={() => setLightboxIndex(i)}
                    />
                  </Reveal>
                ))}
              </div>
              <Lightbox projects={filtered} index={lightboxIndex} onIndexChange={setLightboxIndex} />
            </>
          )}
        </QueryBoundary>
      </div>
    </Section>
  );
};

export default Portfolio;
