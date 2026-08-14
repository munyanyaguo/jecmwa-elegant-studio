import { Link } from "react-router-dom";
import { Section, SectionHeading, Reveal } from "@/components/primitives";
import { SmartImage } from "@/components/SmartImage";
import { QueryBoundary, SectionSkeleton } from "@/components/QueryBoundary";
import { useFrameFinishes, useServices, useSiteSettings, useSizeOptions } from "@/lib/content/hooks";
import { CATEGORY_LABEL, type PrimaryCategory } from "@/lib/content/types";
import { formatLeadTime, formatPriceFrom } from "@/lib/format";
import { routes } from "@/lib/navigation";

export const ServicesList = () => {
  const query = useServices();

  return (
    <Section tone="muted" id="services">
      <SectionHeading
        eyebrow="Studio Services"
        title="How we work"
        emphasis="with you."
        lede="Six ways into the studio. Most homes begin with one room and grow from there."
      />

      <QueryBoundary query={query} loading={<SectionSkeleton />}>
        {(services) => (
          <div className="border-t border-hairline">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={(i % 3) * 60}>
                <Link
                  to={routes.enquire}
                  state={{ serviceId: service.id }}
                  className="focus-ring group grid grid-cols-1 gap-4 border-b border-hairline px-2 py-10 transition-colors duration-500 hover:bg-background/60 md:grid-cols-12 md:gap-8 md:px-4"
                >
                  <div className="font-serif text-2xl text-muted-foreground transition-colors group-hover:text-accent md:col-span-1">
                    {service.number}
                  </div>
                  <h3 className="font-serif text-h3 text-foreground transition-colors group-hover:text-accent md:col-span-4">
                    {service.title}
                  </h3>
                  <div className="md:col-span-7">
                    <p className="text-[15px] leading-[1.85] text-muted-foreground">{service.body}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      <span>{formatPriceFrom(service.priceFromKes)}</span>
                      {formatLeadTime(service.leadTimeDays) ? (
                        <span>Lead time · {formatLeadTime(service.leadTimeDays)}</span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </QueryBoundary>
    </Section>
  );
};

export const Specifications = () => {
  const sizes = useSizeOptions();
  const finishes = useFrameFinishes();
  const { data: settings } = useSiteSettings();

  return (
    <Section id="specifications">
      <SectionHeading
        eyebrow="Standard Specifications"
        title="Sizes and finishes"
        emphasis="we work in."
        lede={settings?.priceDisclaimer}
      />

      <QueryBoundary query={sizes} loading={<SectionSkeleton />}>
        {(options) => {
          const byCategory = (category: PrimaryCategory) =>
            options.filter((o) => o.category === category);

          return (
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
              {(["art", "mirror"] as PrimaryCategory[]).map((category, i) => (
                <Reveal key={category} delay={i * 80}>
                  <h3 className="eyebrow mb-6">{CATEGORY_LABEL[category]}</h3>
                  <dl className="border-t border-hairline">
                    {byCategory(category).map((option) => (
                      <div
                        key={option.id}
                        className="flex items-baseline justify-between gap-6 border-b border-hairline py-4"
                      >
                        <dt className="font-serif text-lg text-foreground">{option.label}</dt>
                        <dd className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                          {formatPriceFrom(option.basePriceKes)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              ))}
            </div>
          );
        }}
      </QueryBoundary>

      <QueryBoundary query={finishes} loading={<SectionSkeleton className="mt-20" />}>
        {(items) => (
          <div className="mt-20">
            <h3 className="eyebrow mb-8">Frame Finishes</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
              {items.map((finish, i) => (
                <Reveal key={finish.id} delay={i * 80}>
                  <SmartImage
                    src={finish.imageUrl}
                    alt={finish.imageAlt || finish.name}
                    aspect="aspect-[4/3]"
                    imageClassName="transition-transform duration-1400 ease-elegant hover:scale-[1.03]"
                  />
                  <h4 className="mt-5 font-serif text-xl text-foreground">{finish.name}</h4>
                  <p className="mt-2 text-caption text-muted-foreground">{finish.note}</p>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </QueryBoundary>

      <div className="mt-16 flex justify-center">
        <Link
          to={routes.guides}
          className="focus-ring group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-foreground"
        >
          <span className="h-px w-10 bg-foreground/40 transition-all duration-500 group-hover:w-16 group-hover:bg-foreground" />
          Not sure what size you need?
        </Link>
      </div>
    </Section>
  );
};
