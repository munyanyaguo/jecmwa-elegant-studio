#!/usr/bin/env node
/**
 * Generates dist/sitemap.xml from the live content.
 *
 * Runs after `vite build`. If Supabase isn't reachable it still emits the
 * static routes rather than failing the deploy.
 *
 *   VITE_SITE_URL=... VITE_SUPABASE_URL=... VITE_SUPABASE_PUBLISHABLE_KEY=... node scripts/sitemap.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, "../dist/sitemap.xml");

const SITE = (process.env.VITE_SITE_URL ?? "https://jecmwa.com").replace(/\/$/, "");
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/portfolio", priority: "0.9", changefreq: "weekly" },
  { path: "/services", priority: "0.8", changefreq: "monthly" },
  { path: "/studio", priority: "0.7", changefreq: "monthly" },
  { path: "/guides", priority: "0.8", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "yearly" },
  { path: "/enquire", priority: "0.7", changefreq: "yearly" },
  { path: "/legal/privacy", priority: "0.2", changefreq: "yearly" },
];

function urlEntry({ path: route, priority, changefreq, lastmod }) {
  return [
    "  <url>",
    `    <loc>${SITE}${route}</loc>`,
    lastmod ? `    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : "",
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

async function dynamicRoutes() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("Supabase env not set — sitemap will contain static routes only.");
    return [];
  }

  try {
    const db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

    const [{ data: projects }, { data: rooms }] = await Promise.all([
      db.from("projects").select("slug, updated_at").eq("status", "published"),
      db.from("projects").select("room").eq("status", "published"),
    ]);

    const projectRoutes = (projects ?? []).map((p) => ({
      path: `/portfolio/${p.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: p.updated_at,
    }));

    const roomRoutes = [...new Set((rooms ?? []).map((r) => r.room))].map((room) => ({
      path: `/spaces/${room}`,
      priority: "0.8",
      changefreq: "monthly",
    }));

    return [...roomRoutes, ...projectRoutes];
  } catch (error) {
    console.warn("Couldn't read content for the sitemap:", error.message);
    return [];
  }
}

const routes = [...STATIC_ROUTES, ...(await dynamicRoutes())];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(urlEntry),
  "</urlset>",
  "",
].join("\n");

await writeFile(OUT, xml, "utf8");
console.log(`sitemap.xml written with ${routes.length} URLs`);
