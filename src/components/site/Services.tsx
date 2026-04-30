import { SERVICES } from "@/data/site";

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
              Whether you are styling a single room or composing a residence
              from the bones up, we move with care, restraint, and a slow
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
      </div>
    </section>
  );
};

export default Services;
