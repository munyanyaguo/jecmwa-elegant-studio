import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { ScrollManager } from "./ScrollManager";
import { useReveal } from "@/hooks/useReveal";

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
    <span className="eyebrow animate-pulse">Loading</span>
  </div>
);

export const SiteLayout = () => {
  useReveal();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollManager />
      <SiteHeader />
      <main id="main" className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
};
