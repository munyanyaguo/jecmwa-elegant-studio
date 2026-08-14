import { Link } from "react-router-dom";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import { SmartImage } from "./SmartImage";
import { CATEGORY_SHORT_LABEL, ROOM_LABEL, type Project } from "@/lib/content/types";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  /** Featured cards get the larger editorial treatment. */
  variant?: "grid" | "featured";
  priority?: boolean;
  onExpand?: () => void;
  className?: string;
};

export const ProjectCard = ({
  project,
  variant = "grid",
  priority = false,
  onExpand,
  className,
}: ProjectCardProps) => {
  const featured = variant === "featured";

  return (
    <article className={cn("group relative", className)}>
      <div className="relative">
        <Link
          to={routes.project(project.slug)}
          className="focus-ring block"
          aria-label={`${project.title} — ${project.caption}`}
        >
          <SmartImage
            src={project.heroImage?.url ?? null}
            alt={project.heroImage?.alt ?? project.title}
            blurDataUrl={project.heroImage?.blurDataUrl}
            priority={priority}
            aspect={featured ? "aspect-[4/5] lg:aspect-[5/6]" : "aspect-[4/5]"}
            imageClassName={cn(
              "transition-transform ease-out group-hover:scale-[1.04]",
              featured ? "duration-1600 group-hover:scale-[1.05]" : "duration-1400",
            )}
          />
          {/* Kept light at rest so the photography reads; deepens only on hover. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-transparent opacity-40 transition-opacity duration-700 group-hover:opacity-70" />

          <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between text-background/90 md:inset-x-5 md:top-5">
            <span
              className={cn(
                "border border-background/20 bg-background/15 uppercase tracking-[0.28em] backdrop-blur-sm",
                featured ? "px-3 py-1.5 text-[10px]" : "px-2.5 py-1 text-[9px]",
              )}
            >
              {CATEGORY_SHORT_LABEL[project.category]}
            </span>
            {featured ? (
              <span className="font-serif text-base">{ROOM_LABEL[project.room]}</span>
            ) : null}
          </div>
        </Link>

        {onExpand ? (
          <button
            type="button"
            onClick={onExpand}
            aria-label={`Enlarge ${project.title}`}
            className="focus-ring absolute bottom-4 right-4 border border-background/25 bg-background/15 p-2.5 text-background/80 opacity-0 backdrop-blur-sm transition-all duration-500 hover:bg-background/25 hover:text-background focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        ) : null}
      </div>

      <div className={cn("flex items-start justify-between gap-6", featured ? "mt-6" : "mt-4")}>
        <div className="flex-1">
          <div
            className={cn(
              "uppercase tracking-[0.26em] text-muted-foreground",
              featured ? "mb-2 text-[10px]" : "mb-1.5 text-[10px]",
            )}
          >
            {ROOM_LABEL[project.room]}
          </div>
          <h3
            className={cn(
              "font-serif leading-tight text-foreground",
              featured ? "text-h3" : "text-lg",
            )}
          >
            <Link to={routes.project(project.slug)} className="focus-ring hover:text-accent">
              {project.title}
            </Link>
          </h3>
          <p
            className={cn(
              "text-muted-foreground",
              featured ? "mt-3 max-w-md text-sm leading-[1.75]" : "mt-1.5 text-caption",
            )}
          >
            {project.caption}
          </p>
        </div>
        {featured ? (
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-foreground/40 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
        ) : null}
      </div>
    </article>
  );
};
