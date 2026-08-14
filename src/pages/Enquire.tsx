import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Section, SectionHeading } from "@/components/primitives";
import { EnquiryForm } from "@/components/EnquiryForm";
import { useSiteSettings } from "@/lib/content/hooks";
import { routes } from "@/lib/navigation";
import { useSeo } from "@/lib/seo";

const Enquire = () => {
  const [reference, setReference] = useState<string | null>(null);
  const { data: settings } = useSiteSettings();

  useSeo({
    title: "Start an Enquiry",
    description:
      "Tell the JECMWA studio about your room — mirrors, portraits, art or decor. We reply personally, usually within a working day.",
    path: "/enquire",
    noindex: false,
  });

  if (reference) {
    return (
      <Section className="pt-32 md:pt-40">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-accent text-accent">
            <Check className="h-6 w-6" strokeWidth={1.4} />
          </span>
          <h1 className="font-serif text-h1 tracking-tightest text-foreground">
            Thank you — <span className="font-light italic">it's with us.</span>
          </h1>
          <p className="mt-8 text-[15px] leading-[1.85] text-muted-foreground">
            Your enquiry reference is{" "}
            <span className="font-serif text-lg text-foreground">{reference}</span>. We read every
            one personally and usually reply within a working day.
          </p>
          {settings ? (
            <p className="mt-4 text-caption text-muted-foreground">
              In a hurry?{" "}
              <a
                href={settings.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring underline underline-offset-4 hover:text-foreground"
              >
                Message the studio on WhatsApp
              </a>
              .
            </p>
          ) : null}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              to={routes.portfolio}
              className="focus-ring bg-foreground px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-background transition-colors duration-500 hover:bg-accent"
            >
              Browse the portfolio
            </Link>
            <Link
              to={routes.home}
              className="focus-ring text-[12px] uppercase tracking-[0.28em] text-foreground/80 hover:text-foreground"
            >
              <span className="border-b border-foreground/40 pb-1">Back to home</span>
            </Link>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-32 md:pt-40">
      <SectionHeading
        eyebrow="Begin a Conversation"
        title="Tell us about"
        emphasis="your home."
        lede="The more you can tell us, the more useful our first reply will be. Nothing here is compulsory except your name, email and a note about the room."
      />
      <div className="max-w-3xl">
        <EnquiryForm onSuccess={setReference} />
      </div>
    </Section>
  );
};

export default Enquire;
