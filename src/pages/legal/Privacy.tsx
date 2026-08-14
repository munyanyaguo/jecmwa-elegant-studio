import { Section } from "@/components/primitives";
import { useSiteSettings } from "@/lib/content/hooks";
import { useSeo } from "@/lib/seo";

const Privacy = () => {
  const { data: settings } = useSiteSettings();

  useSeo({
    title: "Privacy",
    description: "How JECMWA LIMITED collects, uses and protects the information you share with the studio.",
    path: "/legal/privacy",
  });

  const email = settings?.email ?? "the studio";
  const updated = new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" });

  return (
    <Section className="pt-32 md:pt-40">
      <div className="max-w-2xl">
        <div className="mb-8 flex items-center gap-4">
          <span className="hairline" />
          <span className="eyebrow">Legal</span>
        </div>
        <h1 className="font-serif text-h1 tracking-tightest text-foreground">Privacy notice</h1>
        <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Last updated {updated}
        </p>

        <div className="prose prose-neutral mt-12 max-w-none dark:prose-invert prose-headings:font-serif prose-headings:font-normal prose-p:leading-[1.85] prose-p:text-muted-foreground prose-li:text-muted-foreground">
          <h2>What we collect</h2>
          <p>
            When you send an enquiry we collect the name, email address, phone number and project
            details you choose to give us, along with any photographs of your space that you upload.
            We also record basic technical information such as the page you arrived from, so we know
            which parts of the site are useful.
          </p>

          <h2>Why we collect it</h2>
          <ul>
            <li>To respond to your enquiry and prepare a quote.</li>
            <li>To arrange a studio visit and deliver the work you commission.</li>
            <li>To keep a record of projects for our own reference.</li>
          </ul>
          <p>
            We do not sell your information, and we do not share it with third parties for marketing.
          </p>

          <h2>Where it is stored</h2>
          <p>
            Enquiries are stored in a managed Supabase database with access restricted to studio
            staff. Photographs you upload are stored privately and are not publicly accessible.
            Transactional email is sent through Resend.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Enquiries that do not become projects are deleted after twenty-four months. Project
            records are kept for as long as we may reasonably need them for warranty or reference.
          </p>

          <h2>Your rights</h2>
          <p>
            You may ask us for a copy of the information we hold about you, ask us to correct it, or
            ask us to delete it. Write to {email} and we will respond within thirty days.
          </p>

          <h2>Cookies</h2>
          <p>
            This site does not use advertising or tracking cookies. Your theme preference is stored
            in your browser's local storage and never leaves your device. If analytics are enabled,
            they are cookieless and collect no personal data.
          </p>

          <h2>Contact</h2>
          <p>Questions about this notice can be sent to {email}.</p>
        </div>
      </div>
    </Section>
  );
};

export default Privacy;
