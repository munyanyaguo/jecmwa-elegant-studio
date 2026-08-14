import { Section, SectionHeading, Reveal } from "@/components/primitives";
import { WallFitCalculator } from "@/components/WallFitCalculator";
import { QueryBoundary, SectionSkeleton } from "@/components/QueryBoundary";
import { ContactSection } from "@/components/sections/ContactSection";
import { useFaqs } from "@/lib/content/hooks";
import { useSeo } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";
import { EYE_LEVEL_CM, FURNITURE_GAP_CM, IDEAL_SPAN, MIN_SIDE_CLEARANCE_CM } from "@/lib/sizing";

const RULES = [
  {
    title: "Two-thirds of the wall",
    body: `A piece reads best when it spans about ${Math.round(IDEAL_SPAN * 100)}% of the wall — or of the furniture it hangs above. Narrower and it floats; wider and the wall feels crowded.`,
  },
  {
    title: `Centre at ${EYE_LEVEL_CM} cm`,
    body: "Galleries hang art with its centre at standing eye level. In a home that reads as calm and deliberate, whatever the ceiling height.",
  },
  {
    title: `${FURNITURE_GAP_CM} cm above furniture`,
    body: "Above a console, sofa or bed, leave roughly a hand's width between the top of the furniture and the bottom of the frame so the two read as one group.",
  },
  {
    title: `${MIN_SIDE_CLEARANCE_CM} cm of breathing room`,
    body: "Keep clear space either side. A piece that runs close to a corner or a switch plate will always look accidental.",
  },
];

const Guides = () => {
  const faqs = useFaqs();

  useSeo({
    title: "Wall-Fit Guide — What Size Mirror or Art Do I Need?",
    description:
      "Enter your wall measurements and see which mirror or art sizes will sit well, where to hang them, and what they cost. From the JECMWA studio in Nairobi.",
    path: "/guides",
    jsonLd: [
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Guides", path: "/guides" },
      ]),
      ...(faqs.data?.length ? [faqJsonLd(faqs.data)] : []),
    ],
  });

  return (
    <>
      <Section className="pt-32 md:pt-40">
        <SectionHeading
          eyebrow="Wall-Fit Guide"
          title="What size will actually"
          emphasis="fit your wall?"
          lede="The question every client asks first. Measure the wall, tell us the numbers, and we'll show you what sits well — and where to hang it."
        />
        <WallFitCalculator />
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="The rules we work to"
          title="Four measurements"
          emphasis="that decide everything."
          align="start"
        />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
          {RULES.map((rule, i) => (
            <Reveal key={rule.title} delay={(i % 2) * 80}>
              <div className="border-t border-hairline pt-8">
                <h3 className="font-serif text-h3 text-foreground">{rule.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.85] text-muted-foreground">{rule.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Questions" title="Before you" emphasis="measure." align="start" />
        <QueryBoundary query={faqs} loading={<SectionSkeleton />}>
          {(items) => (
            <dl className="border-t border-hairline">
              {items.map((faq, i) => (
                <Reveal key={faq.id} delay={(i % 3) * 60}>
                  <div className="grid grid-cols-1 gap-4 border-b border-hairline py-9 md:grid-cols-12 md:gap-8">
                    <dt className="font-serif text-h3 text-foreground md:col-span-5">{faq.question}</dt>
                    <dd className="text-[15px] leading-[1.85] text-muted-foreground md:col-span-7">
                      {faq.answer}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          )}
        </QueryBoundary>
      </Section>

      <ContactSection />
    </>
  );
};

export default Guides;
