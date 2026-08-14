/**
 * Application-level content model.
 *
 * These are the shapes the UI consumes. They are deliberately decoupled from the
 * raw Postgres row shapes so a column rename doesn't ripple through components.
 * Row -> domain mapping lives in `queries.ts`.
 */

export type PrimaryCategory = "art" | "mirror" | "decor";

export type Room =
  | "terrace"
  | "lounge"
  | "corridor"
  | "washroom"
  | "bedroom"
  | "office"
  | "study"
  | "stairway"
  | "kitchen"
  | "dining"
  | "foyer";

export type PublishStatus = "draft" | "published" | "archived";

export type ImageRole = "hero" | "gallery" | "before" | "after" | "detail";

export const CATEGORY_LABEL: Record<PrimaryCategory, string> = {
  art: "Art Pieces & Portraits",
  mirror: "Mirrors",
  decor: "Furniture & Decor Styling",
};

export const CATEGORY_SHORT_LABEL: Record<PrimaryCategory, string> = {
  art: "Art & Portraits",
  mirror: "Mirrors",
  decor: "Furniture & Decor",
};

export const ROOM_LABEL: Record<Room, string> = {
  terrace: "Terrace",
  lounge: "Lounge",
  corridor: "Corridor",
  washroom: "Washroom",
  bedroom: "Bedroom",
  office: "Office",
  study: "Study",
  stairway: "Duplex Stairway",
  kitchen: "Kitchen",
  dining: "Dining",
  foyer: "Foyer",
};

export const ROOM_ORDER = Object.keys(ROOM_LABEL) as Room[];
export const CATEGORY_ORDER = Object.keys(CATEGORY_LABEL) as PrimaryCategory[];

export type ProjectImage = {
  id: string;
  url: string;
  alt: string;
  role: ImageRole;
  width: number | null;
  height: number | null;
  blurDataUrl: string | null;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  caption: string;
  summary: string | null;
  brief: string | null;
  approach: string | null;
  outcome: string | null;
  category: PrimaryCategory;
  room: Room;
  location: string | null;
  completedOn: string | null;
  dimensions: string | null;
  frameFinishId: string | null;
  leadTimeDays: number | null;
  priceFromKes: number | null;
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  images: ProjectImage[];
  /** Convenience accessor for the card/hero image. */
  heroImage: ProjectImage | null;
  beforeImage: ProjectImage | null;
  afterImage: ProjectImage | null;
};

export type Service = {
  id: string;
  slug: string;
  number: string;
  title: string;
  body: string;
  detail: string | null;
  priceFromKes: number | null;
  leadTimeDays: number | null;
};

export type FrameFinish = {
  id: string;
  slug: string;
  name: string;
  note: string;
  imageUrl: string | null;
  imageAlt: string;
  priceMultiplier: number;
};

export type SizeOption = {
  id: string;
  category: PrimaryCategory;
  label: string;
  widthCm: number | null;
  heightCm: number | null;
  diameterCm: number | null;
  basePriceKes: number;
};

export type Testimonial = {
  id: string;
  quote: string;
  authorName: string;
  authorLabel: string;
  projectId: string | null;
  rating: number | null;
  givenOn: string | null;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export type ContentBlock = {
  key: string;
  eyebrow: string | null;
  heading: string | null;
  headingEmphasis: string | null;
  body: string[];
  imageUrl: string | null;
  imageAlt: string;
  ctaLabel: string | null;
  ctaHref: string | null;
};

export type Stat = { value: string; label: string };

export type SiteSettings = {
  legalName: string;
  displayName: string;
  tagline: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappE164: string;
  email: string;
  hours: string;
  location: string;
  streetAddress: string | null;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  serviceAreas: string[];
  socials: Record<string, string>;
  stats: Stat[];
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string | null;
  priceDisclaimer: string;
  currency: string;
  /** Derived links, so components never hand-build them. */
  telHref: string;
  mailtoHref: string;
  whatsappHref: string;
};
