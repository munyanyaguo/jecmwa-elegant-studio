import type { Database } from "@/integrations/supabase/types";
import type { PublishStatus } from "@/lib/content/types";

export type ContentTable = keyof Database["public"]["Tables"];

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "money"
  | "select"
  | "checkbox"
  | "image"
  | "lines";

export type FieldOption = { value: string; label: string };

export type FieldDescriptor = {
  name: string;
  label: string;
  type: FieldType;
  hint?: string;
  required?: boolean;
  options?: FieldOption[];
  /** Layout width within the 12-column admin form grid. */
  span?: 3 | 4 | 5 | 6 | 8 | 12;
  placeholder?: string;
};

export type CollectionConfig = {
  key: string;
  table: ContentTable;
  title: string;
  description: string;
  /** Column used as the row heading in the list view. */
  titleField: string;
  subtitleField?: string;
  orderBy: string;
  fields: FieldDescriptor[];
  hasStatus?: boolean;
  hasSortOrder?: boolean;
};

const STATUS_OPTIONS: FieldOption[] = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const CATEGORY_OPTIONS: FieldOption[] = [
  { value: "art", label: "Art Pieces & Portraits" },
  { value: "mirror", label: "Mirrors" },
  { value: "decor", label: "Furniture & Decor" },
];

const ROOM_OPTIONS: FieldOption[] = [
  "terrace", "lounge", "corridor", "washroom", "bedroom",
  "office", "study", "stairway", "kitchen", "dining", "foyer",
].map((value) => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }));

export const STATUS_FIELD: FieldDescriptor = {
  name: "status",
  label: "Status",
  type: "select",
  options: STATUS_OPTIONS,
  span: 4,
};

export const SORT_FIELD: FieldDescriptor = {
  name: "sort_order",
  label: "Order",
  type: "number",
  hint: "Lower numbers appear first.",
  span: 4,
};

