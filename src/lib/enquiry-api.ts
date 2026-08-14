import { supabase } from "@/integrations/supabase/client";
import { env } from "@/lib/env";
import { MAX_ATTACHMENTS, validateAttachment, type EnquirySubmission } from "@/lib/enquiry";

const BUCKET = "enquiry-uploads";

export type UploadedAttachment = EnquirySubmission["attachments"][number];

/**
 * Client photos go straight to a private bucket; only the resulting paths are
 * sent to the Edge Function. Storage policy allows insert but never read.
 */
export async function uploadAttachments(files: File[]): Promise<UploadedAttachment[]> {
  const selected = files.slice(0, MAX_ATTACHMENTS);
  const uploaded: UploadedAttachment[] = [];

  for (const file of selected) {
    const problem = validateAttachment(file);
    if (problem) throw new Error(problem);

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw new Error(`Couldn't upload ${file.name}: ${error.message}`);

    uploaded.push({ path, name: file.name, contentType: file.type, size: file.size });
  }

  return uploaded;
}

export type EnquiryResult = { reference: string };

export async function submitEnquiry(submission: EnquirySubmission): Promise<EnquiryResult> {
  const response = await fetch(`${env.VITE_SUPABASE_URL}/functions/v1/submit-enquiry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify(submission),
  });

  const body = (await response.json().catch(() => ({}))) as { reference?: string; error?: string };

  if (!response.ok) {
    throw new Error(body.error ?? "We couldn't send that just now. Please try again.");
  }
  if (!body.reference) {
    throw new Error("The studio received your enquiry but didn't return a reference.");
  }

  return { reference: body.reference };
}
