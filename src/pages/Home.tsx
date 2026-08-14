import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { ServicesList } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactSection } from "@/components/sections/ContactSection";
import { useSiteSettings } from "@/lib/content/hooks";
import { useSeo } from "@/lib/seo";
import { localBusinessJsonLd } from "@/lib/structured-data";

const Home = () => {
  const { data: settings } = useSiteSettings();

  useSeo({
    title: settings?.seoTitle ?? "Interior Styling, Mirrors & Curated Decor",
    description: settings?.seoDescription,
    path: "/",
    jsonLd: settings ? localBusinessJsonLd(settings) : undefined,
  });

  return (
    <>
      <Hero />
      <About />
      <FeaturedWork />
      <ServicesList />
      <Testimonials />
      <ContactSection />
    </>
  );
};

export default Home;
