import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SiteLayout } from "@/components/layout/SiteLayout";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

const Portfolio = lazy(() => import("@/pages/Portfolio"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const Space = lazy(() => import("@/pages/Space"));
const Services = lazy(() => import("@/pages/Services"));
const Studio = lazy(() => import("@/pages/Studio"));
const Guides = lazy(() => import("@/pages/Guides"));
const Contact = lazy(() => import("@/pages/Contact"));
const Enquire = lazy(() => import("@/pages/Enquire"));
const Privacy = lazy(() => import("@/pages/legal/Privacy"));

const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminEnquiries = lazy(() => import("@/pages/admin/AdminEnquiries"));
const AdminCollection = lazy(() => import("@/pages/admin/AdminCollection"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));

const AdminFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <span className="eyebrow animate-pulse">Loading</span>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route
              path="/admin"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminLayout />
                </Suspense>
              }
            >
              <Route index element={<AdminEnquiries />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path=":collection" element={<AdminCollection />} />
            </Route>

            <Route element={<SiteLayout />}>
              <Route index element={<Home />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="portfolio/:slug" element={<ProjectDetail />} />
              <Route path="spaces/:room" element={<Space />} />
              <Route path="services" element={<Services />} />
              <Route path="studio" element={<Studio />} />
              <Route path="guides" element={<Guides />} />
              <Route path="contact" element={<Contact />} />
              <Route path="enquire" element={<Enquire />} />
              <Route path="legal/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
