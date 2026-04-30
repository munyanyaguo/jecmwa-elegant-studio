import { PROJECTS } from "@/data/site";
import { ArrowUpRight } from "lucide-react";

const Projects = () => {
  return (
    <section id="projects" className="py-24 md:py-36">
      <div className="container-edge">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-20 reveal">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="hairline" />
              <span className="eyebrow">Selected Work · 2024 — 2025</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.02] text-foreground">
              Recent projects, <span className="italic font-light">styled</span> with restraint.
            </h2>
          </div>
          <p className="md:max-w-sm text-[15px] leading-[1.8] text-muted-foreground">
            A small selection of residential rooms, mirror compositions, and
            portrait edits we have shaped this season.
          </p>
        </div>

        {/* Editorial grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 auto-rows-auto">
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              className={`reveal group relative ${p.span ?? "lg:col-span-6"}`}
              style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            >
              <div className="relative overflow-hidden bg-stone aspect-[4/5] lg:aspect-[5/6]">
                <img
                  src={p.image}
                  alt={`${p.title} — ${p.type}`}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-80" />
                <div className="absolute top-5 left-5 right-5 flex items-start justify-between text-background/90">
                  <span className="text-[10px] uppercase tracking-[0.32em] bg-background/15 backdrop-blur-sm px-3 py-1.5 border border-background/20">
                    {p.type}
                  </span>
                  <span className="font-serif text-base">{p.id}</span>
                </div>
              </div>

              <div className="mt-6 flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2">
                    {p.location}
                  </div>
                  <h3 className="font-serif text-2xl md:text-[1.75rem] leading-tight text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.75] text-muted-foreground max-w-md">
                    {p.description}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-foreground/40 mt-1 transition-all duration-500 group-hover:text-accent group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 flex justify-center reveal">
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-foreground"
          >
            <span className="h-px w-10 bg-foreground/40 transition-all duration-500 group-hover:w-16 group-hover:bg-foreground" />
            Enquire about a project
            <span className="h-px w-10 bg-foreground/40 transition-all duration-500 group-hover:w-16 group-hover:bg-foreground" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
