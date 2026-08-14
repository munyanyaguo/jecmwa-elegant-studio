import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Section, SectionHeading, Reveal } from "@/components/primitives";
import { ProjectCard } from "@/components/ProjectCard";
import { Lightbox } from "@/components/Lightbox";
import { QueryBoundary, GridSkeleton, EmptyState } from "@/components/QueryBoundary";
import { useProjects, useSiteSettings } from "@/lib/content/hooks";
import { ROOM_LABEL, ROOM_ORDER, type Room } from "@/lib/content/types";
import { routes } from "@/lib/navigation";
import { useSeo } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import NotFound from "./NotFound";

/** Room landing pages exist because people search "mirror for living room Nairobi". */
const Space = () => {
  const { room } = useParams<{ room: string }>();
  const query = useProjects();
  const { data: settings } = useSiteSettings();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const validRoom = (ROOM_ORDER as string[]).includes(room ?? "") ? (room as Room) : null;
  const label = validRoom ? ROOM_LABEL[validRoom] : "";
  const city = settings?.city ?? "Nairobi";

  const projects = useMemo(
    () => (query.data ?? []).filter((p) => p.room === validRoom),
    [query.data, validRoom],
  );

  useSeo({
    title: validRoom ? `${label} Styling, Mirrors & Art — ${city}` : "Spaces",
    description: validRoom
      ? `Mirrors, framed portraits and curated decor styled for the ${label.toLowerCase()} in homes across ${city}. See real work from the JECMWA studio.`
      : undefined,
    path: `/spaces/${room ?? ""}`,
    image: projects[0]?.heroImage?.url,
    jsonLd: validRoom
      ? breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Portfolio", path: "/portfolio" },
          { name: label, path: `/spaces/${validRoom}` },
        ])
      : undefined,
  });

  if (!validRoom) return <NotFound />;

  return (
    <Section className="pt-32 md:pt-40">
      <SectionHeading
        eyebrow={`Spaces · ${label}`}
        title={`${label} styling,`}
        emphasis={`composed for ${city} homes.`}
        lede={`Mirrors, portraits, art pieces and decor placed specifically for the ${label.toLowerCase()} — sized to the wall and matched to the light in the room.`}
      />

      <QueryBoundary
        query={query}
        loading={<GridSkeleton count={6} />}
        isEmpty={() => projects.length === 0}
        empty={
          <EmptyState>
            No {label.toLowerCase()} work published yet —{" "}
            <Link to={routes.portfolio} className="focus-ring underline underline-offset-4">
              browse the full portfolio
            </Link>
            .
          </EmptyState>
        }
      >
        {() => (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {projects.map((project, i) => (
                <Reveal key={project.id} delay={(i % 3) * 60}>
                  <ProjectCard project={project} priority={i < 3} onExpand={() => setLightboxIndex(i)} />
                </Reveal>
              ))}
            </div>
            <Lightbox projects={projects} index={lightboxIndex} onIndexChange={setLightboxIndex} />
          </>
        )}
      </QueryBoundary>

      <nav className="mt-20 border-t border-hairline pt-10" aria-label="Other spaces">
        <h2 className="eyebrow mb-6">Other spaces</h2>
        <ul className="flex flex-wrap gap-2">
          {ROOM_ORDER.filter((r) => r !== validRoom).map((r) => (
            <li key={r}>
              <Link
                to={routes.space(r)}
                className="focus-ring inline-block border border-hairline px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:border-foreground/60 hover:text-foreground"
              >
                {ROOM_LABEL[r]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Section>
  );
};

export default Space;
