#!/usr/bin/env node
/**
 * Seeds a Supabase project with JECMWA content and uploads the studio imagery
 * into the `media` bucket.
 *
 * Idempotent: safe to re-run. Rows are upserted on their natural key and images
 * are uploaded with upsert enabled.
 *
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed/index.mjs
 *
 * The service-role key bypasses RLS, so this must only ever run locally or in a
 * trusted deploy step — never in the browser bundle.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { ROOT, serviceClient } from "../lib/supabase.mjs";
import {
  SITE_SETTINGS,
  CONTENT_BLOCKS,
  SERVICES,
  FRAME_FINISHES,
  SIZE_OPTIONS,
  TESTIMONIALS,
  FAQS,
  PROJECTS,
} from "./content.mjs";

const ASSETS = path.join(ROOT, "seed-assets");
const BUCKET = "media";

const { url, db } = serviceClient();

const CONTENT_TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function check(label, { error }) {
  if (error) {
    console.error(`✗ ${label}:`, error.message);
    process.exit(1);
  }
  console.log(`✓ ${label}`);
}

/** Uploads `src/assets/<file>` to `media/<file>` and returns the storage path. */
async function uploadAsset(file) {
  const abs = path.join(ASSETS, file);
  const body = await readFile(abs);
  const contentType = CONTENT_TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";

  const { error } = await db.storage.from(BUCKET).upload(file, body, {
    contentType,
    cacheControl: "31536000",
    upsert: true,
  });

  if (error) throw new Error(`upload ${file}: ${error.message}`);
  return file;
}

async function seedSettings() {
  check(
    "site_settings",
    await db.from("site_settings").upsert({ id: true, ...SITE_SETTINGS }, { onConflict: "id" }),
  );
}

async function seedContentBlocks() {
  const rows = [];
  for (const { file, ...block } of CONTENT_BLOCKS) {
    rows.push({ ...block, image_path: file ? await uploadAsset(file) : null });
  }
  check("content_blocks", await db.from("content_blocks").upsert(rows, { onConflict: "key" }));
}

async function seedServices() {
  const rows = SERVICES.map((s, i) => ({ ...s, sort_order: i, status: "published" }));
  check("services", await db.from("services").upsert(rows, { onConflict: "slug" }));
}

async function seedFrameFinishes() {
  const rows = [];
  for (const [i, { file, ...finish }] of FRAME_FINISHES.entries()) {
    rows.push({
      ...finish,
      image_path: await uploadAsset(file),
      sort_order: i,
      status: "published",
    });
  }
  check("frame_finishes", await db.from("frame_finishes").upsert(rows, { onConflict: "slug" }));
}

async function seedSizeOptions() {
  const rows = SIZE_OPTIONS.map((s) => ({ ...s, status: "published" }));
  check("size_options", await db.from("size_options").upsert(rows, { onConflict: "category,label" }));
}

async function seedTestimonials() {
  const { count } = await db.from("testimonials").select("*", { count: "exact", head: true });
  if (count) {
    console.log("• testimonials already present — skipped");
    return;
  }
  const rows = TESTIMONIALS.map((t, i) => ({ ...t, sort_order: i, status: "published" }));
  check("testimonials", await db.from("testimonials").insert(rows));
}

async function seedFaqs() {
  const { count } = await db.from("faqs").select("*", { count: "exact", head: true });
  if (count) {
    console.log("• faqs already present — skipped");
    return;
  }
  check("faqs", await db.from("faqs").insert(FAQS.map((f, i) => ({ ...f, sort_order: i, status: "published" }))));
}

async function seedProjects() {
  const seen = new Set();

  for (const item of PROJECTS) {
    let slug = slugify(item.title);
    while (seen.has(slug)) slug = `${slug}-2`;
    seen.add(slug);

    const storagePath = await uploadAsset(item.file);

    const { data: project, error } = await db
      .from("projects")
      .upsert(
        {
          slug,
          title: item.title,
          caption: item.caption,
          category: item.category,
          room: item.room,
          featured: Boolean(item.featured),
          sort_order: item.sort_order,
          status: "published",
          published_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();

    if (error) {
      console.error(`✗ project ${slug}:`, error.message);
      process.exit(1);
    }

    // Replace rather than append so re-runs don't duplicate imagery.
    await db.from("project_images").delete().eq("project_id", project.id);
    const { error: imageError } = await db.from("project_images").insert({
      project_id: project.id,
      storage_path: storagePath,
      alt: item.alt,
      role: "hero",
      sort_order: 0,
    });

    if (imageError) {
      console.error(`✗ image for ${slug}:`, imageError.message);
      process.exit(1);
    }
  }

  console.log(`✓ projects (${PROJECTS.length})`);
}

async function main() {
  console.log(`Seeding ${url}\n`);
  await seedSettings();
  await seedContentBlocks();
  await seedServices();
  await seedFrameFinishes();
  await seedSizeOptions();
  await seedTestimonials();
  await seedFaqs();
  await seedProjects();
  console.log("\nDone.");
}

main().catch((error) => {
  console.error("\nSeed failed:", error.message);
  process.exit(1);
});
