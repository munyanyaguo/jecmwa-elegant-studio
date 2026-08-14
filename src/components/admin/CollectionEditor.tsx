import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { AdminField } from "./AdminField";
import {
  SORT_FIELD,
  STATUS_FIELD,
  type CollectionConfig,
  type FieldDescriptor,
} from "@/lib/admin/collections";
import { useCollection, useDeleteRecord, useSaveRecord, type AdminRecord } from "@/lib/admin/api";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<string, string> = {
  published: "border-accent/60 text-accent",
  draft: "border-hairline text-muted-foreground",
  archived: "border-hairline text-muted-foreground line-through",
};

export const CollectionEditor = ({ config }: { config: CollectionConfig }) => {
  const list = useCollection(config);
  const save = useSaveRecord(config);
  const remove = useDeleteRecord(config);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);

  const fields = useMemo<FieldDescriptor[]>(
    () => [
      ...config.fields,
      ...(config.hasStatus ? [STATUS_FIELD] : []),
      ...(config.hasSortOrder ? [SORT_FIELD] : []),
    ],
    [config],
  );

  const startNew = () => {
    const blank: Record<string, unknown> = {};
    for (const field of fields) {
      blank[field.name] = field.type === "checkbox" ? false : field.type === "lines" ? [] : "";
    }
    if (config.hasStatus) blank.status = "draft";
    if (config.hasSortOrder) blank.sort_order = (list.data?.length ?? 0) + 1;
    setDraft(blank);
  };

  const onSave = async () => {
    if (!draft) return;
    const missing = fields.find((f) => f.required && !String(draft[f.name] ?? "").trim());
    if (missing) {
      toast.error(`${missing.label} is required.`);
      return;
    }

    try {
      await save.mutateAsync(draft);
      toast.success("Saved.");
      setDraft(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't save that.");
    }
  };

  const onDelete = async (record: AdminRecord) => {
    const label = String(record[config.titleField] ?? "this record");
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    try {
      await remove.mutateAsync(record.id);
      toast.success("Deleted.");
      if (draft?.id === record.id) setDraft(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't delete that.");
    }
  };

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <h1 className="font-serif text-h2 text-foreground">{config.title}</h1>
          <p className="mt-2 max-w-xl text-caption text-muted-foreground">{config.description}</p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="focus-ring inline-flex items-center gap-2 bg-foreground px-5 py-2.5 text-[10px] uppercase tracking-[0.24em] text-background transition-colors hover:bg-accent"
        >
          <Plus className="h-3.5 w-3.5" />
          New
        </button>
      </header>

      {draft ? (
        <section className="mt-8 border border-hairline p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="eyebrow">{draft.id ? "Editing" : "New record"}</h2>
            <button
              type="button"
              onClick={() => setDraft(null)}
              aria-label="Cancel"
              className="focus-ring p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-12 gap-x-6 gap-y-5">
            {fields.map((field) => (
              <AdminField
                key={field.name}
                id={`${config.key}-${field.name}`}
                field={field}
                value={draft[field.name]}
                onChange={(value) => setDraft((current) => ({ ...(current ?? {}), [field.name]: value }))}
              />
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4 border-t border-hairline pt-6">
            <button
              type="button"
              onClick={onSave}
              disabled={save.isPending}
              className="focus-ring inline-flex items-center gap-2 bg-foreground px-6 py-3 text-[10px] uppercase tracking-[0.24em] text-background transition-colors hover:bg-accent disabled:opacity-60"
            >
              {save.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Save
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="focus-ring text-[10px] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        {list.isPending ? (
          <p className="py-10 text-caption text-muted-foreground">Loading…</p>
        ) : list.isError ? (
          <p className="py-10 text-caption text-destructive">{list.error.message}</p>
        ) : list.data?.length === 0 ? (
          <p className="border border-hairline py-12 text-center text-caption text-muted-foreground">
            Nothing here yet.
          </p>
        ) : (
          <ul className="border-t border-hairline">
            {list.data?.map((record) => (
              <li
                key={record.id}
                className="flex items-start justify-between gap-6 border-b border-hairline py-4"
              >
                <button
                  type="button"
                  onClick={() => setDraft({ ...record })}
                  className="focus-ring min-w-0 flex-1 text-left"
                >
                  <span className="block truncate font-serif text-lg text-foreground hover:text-accent">
                    {String(record[config.titleField] ?? "Untitled")}
                  </span>
                  {config.subtitleField ? (
                    <span className="mt-1 block truncate text-caption text-muted-foreground">
                      {String(record[config.subtitleField] ?? "")}
                    </span>
                  ) : null}
                </button>

                <div className="flex shrink-0 items-center gap-4">
                  {config.hasStatus ? (
                    <span
                      className={cn(
                        "border px-2.5 py-1 text-[9px] uppercase tracking-[0.2em]",
                        STATUS_TONE[String(record.status)] ?? STATUS_TONE.draft,
                      )}
                    >
                      {String(record.status)}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onDelete(record)}
                    aria-label={`Delete ${String(record[config.titleField] ?? "record")}`}
                    className="focus-ring p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
