import { Link } from "react-router-dom";
import { Section, Reveal } from "@/components/primitives";
import { SmartImage } from "@/components/SmartImage";
import { useContentBlocks } from "@/lib/content/hooks";
import { CATEGORY_ORDER, CATEGORY_SHORT_LABEL } from "@/lib/content/types";
import { portfolioHref } from "@/lib/navigation";

const CATEGORY_NOTE: Record<string, string> = {
  mirror: "Sized & composed",
  art: "Framed & hung",
  decor: "Quietly sourced",
};

export const About = () => {
  const { data: blocks } = useContentBlocks();
  const about = blocks?.about;

  return (
    <Section tone="muted" id="about">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          <SmartImage
            src={about?.imageUrl ?? null}
            alt={about?.imageAlt ?? "A JECMWA styled interior"}
            aspect="aspect-[4/5]"
            imageClassName="transition-transform duration-1400 ease-elegant hover:scale-[1.03]"
          />
        </Reveal>

        <Reveal className="lg:col-span-7" delay={80}>
          {about?.eyebrow ? (
            <div className="mb-8 flex items-center gap-4">
              <span className="hairline" />
              <span className="eyebrow">{about.eyebrow}</span>
            </div>
          ) : null}

          <h2 className="font-serif text-h1 leading-[1.02] text-foreground">
            {about?.heading}
            {about?.headingEmphasis ? (
              <span className="font-light italic"> {about.headingEmphasis}</span>
            ) : null}
          </h2>

          <div className="mt-8 space-y-6">
            {about?.body.map((paragraph) => (
              <p key={paragraph} className="max-w-xl text-[15px] leading-[1.85] text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-6 border-t border-hairline pt-8 sm:grid-cols-3">
            {CATEGORY_ORDER.map((category) => (
              <li key={category}>
                <Link
                  to={portfolioHref({ category })}
                  className="focus-ring group block"
                >
                  <span className="block font-serif text-xl text-foreground transition-colors group-hover:text-accent">
                    {CATEGORY_SHORT_LABEL[category]}
                  </span>
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {CATEGORY_NOTE[category]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
};
