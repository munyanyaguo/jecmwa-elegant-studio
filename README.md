# JECMWA LIMITED

Interior styling studio in Nairobi — mirrors, portraits, art pieces and curated decor.
Marketing site, portfolio and enquiry platform.

## Stack

| Concern | Choice |
| --- | --- |
| Build | Vite 5 + React 18 + TypeScript (strict) |
| Styling | Tailwind CSS 3 with an HSL design-token system |
| UI primitives | Radix UI (via shadcn/ui) |
| Data / auth / storage | Supabase (Postgres, RLS, Storage, Edge Functions) |
| Server state | TanStack Query |
| Forms | react-hook-form + Zod |
| Transactional email | Resend (via Supabase Edge Function) |
| Hosting | Vercel |

## Getting started

```bash
cp .env.example .env    # then fill in the values
npm install
npm run dev             # http://localhost:8080
```

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build + `sitemap.xml` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Vitest (single run) |
| `npm run test:watch` | Vitest (watch) |
| `npm run db:seed` | Seed content + upload imagery to Supabase |
| `npm run db:types` | Regenerate `src/integrations/supabase/types.ts` |

> **WSL note.** If Node is only available through `nvm` and not on the default `PATH`,
> use `bash scripts/dev.sh <npm args>` — it resolves the nvm Node before running npm.
> `bash scripts/check.sh` runs typecheck, lint, tests and build in one pass.

## Supabase setup

```bash
supabase link --project-ref <your-ref>
supabase db push                       # applies supabase/migrations/*
supabase functions deploy submit-enquiry

supabase secrets set \
  RESEND_API_KEY=... \
  ENQUIRY_NOTIFY_TO=studio@jecmwa.com \
  ENQUIRY_FROM_EMAIL="JECMWA <studio@jecmwa.com>" \
  ENQUIRY_SEND_CLIENT_COPY=false \
  ALLOWED_ORIGINS=https://jecmwa.com
```

Then seed the content and imagery (one time, from `seed-assets/`):

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run db:seed
```

Finally, grant yourself admin access:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'you@jecmwa.com';
```

`/admin` then signs in by magic link. Staff status is decided by the `user_roles`
table via the `is_staff()` function — never by anything the browser holds.

### Resend

The free tier covers 3,000 emails/month and one verified domain. Studio
notifications work immediately. **Client confirmation emails require a verified
domain** — until DNS is set up, leave `ENQUIRY_SEND_CLIENT_COPY=false`.

## Content

Nothing user-facing is hardcoded. Copy, portfolio, services, pricing, testimonials
and FAQs all live in Postgres and are edited at `/admin`. `seed-assets/` holds the
original imagery used to bootstrap a fresh environment; it is not bundled into the
app.

## Environment

All browser-visible config is validated at startup in `src/lib/env.ts`. A missing or
malformed variable fails fast with a readable message rather than surfacing as an
obscure runtime error.

`VITE_*` variables are compiled into the client bundle — **never put a secret in one.**
Server-side secrets (Resend API key, Turnstile secret, service-role key) live in
Supabase Edge Function secrets.

## Project structure

```
src/
  components/
    site/        Marketing sections (Hero, About, Projects, …)
    ui/          shadcn/ui primitives
  data/          Static content model (migrating to Supabase)
  hooks/         Shared React hooks
  integrations/  Supabase client + generated types
  lib/           Utilities, env validation
  pages/         Route components
  test/          Vitest setup and suites
supabase/        Config, migrations, Edge Functions
```

## Design system

Tokens live in `src/index.css` and are surfaced to Tailwind via `tailwind.config.ts`.

- **Palette** — warm neutrals: ivory, stone, sand, taupe, bronze, espresso, charcoal.
  Every colour is an HSL triplet behind a CSS variable, so dark mode is a variable swap.
- **Type** — Cormorant Garamond (display/serif) + Inter (UI/sans). Use the named scale
  (`text-display`, `text-h1`, `text-h2`, `text-h3`, `text-caption`, `text-eyebrow`)
  rather than arbitrary sizes.
- **Motion** — `--motion-fast | base | slow | image` with the `elegant` easing curve.
  Everything respects `prefers-reduced-motion`.
- **Focus** — apply `.focus-ring` (or `.focus-ring-invert` on dark sections) to every
  interactive element.

## License

Proprietary — © JECMWA LIMITED.
