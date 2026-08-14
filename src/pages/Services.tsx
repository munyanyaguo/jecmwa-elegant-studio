import { ServicesList, Specifications } from "@/components/sections/Services";
import { ContactSection } from "@/components/sections/ContactSection";
import { useSiteSettings } from "@/lib/content/hooks";
import { useSeo } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

const Services = () => {
  const { data: settings } = useSiteSettings();

  useSeo({
    title: "Services & Pricing",
    description:
      "Interior styling, mirrors, portraits, curated decor and framed wall styling — with standard sizes, frame finishes and indicative pricing.",
    path: "/services",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]),
  });

  return (
    <>
      <div className="pt-16 md:pt-24">
        <ServicesList />
      </div>
      <Specifications />
      {settings ? (
        <p className="container-edge -mt-12 pb-24 text-caption text-muted-foreground">
          {settings.priceDisclaimer}
        </p>
      ) : null}
      <ContactSection />
    </>
  );
};

export default Services;
