import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { mediaUrl } from "@/lib/content/queries";
import { uploadMedia } from "@/lib/admin/api";
import type { FieldDescriptor } from "@/lib/admin/collections";
import { cn } from "@/lib/utils";

// Enumerated rather than interpolated so Tailwind can see every class at build time.
const SPAN: Record<number, string> = {
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  8: "md:col-span-8",
  12: "md:col-span-12",
};

const controlClass =
  "w-full border border-hairline bg-background px-3 py-2.5 text-[14px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground";

type AdminFieldProps = {
  field: FieldDescriptor;
  value: unknown;
  onChange: (value: unknown) => void;
  id: string;
};

export const AdminField = ({ field, value, onChange, id }: AdminFieldProps) => (
  <div className={cn("col-span-12", SPAN[field.span ?? 12])}>
    <label htmlFor={id} className="eyebrow mb-2 block">
      {field.label}
      {field.required ? <span className="ml-1 text-destructive">*</span> : null}
    </label>
    <Control field={field} value={value} onChange={onChange} id={id} />
    {field.hint ? <p className="mt-1.5 text-caption text-muted-foreground">{field.hint}</p> : null}
  </div>
);

const Control = ({ field, value, onChange, id }: AdminFieldProps) => {
  switch (field.type) {
    case "textarea":
    case "richtext":
      return (
        <textarea
          id={id}
          rows={field.type === "richtext" ? 6 : 3}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(controlClass, "resize-y")}
        />
      );

    case "lines":
      return (
        <textarea
          id={id}
          rows={5}
          value={Array.isArray(value) ? (value as string[]).join("\n") : ""}
          onChange={(e) => onChange(e.target.value.split("\n").filter((line) => line.trim()))}
          className={cn(controlClass, "resize-y")}
        />
      );

    case "number":
    case "money":
      return (
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={field.type === "money" ? 100 : "any"}
          value={value === null || value === undefined ? "" : String(value)}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          className={controlClass}
        />
      );

    case "select":
      return (
        <select
          id={id}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          className={controlClass}
        >
          <option value="">—</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case "checkbox":
      return (
        <label className="flex cursor-pointer items-center gap-3 py-2 text-[14px] text-muted-foreground">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="focus-ring h-4 w-4 rounded-none accent-accent"
          />
          Yes
        </label>
      );

    case "image":
      return <ImageControl id={id} value={value as string | null} onChange={onChange} />;

    default:
      return (
        <input
          id={id}
          type="text"
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={controlClass}
        />
      );
  }
};

const ImageControl = ({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string | null;
  onChange: (value: unknown) => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const preview = mediaUrl(value);

  return (
    <div className="flex items-start gap-4">
      <div className="h-24 w-24 shrink-0 overflow-hidden border border-hairline bg-stone">
        {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : null}
      </div>
      <label className="focus-within:border-foreground flex flex-1 cursor-pointer items-center justify-center gap-2 border border-dashed border-hairline px-4 py-6 text-caption text-muted-foreground transition-colors hover:border-foreground/60">
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {uploading ? "Uploading" : "Replace image"}
        <input
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setUploading(true);
            try {
              onChange(await uploadMedia(file));
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Upload failed");
            } finally {
              setUploading(false);
            }
          }}
        />
      </label>
    </div>
  );
};
