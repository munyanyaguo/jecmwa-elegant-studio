import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/lib/content/hooks";
import { routes } from "@/lib/navigation";
import { useSeo } from "@/lib/seo";

const NotFound = () => {
  const { pathname } = useLocation();
  const { data: settings } = useSiteSettings();

  useSeo({ title: "Page not found", path: pathname, noindex: true });

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-24 text-foreground">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-10 flex items-center justify-center gap-4">
          <span className="hairline" />
          <span className="eyebrow">Error 404</span>
          <span className="hairline" />
        </div>

        <h1 className="font-serif text-h1 tracking-tightest text-foreground">
          This page isn't <span className="font-light italic">in the collection.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-sm text-[15px] leading-[1.85] text-muted-foreground">
          The address <span className="font-serif italic text-foreground/80">{pathname}</span> doesn't
          match anything in the studio. It may have moved, or the link may be incomplete.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link
            to={routes.home}
            className="focus-ring group inline-flex items-center gap-3 bg-foreground px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-background transition-colors duration-500 hover:bg-accent"
          >
            Back to the studio
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
          <Link
            to={routes.portfolio}
            className="focus-ring group text-[12px] uppercase tracking-[0.28em] text-foreground/80 hover:text-foreground"
          >
            <span className="border-b border-foreground/40 pb-1 transition-colors group-hover:border-foreground">
              Browse the portfolio
            </span>
          </Link>
        </div>

        {settings ? (
          <p className="mt-10 text-caption text-muted-foreground">
            Looking for something specific?{" "}
            <a
              href={settings.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring underline underline-offset-4 hover:text-foreground"
            >
              Message the studio
            </a>
            .
          </p>
        ) : null}
      </div>
    </main>
  );
};

export default NotFound;
