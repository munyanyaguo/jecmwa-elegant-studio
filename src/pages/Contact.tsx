import { ContactSection } from "@/components/sections/ContactSection";
import { Section, SectionHeading, Reveal } from "@/components/primitives";
import { useSiteSettings } from "@/lib/content/hooks";
import { useSeo } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

const Contact = () => {
  const { data: settings } = useSiteSettings();

  useSeo({
    title: "Contact",
    description:
      "Reach the JECMWA studio in Nairobi by WhatsApp, phone or email — or start a detailed enquiry about your room.",
    path: "/contact",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
  });

  return (
    <>
      <Section className="pb-0 pt-32 md:pt-40">
        <SectionHeading
          eyebrow="Contact"
          title="Reach the studio"
          emphasis="directly."
          lede="We respond personally, usually within a working day."
        />
        {settings ? (
          <Reveal className="grid grid-cols-1 gap-10 border-t border-hairline pt-10 md:grid-cols-3">
            {[
              { label: "Studio", value: settings.location },
              { label: "Hours", value: settings.hours },
              { label: "Service areas", value: settings.serviceAreas.join(" · ") },
            ]
              .filter((item) => Boolean(item.value))
              .map((item) => (
                <div key={item.label}>
                  <h2 className="eyebrow mb-3">{item.label}</h2>
                  <p className="text-[15px] leading-[1.85] text-muted-foreground">{item.value}</p>
                </div>
              ))}
          </Reveal>
        ) : null}
      </Section>
      <ContactSection />
    </>
  );
};

export default Contact;
