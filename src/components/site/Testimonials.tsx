import { TESTIMONIALS } from "@/data/site";

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 md:py-36">
      <div className="container-edge">
        <div className="max-w-2xl mb-16 md:mb-20 reveal">
          <div className="flex items-center gap-4 mb-8">
            <span className="hairline" />
            <span className="eyebrow">In Their Words</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] text-foreground">
            Quiet praise from <span className="italic font-light">considered</span> homes.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border border-hairline">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={t.name}
              className="bg-background p-8 md:p-10 lg:p-12 flex flex-col reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="font-serif text-6xl leading-none text-accent/70 mb-6" aria-hidden>
                “
              </span>
              <blockquote className="font-serif text-xl md:text-[1.4rem] leading-[1.55] text-foreground/90 italic flex-1">
                {t.quote}
              </blockquote>
              <figcaption className="mt-10 pt-6 border-t border-hairline">
                <div className="font-serif text-base text-foreground">{t.name}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  {t.label}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
