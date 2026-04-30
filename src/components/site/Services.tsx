import { SERVICES, ART_SIZES, MIRROR_SIZES, FRAME_FINISHES } from "@/data/site";

const Services = () => {
  return (
    <section id="services" className="py-24 md:py-36 bg-secondary/40">
      <div className="container-edge">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 md:mb-20">
          <div className="lg:col-span-5 reveal">
            <div className="flex items-center gap-4 mb-8">
              <span className="hairline" />
              <span className="eyebrow">Studio Services</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] text-foreground">
              How we <span className="italic font-light">work</span> with you.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 reveal">
            <p className="text-[15px] md:text-base leading-[1.85] text-muted-foreground">
              Each engagement is shaped to the home and the people in it.
              Whether you are styling a single room, composing a mirror wall or
              framing a family of portraits, we move with care, restraint and
              attention to detail.
            </p>
          </div>
        </div>

        {/* Editorial list */}
        <div className="border-t border-hairline">
          {SERVICES.map((s, i) => (
            <article
              key={s.n}
              className="group grid grid-cols-12 gap-6 md:gap-10 items-start py-8 md:py-12 border-b border-hairline reveal transition-colors duration-700 hover:bg-background/60 -mx-6 md:-mx-10 lg:-mx-16 px-6 md:px-10 lg:px-16"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="col-span-2 md:col-span-1 font-serif text-base text-muted-foreground pt-2">
                {s.n}
              </div>
              <div className="col-span-10 md:col-span-4">
                <h3 className="font-serif text-2xl md:text-[1.85rem] leading-tight text-foreground transition-colors duration-500 group-hover:text-accent">
                  {s.title}
                </h3>
              </div>
              <div className="col-span-12 md:col-span-7 text-[15px] leading-[1.85] text-muted-foreground">
                {s.body}
              </div>
            </article>
          ))}
        </div>

        {/* Specifications */}
        <div className="mt-24 md:mt-32 reveal">
          <div className="flex items-center gap-4 mb-8">
            <span className="hairline" />
            <span className="eyebrow">Standard Specifications</span>
          </div>
          <h3 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.05] text-foreground max-w-2xl">
            Sizes and finishes, <span className="italic font-light">considered.</span>
          </h3>
          <p className="mt-6 max-w-xl text-[15px] leading-[1.85] text-muted-foreground">
            Our portraits, art pieces and mirrors are offered in a measured
            range of standard sizes, with two house frame finishes. Custom
            sizes and compositions are quoted on request.
          </p>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-px bg-hairline border border-hairline">
            <div className="bg-background p-8 md:p-10">
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-3">
                Art Pieces & Portraits
              </div>
              <div className="font-serif text-2xl text-foreground mb-6">Standard sizes</div>
              <ul className="space-y-2.5">
                {ART_SIZES.map((s) => (
                  <li
                    key={s}
                    className="flex items-baseline justify-between border-b border-hairline/70 pb-2.5 text-[14px] text-foreground/85"
                  >
                    <span className="font-serif text-base">{s}</span>
                    <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Framed
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background p-8 md:p-10">
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-3">
                Mirrors
              </div>
              <div className="font-serif text-2xl text-foreground mb-6">Standard sizes</div>
              <ul className="space-y-2.5">
                {MIRROR_SIZES.map((s) => (
                  <li
                    key={s}
                    className="flex items-baseline justify-between border-b border-hairline/70 pb-2.5 text-[14px] text-foreground/85"
                  >
                    <span className="font-serif text-base">{s}</span>
                    <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Framed
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Frame finishes */}
          <div className="mt-16">
            <div className="flex items-baseline justify-between mb-8">
              <div className="eyebrow">Laminate Frame Finishes</div>
              <div className="hidden md:block text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                House selection
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:gap-10">
              {FRAME_FINISHES.map((f) => (
                <article key={f.name} className="bg-background border border-hairline grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-7 aspect-[4/3] md:aspect-auto overflow-hidden bg-stone">
                    <img
                      src={f.image}
                      alt={`${f.name} — laminate frame profile`}
                      loading="lazy"
                      width={1024}
                      height={1366}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-5 p-7 md:p-10 flex flex-col justify-center">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2">
                      Laminate frames
                    </div>
                    <div className="font-serif text-2xl md:text-3xl text-foreground">{f.name}</div>
                    <p className="mt-4 text-[14px] leading-[1.85] text-muted-foreground">
                      {f.note}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
