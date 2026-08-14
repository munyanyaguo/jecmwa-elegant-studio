import { Link } from "react-router-dom";
import { Phone, Mail, MessageCircle, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/primitives";
import { useContentBlocks, useSiteSettings } from "@/lib/content/hooks";
import { routes } from "@/lib/navigation";

export const ContactSection = () => {
  const { data: settings } = useSiteSettings();
  const { data: blocks } = useContentBlocks();
  const block = blocks?.contact;

  const channels = settings
    ? [
        {
          icon: MessageCircle,
          label: "WhatsApp",
          value: settings.phoneDisplay,
          href: settings.whatsappHref,
          external: true,
        },
        { icon: Phone, label: "Telephone", value: settings.phoneDisplay, href: settings.telHref },
        { icon: Mail, label: "Email", value: settings.email, href: settings.mailtoHref },
      ]
    : [];

  return (
    <section id="contact" className="bg-foreground py-24 text-background md:py-36">
      <div className="container-edge">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-6">
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-12 bg-background/40" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-background/60">
                {block?.eyebrow ?? "Begin a Conversation"}
              </span>
            </div>

            <h2 className="font-serif text-h1 leading-[1.02] text-background">
              {block?.heading ?? "Tell us about"}
              <span className="font-light italic"> {block?.headingEmphasis ?? "your home."}</span>
            </h2>

            {block?.body.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-8 max-w-md text-[15px] leading-[1.85] text-background/70 md:text-base"
              >
                {paragraph}
              </p>
            ))}

            <Link
              to={routes.enquire}
              className="focus-ring-invert group mt-10 inline-flex items-center gap-3 bg-background px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-foreground transition-colors duration-500 hover:bg-accent hover:text-accent-foreground"
            >
              Start a detailed enquiry
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>

            {settings ? (
              <div className="mt-12 space-y-2 text-sm text-background/60">
                <div>{settings.location}</div>
                <div>{settings.hours}</div>
              </div>
            ) : null}
          </Reveal>

          <Reveal className="lg:col-span-6" delay={80}>
            <div className="border border-background/15">
              {channels.map(({ icon: Icon, label, value, href, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="focus-ring-invert group flex items-center justify-between gap-6 border-b border-background/15 p-7 transition-colors duration-500 last:border-b-0 hover:bg-background/[0.04] md:p-9"
                >
                  <span className="flex items-center gap-6">
                    <Icon
                      className="h-5 w-5 text-background/60 transition-colors duration-500 group-hover:text-accent"
                      strokeWidth={1.4}
                    />
                    <span>
                      <span className="mb-1.5 block text-[10px] uppercase tracking-[0.28em] text-background/50">
                        {label}
                      </span>
                      <span className="block break-all font-serif text-xl text-background md:break-normal md:text-2xl">
                        {value}
                      </span>
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-background/40 transition-all duration-500 group-hover:translate-x-1 group-hover:text-background" />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
