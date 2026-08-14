-- ============================================================================
-- Storage buckets
--   media            public read  — portfolio, frames, editorial imagery
--   enquiry-uploads  private      — client room photos attached to an enquiry
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('enquiry-uploads', 'enquiry-uploads', false, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/heic'])
on conflict (id) do nothing;

-- --- media -----------------------------------------------------------------
create policy "media is publicly readable" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

create policy "staff upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_staff());

create policy "staff update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_staff());

create policy "staff delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_staff());

-- --- enquiry-uploads -------------------------------------------------------
-- Visitors may drop files in but can never list or read the bucket back.
create policy "anyone may upload enquiry files" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'enquiry-uploads');

create policy "staff read enquiry files" on storage.objects
  for select to authenticated using (bucket_id = 'enquiry-uploads' and public.is_staff());

create policy "staff delete enquiry files" on storage.objects
  for delete to authenticated using (bucket_id = 'enquiry-uploads' and public.is_staff());
