import { CATEGORY_ORDER, CATEGORY_SHORT_LABEL, ROOM_LABEL, type PrimaryCategory, type Room } from "./content/types";

export type NavItem = { label: string; to: string };

export const PRIMARY_NAV: NavItem[] = [
  { label: "Portfolio", to: "/portfolio" },
  { label: "Services", to: "/services" },
  { label: "Studio", to: "/studio" },
  { label: "Journal", to: "/guides" },
  { label: "Contact", to: "/contact" },
];

export const FOOTER_NAV: NavItem[] = [
  ...PRIMARY_NAV,
  { label: "Enquire", to: "/enquire" },
  { label: "Privacy", to: "/legal/privacy" },
];

export const routes = {
  home: "/",
  portfolio: "/portfolio",
  project: (slug: string) => `/portfolio/${slug}`,
  space: (room: Room) => `/spaces/${room}`,
  services: "/services",
  service: (slug: string) => `/services/${slug}`,
  studio: "/studio",
  guides: "/guides",
  contact: "/contact",
  enquire: "/enquire",
  privacy: "/legal/privacy",
  admin: "/admin",
} as const;

/** Portfolio filters are URL state so a filtered view can be linked and indexed. */
export function portfolioHref(filters: { category?: PrimaryCategory | "all"; room?: Room | "all" }) {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "all") params.set("category", filters.category);
  if (filters.room && filters.room !== "all") params.set("room", filters.room);
  const query = params.toString();
  return query ? `${routes.portfolio}?${query}` : routes.portfolio;
}

export const CATEGORY_TABS: { id: PrimaryCategory | "all"; label: string }[] = [
  { id: "all", label: "All Work" },
  ...CATEGORY_ORDER.map((id) => ({ id, label: CATEGORY_SHORT_LABEL[id] })),
];

export const roomLabel = (room: Room) => ROOM_LABEL[room];
