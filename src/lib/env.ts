import { z } from "zod";

const schema = z.object({
  VITE_SUPABASE_URL: z.string().url("VITE_SUPABASE_URL must be a valid URL"),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, "VITE_SUPABASE_PUBLISHABLE_KEY is required"),
  VITE_SITE_URL: z
    .string()
    .url()
    .transform((v) => v.replace(/\/$/, ""))
    .default("http://localhost:8080"),
  VITE_TURNSTILE_SITE_KEY: z.string().optional().default(""),
  VITE_PLAUSIBLE_DOMAIN: z.string().optional().default(""),
  VITE_SENTRY_DSN: z.string().optional().default(""),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  const detail = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`Invalid environment configuration.\n${detail}\n\nCopy .env.example to .env and fill in the values.`);
}

export const env = parsed.data;

export const isProd = import.meta.env.PROD;
