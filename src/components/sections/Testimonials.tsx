import { Section, SectionHeading, Reveal } from "@/components/primitives";
import { QueryBoundary, SectionSkeleton, EmptyState } from "@/components/QueryBoundary";
import { useTestimonials } from "@/lib/content/hooks";

export const Testimonials = () => {
  const query = useTestimonials();

  return (
    <Section id="testimonials" tone="muted">
      <SectionHeading
        eyebrow="In Their Words"
        title="What the homes"
        emphasis="say back."
        align="start"
      />

      <QueryBoundary
        query={query}
        loading={<SectionSkeleton />}
        isEmpty={(items) => items.length === 0}
        empty={<EmptyState>Client words are being gathered.</EmptyState>}
      >
        {(items) => (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={i * 100}>
                <figure className="flex h-full flex-col border-t border-hairline pt-8">
                  <span aria-hidden className="font-serif text-5xl leading-none text-accent/70">
                    &ldquo;
                  </span>
                  <blockquote className="mt-4 flex-1 font-serif text-xl italic leading-[1.5] text-foreground">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-8">
                    <span className="block text-sm text-foreground">{item.authorName}</span>
                    <span className="mt-1 block text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      {item.authorLabel}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </QueryBoundary>
    </Section>
  );
};
