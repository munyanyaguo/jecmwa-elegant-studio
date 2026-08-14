import { env } from "@/lib/env";
import { CATEGORY_LABEL, ROOM_LABEL, type Faq, type Project, type SiteSettings } from "./content/types";

const SITE = env.VITE_SITE_URL;

export function localBusinessJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE}/#organization`,
    name: settings.legalName,
    alternateName: settings.displayName,
    description: settings.seoDescription,
    url: SITE,
    telephone: settings.phoneE164,
    email: settings.email,
    image: settings.ogImageUrl ?? `${SITE}/og-default.jpg`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.streetAddress ?? undefined,
      addressLocality: settings.city,
      addressCountry: settings.country,
    },
    ...(settings.latitude && settings.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: settings.latitude,
            longitude: settings.longitude,
          },
        }
      : {}),
    areaServed: settings.serviceAreas.map((name) => ({ "@type": "Place", name })),
    sameAs: Object.values(settings.socials).filter(Boolean),
    knowsAbout: Object.values(CATEGORY_LABEL),
  };
}

export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE}/portfolio/${project.slug}#work`,
    name: project.title,
    description: project.summary ?? project.caption,
    dateCreated: project.completedOn ?? undefined,
    locationCreated: project.location ? { "@type": "Place", name: project.location } : undefined,
    image: project.images.map((image) => image.url).filter(Boolean),
    about: `${CATEGORY_LABEL[project.category]} — ${ROOM_LABEL[project.room]}`,
    creator: { "@id": `${SITE}/#organization` },
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE}${crumb.path}`,
    })),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
