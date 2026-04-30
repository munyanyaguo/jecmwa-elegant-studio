import hero from "@/assets/hero.jpg";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden">
      <div className="container-edge">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          {/* Copy */}
          <div className="lg:col-span-6 lg:pb-8">
            <div className="flex items-center gap-4 mb-10 animate-fade-up">
              <span className="hairline" />
              <span className="eyebrow">Interior Design Studio · Est. Nairobi</span>
            </div>

            <h1
              className="font-serif text-[2.75rem] sm:text-6xl lg:text-[5.25rem] leading-[0.98] tracking-tightest text-foreground animate-fade-up"
              style={{ animationDelay: "120ms" }}
            >
              Interiors composed
              <span className="block italic font-light text-foreground/85">with quiet</span>
              <span className="block">intention.</span>
            </h1>

            <p
              className="mt-10 max-w-md text-base md:text-[17px] leading-[1.75] text-muted-foreground animate-fade-up"
              style={{ animationDelay: "240ms" }}
            >
              JECMWA LIMITED is a residential styling studio working with mirrors,
              portraits, and curated decor — shaping rooms that feel collected,
              warm, and unmistakably your own.
            </p>

            <div
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 animate-fade-up"
              style={{ animationDelay: "360ms" }}
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 bg-foreground px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-background transition-all duration-500 hover:bg-accent"
              >
                Contact the Studio
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
              </a>
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.28em] text-foreground/80 hover:text-foreground"
              >
                <span className="border-b border-foreground/40 pb-1 transition-colors group-hover:border-foreground">
                  View Projects
                </span>
              </a>
            </div>

            <div
              className="mt-16 grid grid-cols-3 max-w-md gap-6 pt-8 border-t border-hairline animate-fade-up"
              style={{ animationDelay: "480ms" }}
            >
              {[
                ["12+", "Years styling"],
                ["80+", "Homes shaped"],
                ["6", "Studio services"],
              ].map(([k, v]) => (
                <div key={k}>
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
                src={hero}
                alt="Sunlit luxury living room with arched window, sculptural mirror, linen sofa and oak coffee table"
                className="h-full w-full object-cover"
                width={1280}
                height={1600}
                fetchPriority="high"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:block">
              <div className="bg-background border border-hairline px-6 py-4 shadow-soft max-w-[260px]">
                <div className="eyebrow mb-2">Featured</div>
                <div className="font-serif text-lg leading-snug text-foreground">
                  The Ashford Residence
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Karen, Nairobi · 2025</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
