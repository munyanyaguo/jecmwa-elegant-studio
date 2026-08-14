import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, Moon, Sun } from "lucide-react";
import { PRIMARY_NAV, routes } from "@/lib/navigation";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const Wordmark = () => (
  <span className="flex flex-col leading-none">
    <span className="font-serif text-[1.35rem] tracking-[0.18em] text-foreground md:text-[1.55rem]">
      JECMWA
    </span>
    <span className="mt-1 text-[10px] tracking-[0.4em] text-muted-foreground">LIMITED · EST.</span>
  </span>
);

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="focus-ring rounded-full p-2 text-foreground/70 transition hover:text-foreground"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-hairline/60 bg-background/85 backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="container-edge flex h-20 items-center justify-between md:h-24">
          <Link to={routes.home} className="focus-ring" aria-label="JECMWA LIMITED — home">
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary">
            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "focus-ring group relative text-[13px] uppercase tracking-[0.16em] transition-colors",
                    isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={cn(
                        "absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-500",
                        isActive ? "w-full" : "w-0 group-hover:w-full",
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <ThemeToggle />

            <Link
              to={routes.enquire}
              className="focus-ring hidden items-center gap-2 border border-foreground/80 px-5 py-2.5 text-[11px] uppercase tracking-[0.24em] text-foreground transition-all duration-500 hover:bg-foreground hover:text-background md:inline-flex"
            >
              Start an Enquiry
            </Link>

            <Dialog.Trigger asChild>
              <button
                type="button"
                className="focus-ring rounded-full p-2 text-foreground lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </Dialog.Trigger>
          </div>
        </div>
      </header>

      <Dialog.Portal>
        <Dialog.Content
          className={cn(
            "fixed inset-0 z-[60] overflow-y-auto bg-background lg:hidden",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-300",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-200",
          )}
        >
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Navigate to a section of the JECMWA LIMITED site.
          </Dialog.Description>

          <div className="container-edge flex h-20 items-center justify-between md:h-24">
            <Wordmark />
            <div className="flex items-center gap-3 md:gap-5">
              <ThemeToggle />
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="focus-ring rounded-full p-2 text-foreground"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <nav
            className="container-edge flex flex-col gap-6 border-t border-hairline py-12"
            aria-label="Mobile"
          >
            {PRIMARY_NAV.map((item) => (
              <Dialog.Close asChild key={item.to}>
                <Link
                  to={item.to}
                  className="focus-ring w-fit font-serif text-3xl text-foreground/90 transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </Dialog.Close>
            ))}
            <Dialog.Close asChild>
              <Link
                to={routes.enquire}
                className="focus-ring mt-6 inline-flex w-fit border border-foreground px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-foreground"
              >
                Start an Enquiry
              </Link>
            </Dialog.Close>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
