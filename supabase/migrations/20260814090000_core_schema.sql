-- ============================================================================
-- JECMWA LIMITED — core schema
-- Content is owned by the studio and edited through the admin, not the codebase.
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.primary_category as enum ('art', 'mirror', 'decor');

create type public.room as enum (
  'terrace', 'lounge', 'corridor', 'washroom', 'bedroom',
  'office', 'study', 'stairway', 'kitchen', 'dining', 'foyer'
);

create type public.publish_status as enum ('draft', 'published', 'archived');

create type public.image_role as enum ('hero', 'gallery', 'before', 'after', 'detail');

create type public.enquiry_status as enum (
  'new', 'contacted', 'quoted', 'scheduled', 'won', 'lost', 'spam'
);

create type public.app_role as enum ('admin', 'editor');

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Slugify a title: lowercase, strip accents/punctuation, collapse to hyphens.
create or replace function public.slugify(value text)
returns text
language sql
immutable
set search_path = public
as $$
  select trim(both '-' from regexp_replace(lower(coalesce(value, '')), '[^a-z0-9]+', '-', 'g'));
$$;

-- ---------------------------------------------------------------------------
-- Roles
-- Kept in its own table (never on the user record) so privilege can't be
-- self-assigned through a profile update.
-- ---------------------------------------------------------------------------
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null default 'editor',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- SECURITY DEFINER so RLS policies can call it without recursing into user_roles.
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = auth.uid()
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(auth.uid(), 'admin');
$$;

-- ---------------------------------------------------------------------------
-- Site settings — single row, edited in the admin
-- ---------------------------------------------------------------------------
create table public.site_settings (
  id boolean primary key default true,
  legal_name text not null default 'JECMWA LIMITED',
  display_name text not null default 'JECMWA',
  tagline text not null default 'Mirrors, portraits and curated decor for considered homes.',
  phone_display text not null default '',
  phone_e164 text not null default '',
  whatsapp_e164 text not null default '',
  email citext not null default '',
  hours text not null default '',
  location text not null default '',
  street_address text,
  city text not null default 'Nairobi',
  country text not null default 'KE',
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  service_areas text[] not null default '{}',
  socials jsonb not null default '{}'::jsonb,
  stats jsonb not null default '[]'::jsonb,
  seo_title text not null default '',
  seo_description text not null default '',
  og_image_path text,
  price_disclaimer text not null default
    'Indicative only. Final pricing is confirmed after a short conversation about your space.',
  currency text not null default 'KES',
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id)
);

create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Editable copy blocks (hero, about, and any future narrative section)
-- ---------------------------------------------------------------------------
create table public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  eyebrow text,
  heading text,
  heading_emphasis text,
  body text[] not null default '{}',
  image_path text,
  image_alt text,
  cta_label text,
  cta_href text,
  status public.publish_status not null default 'published',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create trigger content_blocks_updated_at
  before update on public.content_blocks
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Portfolio
-- ---------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  caption text not null default '',
  summary text,
  brief text,
  approach text,
  outcome text,
  category public.primary_category not null,
  room public.room not null,
  location text,
  completed_on date,
  dimensions text,
  frame_finish_id uuid,
  lead_time_days int check (lead_time_days is null or lead_time_days >= 0),
  price_from_kes numeric(12, 2) check (price_from_kes is null or price_from_kes >= 0),
  featured boolean not null default false,
  sort_order int not null default 0,
  status public.publish_status not null default 'draft',
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_status_idx on public.projects (status);
create index projects_category_idx on public.projects (category);
create index projects_room_idx on public.projects (room);
create index projects_featured_idx on public.projects (featured) where featured;
create index projects_sort_idx on public.projects (sort_order, created_at desc);

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  storage_path text not null,
  alt text not null default '',
  role public.image_role not null default 'gallery',
  width int,
  height int,
  blur_data_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index project_images_project_idx on public.project_images (project_id, sort_order);

