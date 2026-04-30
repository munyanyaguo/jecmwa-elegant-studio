import { CONTACT } from "@/data/site";
import { Phone, Mail, MessageCircle, ArrowRight } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 md:py-36 bg-foreground text-background">
      <div className="container-edge">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
          <div className="lg:col-span-6 reveal">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-12 bg-background/40" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-background/60">
                Begin a Conversation
              </span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.02] text-background">
              Tell us about <span className="italic font-light">your home.</span>
            </h2>

            <p className="mt-8 max-w-md text-[15px] md:text-base leading-[1.85] text-background/70">
              We take on a small number of residential projects each season.
              Share a little about your space and how you live in it, and we
              will be in touch personally.
            </p>

            <div className="mt-12 space-y-2 text-sm text-background/60">
              <div>{CONTACT.location}</div>
              <div>{CONTACT.hours}</div>
            </div>
          </div>

          <div className="lg:col-span-6 reveal">
            <div className="border border-background/15">
              {[
                { icon: MessageCircle, label: "WhatsApp", value: "Message the studio", href: CONTACT.whatsapp },
                { icon: Phone, label: "Telephone", value: CONTACT.phoneDisplay, href: CONTACT.phone },
                { icon: Mail, label: "Email", value: CONTACT.emailDisplay, href: CONTACT.email },
              ].map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex items-center justify-between gap-6 p-7 md:p-9 border-b border-background/15 last:border-b-0 transition-colors duration-500 hover:bg-background/[0.04]"
                >
                  <div className="flex items-center gap-6">
                    <Icon className="h-5 w-5 text-background/60 transition-colors duration-500 group-hover:text-accent" strokeWidth={1.4} />
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.28em] text-background/50 mb-1.5">
                        {label}
                      </div>
                      <div className="font-serif text-xl md:text-2xl text-background">{value}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-background/40 transition-all duration-500 group-hover:translate-x-1 group-hover:text-background" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
