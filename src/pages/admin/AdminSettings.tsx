import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminField } from "@/components/admin/AdminField";
import { adminKeys } from "@/lib/admin/api";
import type { FieldDescriptor } from "@/lib/admin/collections";

const FIELDS: FieldDescriptor[] = [
  { name: "legal_name", label: "Legal name", type: "text", span: 6, required: true },
  { name: "display_name", label: "Display name", type: "text", span: 6 },
  { name: "tagline", label: "Tagline", type: "text", span: 12 },

  { name: "phone_display", label: "Phone (as shown)", type: "text", span: 4, placeholder: "0711 722 331" },
  { name: "phone_e164", label: "Phone (international)", type: "text", span: 4, placeholder: "+254711722331" },
  { name: "whatsapp_e164", label: "WhatsApp (international)", type: "text", span: 4 },
  { name: "email", label: "Email", type: "text", span: 6, required: true },
  { name: "hours", label: "Hours", type: "text", span: 6 },

  { name: "location", label: "Location line", type: "text", span: 12 },
  { name: "street_address", label: "Street address", type: "text", span: 6 },
  { name: "city", label: "City", type: "text", span: 3 },
  { name: "country", label: "Country code", type: "text", span: 3, placeholder: "KE" },
  { name: "latitude", label: "Latitude", type: "number", span: 6, hint: "Optional — improves local search results." },
  { name: "longitude", label: "Longitude", type: "number", span: 6 },

  { name: "seo_title", label: "SEO title", type: "text", span: 12 },
  { name: "seo_description", label: "SEO description", type: "textarea", span: 12 },
  { name: "og_image_path", label: "Social share image", type: "image", span: 6 },
  { name: "price_disclaimer", label: "Pricing disclaimer", type: "textarea", span: 6 },
];

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);

  const query = useQuery({
    queryKey: adminKeys.settings,
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (error) throw new Error(error.message);
      return (data ?? {}) as Record<string, unknown>;
    },
  });

  useEffect(() => {
    if (query.data && !draft) setDraft({ ...query.data });
  }, [query.data, draft]);

  const save = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase.from("site_settings").upsert({ ...values, id: true });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Saved.");
      void queryClient.invalidateQueries({ queryKey: adminKeys.settings });
      void queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (query.isPending || !draft) {
    return <p className="py-10 text-caption text-muted-foreground">Loading…</p>;
  }

  return (
    <div>
      <header className="border-b border-hairline pb-6">
        <h1 className="font-serif text-h2 text-foreground">Studio Settings</h1>
        <p className="mt-2 max-w-xl text-caption text-muted-foreground">
          Contact details, address and search-engine copy. These feed the whole site, including the
          structured data Google reads.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-5">
        {FIELDS.map((field) => (
          <AdminField
            key={field.name}
            id={`settings-${field.name}`}
            field={field}
            value={draft[field.name]}
            onChange={(value) => setDraft((current) => ({ ...(current ?? {}), [field.name]: value }))}
          />
        ))}
      </div>

      <StatsEditor
        value={(draft.stats as { value: string; label: string }[]) ?? []}
        onChange={(stats) => setDraft((current) => ({ ...(current ?? {}), stats }))}
      />

      <ListEditor
        label="Service areas"
        hint="Shown on the studio page and in local search results."
        value={(draft.service_areas as string[]) ?? []}
        onChange={(service_areas) => setDraft((current) => ({ ...(current ?? {}), service_areas }))}
      />

      <div className="mt-10 border-t border-hairline pt-6">
        <button
          type="button"
          onClick={() => save.mutate(draft)}
          disabled={save.isPending}
          className="focus-ring inline-flex items-center gap-2 bg-foreground px-6 py-3 text-[10px] uppercase tracking-[0.24em] text-background transition-colors hover:bg-accent disabled:opacity-60"
        >
          {save.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Save settings
        </button>
      </div>
    </div>
  );
};

const StatsEditor = ({
  value,
  onChange,
}: {
  value: { value: string; label: string }[];
  onChange: (stats: { value: string; label: string }[]) => void;
}) => (
  <div className="mt-10 border-t border-hairline pt-8">
    <span className="eyebrow mb-4 block">Home page statistics</span>
    <div className="space-y-3">
      {value.map((stat, i) => (
        <div key={i} className="flex gap-3">
          <input
            aria-label={`Statistic ${i + 1} value`}
            value={stat.value}
            onChange={(e) => onChange(value.map((s, j) => (i === j ? { ...s, value: e.target.value } : s)))}
            className="w-24 border border-hairline bg-background px-3 py-2 text-[14px] text-foreground"
          />
          <input
            aria-label={`Statistic ${i + 1} label`}
            value={stat.label}
            onChange={(e) => onChange(value.map((s, j) => (i === j ? { ...s, label: e.target.value } : s)))}
            className="flex-1 border border-hairline bg-background px-3 py-2 text-[14px] text-foreground"
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="focus-ring px-3 text-caption text-muted-foreground hover:text-destructive"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
    <button
      type="button"
      onClick={() => onChange([...value, { value: "", label: "" }])}
      className="focus-ring mt-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
    >
      Add statistic
    </button>
  </div>
);

const ListEditor = ({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (items: string[]) => void;
}) => (
  <div className="mt-10 border-t border-hairline pt-8">
    <label className="eyebrow mb-2 block" htmlFor="list-editor">
      {label}
    </label>
    {hint ? <p className="mb-3 text-caption text-muted-foreground">{hint}</p> : null}
    <textarea
      id="list-editor"
      rows={4}
      value={value.join("\n")}
      onChange={(e) => onChange(e.target.value.split("\n").map((v) => v.trim()).filter(Boolean))}
      className="focus-ring w-full resize-y border border-hairline bg-background px-3 py-2.5 text-[14px] text-foreground"
    />
  </div>
);

export default AdminSettings;
