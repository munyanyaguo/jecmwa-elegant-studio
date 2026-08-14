import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Lightbox } from "@/components/Lightbox";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/primitives";
import { QueryBoundary, GridSkeleton } from "@/components/QueryBoundary";
import { useFrameFinishes, useProject, useProjects } from "@/lib/content/hooks";
import { CATEGORY_LABEL, ROOM_LABEL } from "@/lib/content/types";
import { formatLeadTime, formatPriceFrom } from "@/lib/format";
import { portfolioHref, routes } from "@/lib/navigation";
import { useSeo } from "@/lib/seo";
import { breadcrumbJsonLd, projectJsonLd } from "@/lib/structured-data";
import NotFound from "./NotFound";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const query = useProject(slug);
  const { data: allProjects } = useProjects();
  const { data: finishes } = useFrameFinishes();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const project = query.data ?? null;

  const related = useMemo(() => {
    if (!project || !allProjects) return [];
    return allProjects
      .filter((p) => p.id !== project.id && (p.room === project.room || p.category === project.category))
      .slice(0, 3);
  }, [project, allProjects]);

  const frameFinish = finishes?.find((f) => f.id === project?.frameFinishId);

  useSeo({
    title: project?.seoTitle ?? project?.title ?? "Project",
    description: project?.seoDescription ?? project?.summary ?? project?.caption,
    path: `/portfolio/${slug ?? ""}`,
    image: project?.heroImage?.url,
    type: "article",
    jsonLd: project
      ? [
          projectJsonLd(project),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
            { name: project.title, path: `/portfolio/${project.slug}` },
          ]),
        ]
      : undefined,
  });

  if (query.isSuccess && !project) return <NotFound />;

  const specs = project
    ? [
        { label: "Category", value: CATEGORY_LABEL[project.category] },
        { label: "Space", value: ROOM_LABEL[project.room] },
        { label: "Location", value: project.location },
        { label: "Dimensions", value: project.dimensions },
        { label: "Frame finish", value: frameFinish?.name },
        { label: "Lead time", value: formatLeadTime(project.leadTimeDays) },
        { label: "From", value: formatPriceFrom(project.priceFromKes) },
      ].filter((spec) => Boolean(spec.value))
    : [];

  return (
    <QueryBoundary query={query} loading={<GridSkeleton count={3} />}>
      {() =>
        project ? (
          <article className="pb-24 pt-32 md:pt-40">
            <div className="container-edge">
              <Link
                to={routes.portfolio}
                className="focus-ring group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
                Back to the portfolio
              </Link>

              <header className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-7">
                  <div className="mb-6 flex items-center gap-4">
                    <span className="hairline" />
                    <Link to={portfolioHref({ category: project.category })} className="eyebrow focus-ring">
                      {CATEGORY_LABEL[project.category]}
                    </Link>
                  </div>
                  <h1 className="font-serif text-h1 tracking-tightest text-foreground">
                    {project.title}
                  </h1>
                  <p className="mt-6 max-w-xl text-[15px] leading-[1.85] text-muted-foreground md:text-base">
                    {project.summary ?? project.caption}
                  </p>
                </div>

                <dl className="lg:col-span-5 lg:pt-4">
                  {specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-baseline justify-between gap-6 border-b border-hairline py-3.5"
                    >
                      <dt className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                        {spec.label}
                      </dt>
                      <dd className="text-right font-serif text-base text-foreground">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </header>

              <Reveal className="mt-14">
                <SmartImage
                  src={project.heroImage?.url ?? null}
                  alt={project.heroImage?.alt ?? project.title}
                  blurDataUrl={project.heroImage?.blurDataUrl}
                  aspect="aspect-[3/2]"
                  priority
                />
              </Reveal>

              {project.beforeImage && project.afterImage ? (
                <Reveal className="mt-20">
                  <h2 className="eyebrow mb-6">Before & After</h2>
                  <BeforeAfter before={project.beforeImage} after={project.afterImage} />
                </Reveal>
              ) : null}

              {(project.brief || project.approach || project.outcome) && (
                <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
                  {[
                    { title: "The brief", body: project.brief },
                    { title: "The approach", body: project.approach },
                    { title: "The outcome", body: project.outcome },
                  ]
                    .filter((part) => Boolean(part.body))
                    .map((part, i) => (
                      <Reveal key={part.title} delay={i * 80}>
                        <h2 className="eyebrow mb-5">{part.title}</h2>
                        <p className="whitespace-pre-line text-[15px] leading-[1.85] text-muted-foreground">
                          {part.body}
                        </p>
                      </Reveal>
                    ))}
                </div>
              )}

              {project.images.length > 1 ? (
                <div className="mt-20">
                  <h2 className="eyebrow mb-8">The gallery</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
                    {project.images
                      .filter((image) => image.role === "gallery" || image.role === "detail")
                      .map((image, i) => (
                        <Reveal key={image.id} delay={(i % 2) * 80}>
                          <button
                            type="button"
                            onClick={() => setLightboxIndex(0)}
                            className="focus-ring block w-full"
                          >
                            <SmartImage
                              src={image.url}
                              alt={image.alt}
                              blurDataUrl={image.blurDataUrl}
                              aspect="aspect-[4/3]"
                              imageClassName="transition-transform duration-1400 ease-elegant hover:scale-[1.03]"
                            />
                          </button>
                        </Reveal>
                      ))}
                  </div>
                </div>
              ) : null}

              <Lightbox projects={[project]} index={lightboxIndex} onIndexChange={setLightboxIndex} />

              <Reveal className="mt-24 border-y border-hairline py-14 text-center">
                <h2 className="font-serif text-h2 text-foreground">
                  Something similar for <span className="font-light italic">your home?</span>
                </h2>
                <Link
                  to={routes.enquire}
                  state={{ projectSlug: project.slug, category: project.category, room: project.room }}
                  className="focus-ring group mt-8 inline-flex items-center gap-3 bg-foreground px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-background transition-colors duration-500 hover:bg-accent"
                >
                  Enquire about this piece
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              </Reveal>

              {related.length ? (
                <div className="mt-20">
                  <h2 className="eyebrow mb-8">More from the studio</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
                    {related.map((item, i) => (
                      <Reveal key={item.id} delay={i * 60}>
                        <ProjectCard project={item} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </article>
        ) : null
      }
    </QueryBoundary>
  );
};

export default ProjectDetail;
