import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CollectionConfig } from "./collections";

export type AdminRecord = Record<string, unknown> & { id: string };

export const adminKeys = {
  collection: (table: string) => ["admin", table] as const,
  enquiries: (status: string) => ["admin", "enquiries", status] as const,
  settings: ["admin", "site_settings"] as const,
};

/** Admin reads bypass the published filter — staff see drafts too. */
export function useCollection(config: CollectionConfig) {
  return useQuery({
    queryKey: adminKeys.collection(config.table),
    queryFn: async () => {
      const { data, error } = await supabase
        .from(config.table)
        .select("*")
        .order(config.orderBy, { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as AdminRecord[];
    },
  });
}

export function useSaveRecord(config: CollectionConfig) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: Record<string, unknown>) => {
      const { id, ...values } = record;

      const query = id
        ? supabase.from(config.table).update(values).eq("id", id as string)
        : supabase.from(config.table).insert(values);

      const { error } = await query;
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.collection(config.table) });
      void queryClient.invalidateQueries({ queryKey: [config.key] });
    },
  });
}

export function useDeleteRecord(config: CollectionConfig) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(config.table).delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.collection(config.table) });
    },
  });
}

const MEDIA_BUCKET = "media";

export async function uploadMedia(file: File, folder = "uploads"): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  return path;
}
