import { ABOUT_IMAGE } from "@/data/site";

const About = () => {
  return (
    <section id="about" className="py-24 md:py-36 bg-secondary/40">
      <div className="container-edge grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
        <div className="lg:col-span-5 reveal">
          <div className="aspect-[4/5] overflow-hidden bg-stone">
            <img
              src={ABOUT_IMAGE}
              alt="Entry foyer styled with a framed abstract painting and a bronze sunflower mirror cluster"
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
            A Nairobi studio for <span className="italic font-light">mirrors, portraits</span> and curated decor.
          </h2>

          <div className="mt-10 space-y-6 text-[15px] md:text-base leading-[1.85] text-muted-foreground max-w-xl">
            <p>
              JECMWA LIMITED is an interior styling practice working with
              homeowners across Nairobi. We compose mirror walls, frame
              portraits, source art pieces and place decor — room by room,
              with care.
            </p>
            <p>
              Over four years we have shaped 49 homes — corridors, lounges,
              dining rooms, bedrooms, washrooms, offices and duplex stairways.
              The work is quiet on purpose. A mirror sized to draw the right
              light. A portrait wall measured before it is hung. A few
              chosen objects given the room they deserve.
            </p>
            <p>
              We work with white oak and mahogany frames, in standard sizes
              from A4 to 200 × 120 cm — and in custom compositions for the
              walls that ask for them.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-hairline border-y border-hairline">
            {[
              ["Mirrors", "Sized & composed"],
              ["Portraits", "Framed & hung"],
              ["Art Pieces", "Selected & placed"],
              ["Decor", "Quietly sourced"],
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
