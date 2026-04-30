import { useEffect, useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { NAV } from "@/data/site";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-hairline/60"
          : "bg-transparent"
      )}
    >
      <div className="container-edge flex h-20 items-center justify-between md:h-24">
        <a
          href="#home"
          className="group flex flex-col leading-none"
          aria-label="JECMWA LIMITED home"
        >
          <span className="font-serif text-[1.35rem] md:text-[1.55rem] tracking-[0.18em] text-foreground">
            JECMWA
          </span>
          <span className="mt-1 text-[10px] tracking-[0.4em] text-muted-foreground">
            LIMITED · EST.
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-10" aria-label="Primary">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="relative text-[13px] tracking-[0.16em] uppercase text-foreground/75 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
            >
              {n.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-full p-2 text-foreground/70 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 border border-foreground/80 px-5 py-2.5 text-[11px] uppercase tracking-[0.24em] text-foreground transition-all duration-500 hover:bg-foreground hover:text-background"
          >
            Get in Touch
          </a>

          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden rounded-full p-2 text-foreground"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 top-20 md:top-24 bottom-0 bg-background border-t border-hairline transition-all duration-500",
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <nav className="container-edge flex flex-col py-12 gap-6" aria-label="Mobile">
          {NAV.map((n, i) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="font-serif text-3xl text-foreground/90 hover:text-accent transition-colors"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {n.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex w-fit border border-foreground px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-foreground"
          >
            Get in Touch
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
