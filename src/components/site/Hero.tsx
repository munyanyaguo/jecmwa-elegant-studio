import { ArrowRight } from "lucide-react";
import { HERO_IMAGE, STATS } from "@/data/site";

const Hero = () => {
  return (
    <section id="home" className="relative pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden">
      <div className="container-edge">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          {/* Copy */}
          <div className="lg:col-span-6 lg:pb-8">
            <div className="flex items-center gap-4 mb-10 animate-fade-up">
              <span className="hairline" />
              <span className="eyebrow">JECMWA Limited · Nairobi</span>
            </div>

            <h1
              className="font-serif text-[2.75rem] sm:text-6xl lg:text-[5.25rem] leading-[0.98] tracking-tightest text-foreground animate-fade-up"
              style={{ animationDelay: "120ms" }}
            >
              Mirrors, portraits
              <span className="block italic font-light text-foreground/85">and curated decor</span>
              <span className="block">for considered homes.</span>
            </h1>

            <p
              className="mt-10 max-w-md text-base md:text-[17px] leading-[1.75] text-muted-foreground animate-fade-up"
              style={{ animationDelay: "240ms" }}
            >
              An interior styling studio working room by room — composing mirror
              walls, framed portraits, art pieces and decor placements that
              quietly settle into the rhythm of a home.
            </p>

            <div
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 animate-fade-up"
              style={{ animationDelay: "360ms" }}
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 bg-foreground px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-background transition-all duration-500 hover:bg-accent"
              >
                Begin a Project
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
              </a>
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.28em] text-foreground/80 hover:text-foreground"
              >
                <span className="border-b border-foreground/40 pb-1 transition-colors group-hover:border-foreground">
                  See the Portfolio
                </span>
              </a>
            </div>

            <div
              className="mt-16 grid grid-cols-3 max-w-md gap-6 pt-8 border-t border-hairline animate-fade-up"
              style={{ animationDelay: "480ms" }}
            >
              {STATS.map(({ k, v }) => (
                <div key={v}>
                  <div className="font-serif text-3xl text-foreground">{k}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-stone animate-image-in">
              <img
                src={HERO_IMAGE}
                alt="Six panel framed mirror grid styled on a duplex stairway landing beside a botanical art panel"
                className="h-full w-full object-cover"
                width={1280}
                height={1600}
                fetchPriority="high"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:block">
              <div className="bg-background border border-hairline px-6 py-4 shadow-soft max-w-[280px]">
                <div className="eyebrow mb-2">Featured Work</div>
                <div className="font-serif text-lg leading-snug text-foreground">
                  Six-panel mirror cluster
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Duplex stairway · Nairobi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
