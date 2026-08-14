-- ============================================================================
-- Row Level Security
-- Default posture: anonymous visitors can read published content and create an
-- enquiry. Nothing else. Staff (a row in user_roles) manage content.
-- ============================================================================

alter table public.user_roles          enable row level security;
alter table public.site_settings       enable row level security;
alter table public.content_blocks      enable row level security;
alter table public.projects            enable row level security;
alter table public.project_images      enable row level security;
alter table public.services            enable row level security;
alter table public.frame_finishes      enable row level security;
alter table public.size_options        enable row level security;
alter table public.testimonials        enable row level security;
alter table public.faqs                enable row level security;
alter table public.enquiries           enable row level security;
alter table public.enquiry_items       enable row level security;
alter table public.enquiry_attachments enable row level security;
alter table public.subscribers         enable row level security;
alter table public.audit_log           enable row level security;

-- ---------------------------------------------------------------------------
-- Roles: readable by the owner, writable only by admins.
-- ---------------------------------------------------------------------------
create policy "own roles readable" on public.user_roles
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

create policy "admins manage roles" on public.user_roles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Site settings
-- ---------------------------------------------------------------------------
create policy "settings are public" on public.site_settings
  for select to anon, authenticated using (true);

create policy "staff update settings" on public.site_settings
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "admins insert settings" on public.site_settings
  for insert to authenticated with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Published content is world-readable; staff see everything and manage it.
-- ---------------------------------------------------------------------------
create policy "published blocks readable" on public.content_blocks
  for select to anon, authenticated using (status = 'published' or public.is_staff());
create policy "staff manage blocks" on public.content_blocks
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "published projects readable" on public.projects
  for select to anon, authenticated using (status = 'published' or public.is_staff());
create policy "staff manage projects" on public.projects
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "images of published projects readable" on public.project_images
  for select to anon, authenticated using (
    public.is_staff()
    or exists (
      select 1 from public.projects p
      where p.id = project_images.project_id and p.status = 'published'
    )
  );
create policy "staff manage project images" on public.project_images
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "published services readable" on public.services
  for select to anon, authenticated using (status = 'published' or public.is_staff());
create policy "staff manage services" on public.services
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "published finishes readable" on public.frame_finishes
  for select to anon, authenticated using (status = 'published' or public.is_staff());
create policy "staff manage finishes" on public.frame_finishes
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "published sizes readable" on public.size_options
  for select to anon, authenticated using (status = 'published' or public.is_staff());
create policy "staff manage sizes" on public.size_options
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "published testimonials readable" on public.testimonials
  for select to anon, authenticated using (status = 'published' or public.is_staff());
create policy "staff manage testimonials" on public.testimonials
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "published faqs readable" on public.faqs
  for select to anon, authenticated using (status = 'published' or public.is_staff());
create policy "staff manage faqs" on public.faqs
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- Enquiries: write-only for the public, readable only by staff.
-- Submissions go through the Edge Function, which validates and rate-limits;
-- these policies are the backstop if the anon key is used directly.
-- ---------------------------------------------------------------------------
create policy "anyone may submit an enquiry" on public.enquiries
  for insert to anon, authenticated with check (true);

create policy "staff read enquiries" on public.enquiries
  for select to authenticated using (public.is_staff());

create policy "staff update enquiries" on public.enquiries
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "admins delete enquiries" on public.enquiries
  for delete to authenticated using (public.is_admin());

create policy "anyone may attach enquiry items" on public.enquiry_items
  for insert to anon, authenticated with check (true);
create policy "staff read enquiry items" on public.enquiry_items
  for select to authenticated using (public.is_staff());
create policy "staff manage enquiry items" on public.enquiry_items
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "anyone may attach enquiry files" on public.enquiry_attachments
  for insert to anon, authenticated with check (true);
create policy "staff read enquiry attachments" on public.enquiry_attachments
  for select to authenticated using (public.is_staff());
create policy "staff manage enquiry attachments" on public.enquiry_attachments
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "anyone may subscribe" on public.subscribers
  for insert to anon, authenticated with check (true);
create policy "staff read subscribers" on public.subscribers
  for select to authenticated using (public.is_staff());
create policy "staff manage subscribers" on public.subscribers
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- Audit log: staff read, nobody writes through the API (Edge Functions only).
-- ---------------------------------------------------------------------------
create policy "staff read audit log" on public.audit_log
  for select to authenticated using (public.is_staff());