export const COLLECTIONS: Record<string, CollectionConfig> = {
  projects: {
    key: "projects",
    table: "projects",
    title: "Portfolio",
    description: "Every piece shown on the site. Stories, specifications and pricing live here.",
    titleField: "title",
    subtitleField: "caption",
    orderBy: "sort_order",
    hasStatus: true,
    hasSortOrder: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true, span: 6 },
      { name: "slug", label: "URL slug", type: "text", required: true, span: 6, hint: "Changing this breaks existing links." },
      { name: "caption", label: "Card caption", type: "text", span: 12, hint: "One line, shown under the image in grids." },
      { name: "summary", label: "Summary", type: "textarea", span: 12, hint: "Opening paragraph on the project page." },
      { name: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS, required: true, span: 4 },
      { name: "room", label: "Space", type: "select", options: ROOM_OPTIONS, required: true, span: 4 },
      { name: "location", label: "Location", type: "text", span: 4, placeholder: "Duplex home, Karen" },
      { name: "brief", label: "The brief", type: "richtext", span: 12 },
      { name: "approach", label: "The approach", type: "richtext", span: 12 },
      { name: "outcome", label: "The outcome", type: "richtext", span: 12 },
      { name: "dimensions", label: "Dimensions", type: "text", span: 4, placeholder: "120 × 80 cm" },
      { name: "lead_time_days", label: "Lead time (days)", type: "number", span: 4 },
      { name: "price_from_kes", label: "From (KES)", type: "money", span: 4 },
      { name: "completed_on", label: "Completed", type: "text", span: 4, placeholder: "2025-06-01" },
      { name: "featured", label: "Feature on the home page", type: "checkbox", span: 8 },
      { name: "seo_title", label: "SEO title", type: "text", span: 6 },
      { name: "seo_description", label: "SEO description", type: "textarea", span: 6 },
    ],
  },

  services: {
    key: "services",
    table: "services",
    title: "Services",
    description: "The six ways into the studio, with pricing and lead times.",
    titleField: "title",
    subtitleField: "body",
    orderBy: "sort_order",
    hasStatus: true,
    hasSortOrder: true,
    fields: [
      { name: "number", label: "Number", type: "text", span: 3, placeholder: "01" },
      { name: "title", label: "Title", type: "text", required: true, span: 5 },
      { name: "slug", label: "Slug", type: "text", required: true, span: 4 },
      { name: "body", label: "Description", type: "textarea", span: 12, required: true },
      { name: "detail", label: "Extended detail", type: "richtext", span: 12 },
      { name: "price_from_kes", label: "From (KES)", type: "money", span: 4, hint: "Leave 0 to show 'Price on request'." },
      { name: "lead_time_days", label: "Lead time (days)", type: "number", span: 4 },
    ],
  },

  size_options: {
    key: "size_options",
    table: "size_options",
    title: "Sizes & Pricing",
    description: "Standard sizes and their base prices. These drive the wall-fit guide and the published spec tables.",
    titleField: "label",
    subtitleField: "category",
    orderBy: "sort_order",
    hasStatus: true,
    hasSortOrder: true,
    fields: [
      { name: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS, required: true, span: 4 },
      { name: "label", label: "Label", type: "text", required: true, span: 4, placeholder: "120 × 80 cm" },
      { name: "base_price_kes", label: "Base price (KES)", type: "money", span: 4, hint: "0 shows as 'Price on request'." },
      { name: "width_cm", label: "Width (cm)", type: "number", span: 4 },
      { name: "height_cm", label: "Height (cm)", type: "number", span: 4 },
      { name: "diameter_cm", label: "Diameter (cm)", type: "number", span: 4, hint: "For round pieces — leave width and height empty." },
    ],
  },

  frame_finishes: {
    key: "frame_finishes",
    table: "frame_finishes",
    title: "Frame Finishes",
    description: "The laminate profiles offered, and how each affects price.",
    titleField: "name",
    subtitleField: "note",
    orderBy: "sort_order",
    hasStatus: true,
    hasSortOrder: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true, span: 6 },
      { name: "slug", label: "Slug", type: "text", required: true, span: 6 },
      { name: "note", label: "Description", type: "textarea", span: 12 },
      { name: "image_path", label: "Image", type: "image", span: 6 },
      { name: "image_alt", label: "Image alt text", type: "text", span: 6, hint: "Describe it for screen readers." },
      { name: "price_multiplier", label: "Price multiplier", type: "number", span: 4, hint: "1.0 = no change, 1.15 = 15% more." },
    ],
  },

  testimonials: {
    key: "testimonials",
    table: "testimonials",
    title: "Testimonials",
    description: "Client words. Only published ones appear on the site.",
    titleField: "author_name",
    subtitleField: "quote",
    orderBy: "sort_order",
    hasStatus: true,
    hasSortOrder: true,
    fields: [
      { name: "quote", label: "Quote", type: "textarea", required: true, span: 12 },
      { name: "author_name", label: "Name", type: "text", required: true, span: 6 },
      { name: "author_label", label: "Label", type: "text", span: 6, placeholder: "Family residence, Nairobi" },
      { name: "given_on", label: "Date given", type: "text", span: 4, placeholder: "2025-06-01" },
      { name: "rating", label: "Rating (1–5)", type: "number", span: 4 },
    ],
  },

  faqs: {
    key: "faqs",
    table: "faqs",
    title: "Questions",
    description: "Shown on the studio and guide pages, and marked up for Google.",
    titleField: "question",
    subtitleField: "answer",
    orderBy: "sort_order",
    hasStatus: true,
    hasSortOrder: true,
    fields: [
      { name: "question", label: "Question", type: "text", required: true, span: 12 },
      { name: "answer", label: "Answer", type: "textarea", required: true, span: 12 },
    ],
  },

  content_blocks: {
    key: "content_blocks",
    table: "content_blocks",
    title: "Page Copy",
    description: "The headline and body copy for the hero, about and contact sections.",
    titleField: "key",
    subtitleField: "heading",
    orderBy: "key",
    hasStatus: true,
    fields: [
      { name: "key", label: "Key", type: "text", required: true, span: 4, hint: "hero, about or contact. Don't rename." },
      { name: "eyebrow", label: "Eyebrow", type: "text", span: 8 },
      { name: "heading", label: "Heading", type: "text", span: 6 },
      { name: "heading_emphasis", label: "Heading (italic part)", type: "text", span: 6 },
      { name: "body", label: "Body paragraphs", type: "lines", span: 12, hint: "One paragraph per line." },
      { name: "image_path", label: "Image", type: "image", span: 6 },
      { name: "image_alt", label: "Image alt text", type: "text", span: 6 },
      { name: "cta_label", label: "Button label", type: "text", span: 6 },
      { name: "cta_href", label: "Button link", type: "text", span: 6 },
    ],
  },
};

export const COLLECTION_ORDER = [
  "projects",
  "services",
  "size_options",
  "frame_finishes",
  "testimonials",
  "faqs",
  "content_blocks",
] as const;

export type StatusValue = PublishStatus;