-- ---------------------------------------------------------------------------
-- Services and specifications
-- ---------------------------------------------------------------------------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  number text not null default '',
  title text not null,
  body text not null default '',
  detail text,
  price_from_kes numeric(12, 2) check (price_from_kes is null or price_from_kes >= 0),
  lead_time_days int,
  sort_order int not null default 0,
  status public.publish_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create table public.frame_finishes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  note text not null default '',
  image_path text,
  image_alt text,
  price_multiplier numeric(5, 3) not null default 1.000 check (price_multiplier > 0),
  sort_order int not null default 0,
  status public.publish_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger frame_finishes_updated_at
  before update on public.frame_finishes
  for each row execute function public.set_updated_at();

alter table public.projects
  add constraint projects_frame_finish_fkey
  foreign key (frame_finish_id) references public.frame_finishes (id) on delete set null;

-- Drives both the published spec tables and the wall-fit / quote calculators.
create table public.size_options (
  id uuid primary key default gen_random_uuid(),
  category public.primary_category not null,
  label text not null,
  width_cm numeric(6, 1) check (width_cm is null or width_cm > 0),
  height_cm numeric(6, 1) check (height_cm is null or height_cm > 0),
  diameter_cm numeric(6, 1) check (diameter_cm is null or diameter_cm > 0),
  base_price_kes numeric(12, 2) not null default 0 check (base_price_kes >= 0),
  sort_order int not null default 0,
  status public.publish_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint size_options_has_dimensions
    check (diameter_cm is not null or (width_cm is not null and height_cm is not null)),
  unique (category, label)
);

create trigger size_options_updated_at
  before update on public.size_options
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Testimonials and FAQs
-- ---------------------------------------------------------------------------
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  author_label text not null default '',
  project_id uuid references public.projects (id) on delete set null,
  rating smallint check (rating is null or rating between 1 and 5),
  given_on date,
  sort_order int not null default 0,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger testimonials_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  status public.publish_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger faqs_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Enquiries
-- ---------------------------------------------------------------------------
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  name text not null,
  email citext not null,
  phone text,
  whatsapp_opt_in boolean not null default false,
  service_id uuid references public.services (id) on delete set null,
  category public.primary_category,
  rooms public.room[] not null default '{}',
  budget_band text,
  timeline text,
  area text,
  wall_width_cm numeric(6, 1),
  wall_height_cm numeric(6, 1),
  message text,
  estimated_total_kes numeric(12, 2),
  status public.enquiry_status not null default 'new',
  internal_notes text,
  quoted_amount_kes numeric(12, 2),
  source text,
  utm jsonb not null default '{}'::jsonb,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index enquiries_status_idx on public.enquiries (status, created_at desc);
create index enquiries_created_idx on public.enquiries (created_at desc);

create trigger enquiries_updated_at
  before update on public.enquiries
  for each row execute function public.set_updated_at();

create table public.enquiry_items (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries (id) on delete cascade,
  category public.primary_category not null,
  size_option_id uuid references public.size_options (id) on delete set null,
  frame_finish_id uuid references public.frame_finishes (id) on delete set null,
  size_label text,
  frame_label text,
  quantity int not null default 1 check (quantity > 0),
  estimated_price_kes numeric(12, 2),
  created_at timestamptz not null default now()
);

create index enquiry_items_enquiry_idx on public.enquiry_items (enquiry_id);

create table public.enquiry_attachments (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries (id) on delete cascade,
  storage_path text not null,
  file_name text,
  content_type text,
  byte_size int,
  created_at timestamptz not null default now()
);

create index enquiry_attachments_enquiry_idx on public.enquiry_attachments (enquiry_id);

create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  source text,
  confirmed boolean not null default false,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Audit trail for admin writes
-- ---------------------------------------------------------------------------
create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users (id) on delete set null,
  table_name text not null,
  record_id text,
  action text not null,
  diff jsonb,
  created_at timestamptz not null default now()
);

create index audit_log_created_idx on public.audit_log (created_at desc);
