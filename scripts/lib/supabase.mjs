/**
 * Shared Supabase setup for the Node scripts.
 *
 * Handles both key formats: legacy JWT keys and the newer opaque
 * `sb_publishable_` / `sb_secret_` keys, which must be sent as `apikey` rather
 * than as a bearer token.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** Loads .env without adding a dependency. Existing process env wins. */
export function loadEnv() {
  const file = path.join(ROOT, ".env");
  if (!existsSync(file)) return;

  for (const line of readFileSync(file, "utf8").split("\n")) {
    const match = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    const [, key, raw] = match;
    if (process.env[key]) continue;
    process.env[key] = raw.replace(/^["']|["']$/g, "");
  }
}

const isOpaqueKey = (key) => key.startsWith("sb_publishable_") || key.startsWith("sb_secret_");

function apiKeyFetch(key) {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) new Headers(init.headers).forEach((value, name) => headers.set(name, value));

    if (isOpaqueKey(key) && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);

    return fetch(input, { ...init, headers });
  };
}

function client(url, key) {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: apiKeyFetch(key) },
  });
}

function require(name, value, hint) {
  if (value) return value;
  console.error(`\nMissing ${name}.\n${hint}\n`);
  process.exit(1);
}

export function projectUrl() {
  loadEnv();
  return require(
    "VITE_SUPABASE_URL",
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL,
    "Add it to .env — Supabase dashboard > Project Settings > Data API > Project URL.",
  );
}

/** Anonymous client — sees exactly what a browser visitor sees. */
export function anonClient() {
  const url = projectUrl();
  const key = require(
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    "Add it to .env — dashboard > Project Settings > API Keys > publishable / anon key.",
  );
  return { url, db: client(url, key), key };
}

/** Service-role client — bypasses RLS. Local scripts only, never the browser. */
export function serviceClient() {
  const url = projectUrl();
  const key = require(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    "Add it to .env — dashboard > Project Settings > API Keys > secret / service_role key.\nIt bypasses every security policy. Keep it out of git and out of the browser bundle.",
  );
  return { url, db: client(url, key) };
}
