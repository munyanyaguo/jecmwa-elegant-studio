import { z } from "zod";
import type { Room } from "./content/types";

export const BUDGET_BANDS = [
  "Under KES 50,000",
  "KES 50,000 – 150,000",
  "KES 150,000 – 400,000",
  "KES 400,000+",
  "Not sure yet",
] as const;

export const TIMELINES = [
  "As soon as possible",
  "Within a month",
  "One to three months",
  "Just planning for now",
] as const;

export const SOURCES = [
  "Instagram",
  "Google",
  "Referral from a friend",
  "Saw your work in a home",
  "Other",
] as const;

export const MAX_ATTACHMENTS = 5;
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(120),
  email: z.string().trim().toLowerCase().email("That doesn't look like an email address"),
  phone: z
    .string()
    .trim()
    .max(32)
    .regex(/^[\d\s+()-]*$/, "Digits, spaces and + only")
    .optional()
    .or(z.literal("")),
  whatsappOptIn: z.boolean().default(false),

  serviceId: z.string().uuid().optional().or(z.literal("")),
  category: z.enum(["art", "mirror", "decor"]).optional().or(z.literal("")),
  rooms: z.array(z.string()).max(11).default([]),

  budgetBand: z.enum(BUDGET_BANDS).optional().or(z.literal("")),
  timeline: z.enum(TIMELINES).optional().or(z.literal("")),
  area: z.string().trim().max(120).optional().or(z.literal("")),

  wallWidthCm: z.coerce.number().positive().max(2000).optional().or(z.nan()).catch(undefined),
  wallHeightCm: z.coerce.number().positive().max(2000).optional().or(z.nan()).catch(undefined),

  message: z
    .string()
    .trim()
    .min(10, "A sentence or two about the room helps us reply properly")
    .max(4000),

  source: z.enum(SOURCES).optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm we may contact you about this enquiry" }),
  }),
  /** Hidden field. Real people leave it empty. */
  company: z.string().max(0, "").optional(),
});

export type EnquiryValues = z.input<typeof enquirySchema>;
export type EnquiryPayload = z.output<typeof enquirySchema>;

export type EnquirySubmission = Omit<EnquiryPayload, "consent" | "company"> & {
  rooms: Room[];
  attachments: { path: string; name: string; contentType: string; size: number }[];
  turnstileToken?: string;
  utm: Record<string, string>;
  referrer: string;
  pagePath: string;
};

/** Reads UTM parameters so the studio can see which channel produced a lead. */
export function readUtm(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"]) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 200);
  }
  return utm;
}

export function validateAttachment(file: File): string | null {
  if (file.size > MAX_ATTACHMENT_BYTES) return `${file.name} is larger than 5 MB`;
  if (!/^image\/(jpeg|png|webp|heic)$/.test(file.type)) return `${file.name} isn't a supported image`;
  return null;
}
