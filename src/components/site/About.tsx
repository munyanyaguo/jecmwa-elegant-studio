import about from "@/assets/about.jpg";

const About = () => {
  return (
    <section id="about" className="py-24 md:py-36 bg-secondary/40">
      <div className="container-edge grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
        <div className="lg:col-span-5 reveal">
          <div className="aspect-[4/5] overflow-hidden bg-stone">
            <img
              src={about}
              alt="Styled vignette with ceramic vase, eucalyptus, design books and a brass candleholder"
              className="h-full w-full object-cover transition-transform duration-[1400ms] hover:scale-[1.03]"
              loading="lazy"
              width={1024}
              height={1280}
            />
          </div>
        </div>

        <div className="lg:col-span-7 reveal">
          <div className="flex items-center gap-4 mb-8">
            <span className="hairline" />
            <span className="eyebrow">About the Studio</span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] text-foreground">
            A quiet practice in <span className="italic font-light">considered</span> residential styling.
          </h2>

          <div className="mt-10 space-y-6 text-[15px] md:text-base leading-[1.85] text-muted-foreground max-w-xl">
            <p>
              JECMWA LIMITED is a small interior styling studio working
              between architecture and decoration — shaping rooms that feel
              warm, layered, and unmistakably personal.
            </p>
            <p>
              Our work moves slowly, through detail. A mirror placed to draw
              the morning light. A portrait wall composed over a long
              afternoon. A few well-chosen objects allowed the room they
              deserve. We are interested in homes that age well.
            </p>
            <p>
              We work across interior styling, decorative mirrors, portrait
              curation, and the slow sourcing of decor — for clients who
              prefer restraint to spectacle, and character to convention.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-hairline border-y border-hairline">
            {[
              ["Mirrors", "Sourced & bespoke"],
              ["Portraits", "Edit & hang"],
              ["Decor", "Slow curation"],
              ["Styling", "Room by room"],
            ].map(([k, v]) => (
              <div key={k} className="bg-secondary/40 p-5">
                <div className="font-serif text-xl text-foreground">{k}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
