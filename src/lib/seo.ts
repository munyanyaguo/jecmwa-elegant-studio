import { useEffect } from "react";
import { env } from "@/lib/env";

export type SeoInput = {
  title: string;
  description?: string;
  /** Path only, e.g. "/portfolio/six-panel-mirror-cluster". */
  path?: string;
  image?: string | null;
  type?: "website" | "article";
  noindex?: boolean;
  /** Serialised into a <script type="application/ld+json"> tag. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const MANAGED = "data-seo-managed";
const SUFFIX = "JECMWA LIMITED";

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(MANAGED, "");
    document.head.appendChild(el);
  }
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    el.setAttribute(MANAGED, "");
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Head management for the SPA. Phase 5 replaces the DOM writes with the SSG's
 * head serialiser; the shape of `SeoInput` is what pages depend on, so that
 * swap stays contained to this file.
 */
export function useSeo({
  title,
  description,
  path = "/",
  image,
  type = "website",
  noindex = false,
  jsonLd,
}: SeoInput) {
  useEffect(() => {
    const fullTitle = title === SUFFIX ? title : `${title} — ${SUFFIX}`;
    const url = `${env.VITE_SITE_URL}${path}`;
    const ogImage = image ?? `${env.VITE_SITE_URL}/og-default.jpg`;

    document.title = fullTitle;
    upsertLink("canonical", url);

    if (description) {
      upsertMeta('meta[name="description"]', { name: "description", content: description });
      upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
      upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    }

    upsertMeta('meta[property="og:title"]', { property: "og:title", content: fullTitle });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: ogImage });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: fullTitle });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: ogImage });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noindex ? "noindex, nofollow" : "index, follow",
    });

    const script = document.createElement("script");
    if (jsonLd) {
      script.type = "application/ld+json";
      script.setAttribute(MANAGED, "");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      script.remove();
    };
  }, [title, description, path, image, type, noindex, jsonLd]);
}
