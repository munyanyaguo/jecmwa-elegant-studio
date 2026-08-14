import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactSection } from "@/components/sections/ContactSection";
import { Section, SectionHeading, Reveal } from "@/components/primitives";
import { QueryBoundary, SectionSkeleton } from "@/components/QueryBoundary";
import { useFaqs, useSiteSettings } from "@/lib/content/hooks";
import { useSeo } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";

const PROCESS = [
  { step: "01", title: "Conversation", body: "A short call or WhatsApp exchange about the room, what's already there, and what it needs." },
  { step: "02", title: "Studio visit", body: "We measure the wall, read the light, and photograph the space so nothing is guessed later." },
  { step: "03", title: "Proposal", body: "Sizes, frame finishes, placement and a written quote — with lead times confirmed up front." },
  { step: "04", title: "Making & framing", body: "Pieces are produced and framed to the agreed specification in our laminate profiles." },
  { step: "05", title: "Hanging", body: "We deliver, level and hang everything ourselves. Hanging is part of the work, not an extra." },
];

const Studio = () => {
  const faqs = useFaqs();
  const { data: settings } = useSiteSettings();

  useSeo({
    title: "The Studio",
    description:
      "How JECMWA works — the process from first conversation to hanging day, and answers to the questions clients ask most.",
    path: "/studio",
    jsonLd: [
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Studio", path: "/studio" },
      ]),
      ...(faqs.data?.length ? [faqJsonLd(faqs.data)] : []),
    ],
  });

  return (
    <>
      <div className="pt-16 md:pt-24">
        <About />
      </div>

      <Section id="process">
        <SectionHeading
          eyebrow="How it works"
          title="From first conversation"
          emphasis="to hanging day."
          lede="No surprises. Every stage is agreed in writing before the next one starts."
        />
        <ol className="border-t border-hairline">
          {PROCESS.map((item, i) => (
            <Reveal as="li" key={item.step} delay={(i % 3) * 60}>
              <div className="grid grid-cols-1 gap-4 border-b border-hairline py-9 md:grid-cols-12 md:gap-8">
                <span className="font-serif text-2xl text-muted-foreground md:col-span-1">{item.step}</span>
                <h3 className="font-serif text-h3 text-foreground md:col-span-4">{item.title}</h3>
                <p className="text-[15px] leading-[1.85] text-muted-foreground md:col-span-7">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        {settings?.serviceAreas.length ? (
          <Reveal className="mt-14">
            <h3 className="eyebrow mb-4">Where we work</h3>
            <p className="text-[15px] leading-[1.85] text-muted-foreground">
              {settings.serviceAreas.join(" · ")}. Work further afield is possible — tell us where you are.
            </p>
          </Reveal>
        ) : null}
      </Section>

      <Section tone="muted" id="faq">
        <SectionHeading eyebrow="Questions" title="The things clients" emphasis="ask first." align="start" />
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

      <Testimonials />
      <ContactSection />
    </>
  );
};

export default Studio;
