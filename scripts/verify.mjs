#!/usr/bin/env node
/**
 * End-to-end check of what the public site will actually see.
 *
 * Connects with the publishable (anon) key — the same credential the browser
 * uses — so it proves both that content is seeded AND that RLS lets it through.
 * It also confirms the private tables stay private.
 *
 *   npm run db:verify
 */
import { anonClient } from "./lib/supabase.mjs";

const { url, db, key } = anonClient();

let failures = 0;
let warnings = 0;

const ok = (msg) => console.log(`  \u001b[32mPASS\u001b[0m  ${msg}`);
const warn = (msg) => {
  warnings += 1;
  console.log(`  \u001b[33mWARN\u001b[0m  ${msg}`);
};
const fail = (msg) => {
  failures += 1;
  console.log(`  \u001b[31mFAIL\u001b[0m  ${msg}`);
};

async function countVisible(table) {
  const { count, error } = await db.from(table).select("*", { count: "exact", head: true });
  return { count: count ?? 0, error };
}

console.log(`\nChecking ${url} as an anonymous visitor\n`);

console.log("Public content the site renders");
const EXPECTED = [
  ["site_settings", 1],
  ["content_blocks", 3],
  ["projects", 1],
  ["project_images", 1],
  ["services", 1],
  ["size_options", 1],
  ["frame_finishes", 1],
  ["testimonials", 1],
  ["faqs", 1],
];

for (const [table, minimum] of EXPECTED) {
  const { count, error } = await countVisible(table);
  if (error) {
    fail(`${table}: ${error.message}`);
  } else if (count < minimum) {
    fail(`${table}: ${count} rows visible, expected at least ${minimum} — run \`npm run db:seed\``);
  } else {
    ok(`${table}: ${count} rows visible`);
  }
}

console.log("\nPrivate data must NOT be readable");
for (const table of ["enquiries", "enquiry_attachments", "subscribers", "user_roles", "audit_log"]) {
  const { count, error } = await countVisible(table);
  if (error) {
    ok(`${table}: blocked (${error.code ?? "error"})`);
  } else if (count === 0) {
    warn(`${table}: readable but empty — confirm RLS is enabled on it`);
  } else {
    fail(`${table}: ${count} rows exposed to anonymous users — RLS is not applied`);
  }
}

console.log("\nDrafts must stay hidden");
{
  const { data, error } = await db.from("projects").select("status");
  if (error) {
    fail(`projects: ${error.message}`);
  } else {
    const leaked = (data ?? []).filter((row) => row.status !== "published");
    leaked.length
      ? fail(`${leaked.length} non-published projects are visible`)
      : ok("only published projects are visible");
  }
}

console.log("\nImagery");
{
  const { data, error } = await db
    .from("project_images")
    .select("storage_path")
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    fail(`no project images readable${error ? `: ${error.message}` : ""}`);
  } else {
    const publicUrl = `${url}/storage/v1/object/public/media/${data.storage_path}`;
    try {
      const res = await fetch(publicUrl, { method: "HEAD" });
      res.ok
        ? ok(`media bucket serves ${data.storage_path} (${res.status})`)
        : fail(`media returned ${res.status} for ${data.storage_path} — bucket missing or not public`);
    } catch (e) {
      fail(`could not reach storage: ${e.message}`);
    }
  }
}

console.log("\nContent blocks the home page needs");
{
  const { data, error } = await db.from("content_blocks").select("key");
  if (error) {
    fail(`content_blocks: ${error.message}`);
  } else {
    const keys = new Set((data ?? []).map((row) => row.key));
    for (const required of ["hero", "about", "contact"]) {
      keys.has(required) ? ok(`block "${required}" present`) : fail(`block "${required}" missing`);
    }
  }
}

console.log("\nEnquiry function");
{
  try {
    const res = await fetch(`${url}/functions/v1/submit-enquiry`, {
      method: "OPTIONS",
      headers: { apikey: key },
    });
    res.ok || res.status === 204
      ? ok(`submit-enquiry reachable (${res.status})`)
      : warn(`submit-enquiry returned ${res.status} — run \`npm run fn:deploy\``);
  } catch (e) {
    warn(`submit-enquiry unreachable: ${e.message}`);
  }
}

console.log(
  failures
    ? `\n\u001b[31m${failures} check(s) failed\u001b[0m${warnings ? `, ${warnings} warning(s)` : ""}\n`
    : `\n\u001b[32mAll checks passed\u001b[0m${warnings ? ` with ${warnings} warning(s)` : ""}\n`,
);

process.exit(failures ? 1 : 0);
