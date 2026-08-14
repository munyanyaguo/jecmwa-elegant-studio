import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import { useContentBlocks, useProjects, useSiteSettings } from "@/lib/content/hooks";
import { routes } from "@/lib/navigation";

export const Hero = () => {
  const { data: blocks } = useContentBlocks();
  const { data: settings } = useSiteSettings();
  const { data: projects } = useProjects();

  const hero = blocks?.hero;
  const featured = projects?.find((p) => p.featured);
  const [emphasisLine, ...paragraphs] = hero?.body ?? [];

  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="container-edge">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6 lg:pb-8">
            <div className="mb-10 flex animate-fade-up items-center gap-4">
              <span className="hairline" />
              <span className="eyebrow">{hero?.eyebrow ?? "JECMWA Limited · Nairobi"}</span>
            </div>

            <h1
              className="animate-fade-up font-serif text-display tracking-tightest text-foreground"
              style={{ animationDelay: "120ms" }}
            >
              {hero?.heading ?? "Mirrors, portraits"}
              <span className="block font-light italic text-foreground/85">
                {hero?.headingEmphasis ?? "and curated decor"}
              </span>
              <span className="block">{emphasisLine ?? "for considered homes."}</span>
            </h1>

            {paragraphs.map((line) => (
              <p
                key={line}
                className="mt-10 max-w-md animate-fade-up text-base leading-[1.75] text-muted-foreground md:text-[17px]"
                style={{ animationDelay: "240ms" }}
              >
                {line}
              </p>
            ))}

            <div
              className="mt-12 flex animate-fade-up flex-wrap items-center gap-x-8 gap-y-4"
              style={{ animationDelay: "360ms" }}
            >
              <Link
                to={routes.enquire}
                className="focus-ring group inline-flex items-center gap-3 bg-foreground px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-background transition-all duration-500 hover:bg-accent"
              >
                {hero?.ctaLabel ?? "Begin a Project"}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <Link
                to={routes.portfolio}
                className="focus-ring group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.28em] text-foreground/80 hover:text-foreground"
              >
                <span className="border-b border-foreground/40 pb-1 transition-colors group-hover:border-foreground">
                  See the Portfolio
                </span>
              </Link>
            </div>

            {settings?.stats?.length ? (
              <dl
                className="mt-16 grid max-w-md animate-fade-up grid-cols-3 gap-6 border-t border-hairline pt-8"
                style={{ animationDelay: "480ms" }}
              >
                {settings.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-serif text-3xl text-foreground">{stat.value}</span>
                      <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          <div className="relative lg:col-span-6">
            <SmartImage
              src={hero?.imageUrl ?? null}
              alt={hero?.imageAlt ?? "Featured JECMWA styling work"}
              aspect="aspect-[4/5] md:aspect-[5/6]"
              priority
              className="animate-image-in"
            />
            {featured ? (
              <div className="absolute -bottom-6 -left-6 hidden md:block">
                <Link
                  to={routes.project(featured.slug)}
                  className="focus-ring block max-w-[280px] border border-hairline bg-background px-6 py-4 shadow-soft transition-colors hover:border-accent"
                >
                  <div className="eyebrow mb-2">Featured Work</div>
                  <div className="font-serif text-lg leading-snug text-foreground">
                    {featured.title}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{featured.caption}</div>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
