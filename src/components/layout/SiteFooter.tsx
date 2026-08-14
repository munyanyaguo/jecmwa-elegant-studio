import { Link } from "react-router-dom";
import { PRIMARY_NAV, routes } from "@/lib/navigation";
import { ROOM_LABEL, type Room } from "@/lib/content/types";
import { useSiteSettings } from "@/lib/content/hooks";

const FOOTER_ROOMS: Room[] = ["lounge", "dining", "bedroom", "corridor", "stairway"];

export const SiteFooter = () => {
  const { data: settings } = useSiteSettings();

  return (
    <footer className="border-t border-hairline bg-background py-16 md:py-20">
      <div className="container-edge">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="font-serif text-2xl tracking-[0.18em] text-foreground">JECMWA</div>
            <div className="mt-1 text-[10px] tracking-[0.4em] text-muted-foreground">LIMITED</div>
            <p className="mt-6 max-w-sm text-sm leading-[1.8] text-muted-foreground">
              {settings?.tagline ??
                "A Nairobi interior styling studio composing mirrors, portraits, art pieces and curated decor."}
            </p>
          </div>

          <nav className="md:col-span-2" aria-label="Footer">
            <h2 className="eyebrow mb-5">Navigate</h2>
            <ul className="space-y-3">
              {PRIMARY_NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="focus-ring text-sm text-foreground/75 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-3" aria-label="Spaces">
            <h2 className="eyebrow mb-5">By Space</h2>
            <ul className="space-y-3">
              {FOOTER_ROOMS.map((room) => (
                <li key={room}>
                  <Link
                    to={routes.space(room)}
                    className="focus-ring text-sm text-foreground/75 transition-colors hover:text-accent"
                  >
                    {ROOM_LABEL[room]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="eyebrow mb-5">Studio</h2>
            <ul className="space-y-3 text-sm text-foreground/75">
              {settings ? (
                <>
                  <li>
                    <a
                      href={settings.mailtoHref}
                      className="focus-ring transition-colors hover:text-accent"
                    >
                      {settings.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={settings.telHref}
                      className="focus-ring transition-colors hover:text-accent"
                    >
                      {settings.phoneDisplay}
                    </a>
                  </li>
                  <li>
                    <a
                      href={settings.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring transition-colors hover:text-accent"
                    >
                      WhatsApp the studio
                    </a>
                  </li>
                  <li className="text-muted-foreground">
                    {settings.city}, {settings.country === "KE" ? "Kenya" : settings.country}
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center">
          <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            © {new Date().getFullYear()} JECMWA Limited · All rights reserved
          </div>
          <Link
            to={routes.privacy}
            className="focus-ring text-[11px] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
};
