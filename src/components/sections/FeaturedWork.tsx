import { useState } from "react";
import { Link } from "react-router-dom";
import { Section, SectionHeading, Reveal, RuleLink } from "@/components/primitives";
import { ProjectCard } from "@/components/ProjectCard";
import { Lightbox } from "@/components/Lightbox";
import { QueryBoundary, GridSkeleton, EmptyState } from "@/components/QueryBoundary";
import { useProjects } from "@/lib/content/hooks";
import { routes } from "@/lib/navigation";

// Alternating 7/5 spans keep the grid editorial rather than uniform.
const FEATURED_SPANS = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-7",
  "lg:col-span-5",
];

export const FeaturedWork = () => {
  const query = useProjects();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <Section id="work">
      <SectionHeading
        eyebrow="Selected Work"
        title="A portfolio of"
        emphasis="mirrors, portraits and styled rooms."
        lede="Composed across corridors, lounges, dining rooms, bedrooms and stairways — every piece shown here is real work, in real homes."
      />

      <QueryBoundary
        query={query}
        loading={<GridSkeleton count={6} />}
        isEmpty={(projects) => projects.filter((p) => p.featured).length === 0}
        empty={<EmptyState>Featured work is being prepared.</EmptyState>}
      >
        {(projects) => {
          const featured = projects.filter((p) => p.featured).slice(0, 6);
          return (
            <>
              <div className="grid auto-rows-auto grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                {featured.map((project, i) => (
                  <Reveal
                    key={project.id}
                    delay={(i % 3) * 80}
                    className={FEATURED_SPANS[i] ?? "lg:col-span-6"}
                  >
                    <ProjectCard
                      project={project}
                      variant="featured"
                      priority={i === 0}
                      onExpand={() => setLightboxIndex(i)}
                    />
                  </Reveal>
                ))}
              </div>

              <Lightbox
                projects={featured}
                index={lightboxIndex}
                onIndexChange={setLightboxIndex}
              />

              <div className="mt-20 flex flex-col items-center gap-8">
                <RuleLink href={routes.portfolio}>Browse the full portfolio</RuleLink>
                <Link
                  to={routes.enquire}
                  className="focus-ring text-[11px] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="border-b border-hairline pb-1">Enquire about a project</span>
                </Link>
              </div>
            </>
          );
        }}
      </QueryBoundary>
    </Section>
  );
};
