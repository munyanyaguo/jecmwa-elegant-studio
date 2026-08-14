import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminKeys } from "@/lib/admin/api";
import type { EnquiryStatus } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type EnquiryRecord = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp_opt_in: boolean;
  category: string | null;
  rooms: string[];
  budget_band: string | null;
  timeline: string | null;
  area: string | null;
  wall_width_cm: number | null;
  wall_height_cm: number | null;
  message: string | null;
  status: EnquiryStatus;
  internal_notes: string | null;
  source: string | null;
  utm: Record<string, string> | null;
  created_at: string;
};

/** The inbox only ever writes these two fields. */
type EnquiryUpdate = { status?: EnquiryStatus; internal_notes?: string | null };

const STATUSES: EnquiryStatus[] = [
  "new", "contacted", "quoted", "scheduled", "won", "lost", "spam",
];

const STATUS_TONE: Record<EnquiryStatus, string> = {
  new: "border-accent text-accent",
  contacted: "border-foreground/40 text-foreground",
  quoted: "border-foreground/40 text-foreground",
  scheduled: "border-foreground/40 text-foreground",
  won: "border-accent text-accent",
  lost: "border-hairline text-muted-foreground",
  spam: "border-hairline text-muted-foreground line-through",
};

function toCsv(rows: EnquiryRecord[]): string {
  const columns = [
    "reference", "created_at", "status", "name", "email", "phone",
    "category", "rooms", "budget_band", "timeline", "area", "source", "message",
  ] as const;

  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  return [
    columns.join(","),
    ...rows.map((row) =>
      columns
        .map((column) => escape(Array.isArray(row[column]) ? (row[column] as string[]).join(" ") : row[column]))
        .join(","),
    ),
  ].join("\n");
}

export const EnquiriesInbox = () => {
  const [filter, setFilter] = useState<EnquiryStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: adminKeys.enquiries(filter),
    queryFn: async () => {
      let request = supabase.from("enquiries").select("*").order("created_at", { ascending: false });
      if (filter !== "all") request = request.eq("status", filter);
      const { data, error } = await request;
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as EnquiryRecord[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: EnquiryUpdate }) => {
      const { error } = await supabase.from("enquiries").update(values).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const counts = useMemo(() => {
    const rows = query.data ?? [];
    return { total: rows.length, unread: rows.filter((r) => r.status === "new").length };
  }, [query.data]);

  const exportCsv = () => {
    const rows = query.data ?? [];
    if (!rows.length) return;
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jecmwa-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <h1 className="font-serif text-h2 text-foreground">Enquiries</h1>
          <p className="mt-2 text-caption text-muted-foreground">
            {counts.total} shown · {counts.unread} new
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={!query.data?.length}
          className="focus-ring inline-flex items-center gap-2 border border-hairline px-5 py-2.5 text-[10px] uppercase tracking-[0.24em] text-foreground transition-colors hover:border-foreground disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={cn(
              "focus-ring border px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors",
              filter === value
                ? "border-foreground bg-foreground text-background"
                : "border-hairline text-muted-foreground hover:border-foreground/60 hover:text-foreground",
            )}
          >
            {value}
          </button>
        ))}
      </div>

      {query.isPending ? (
        <p className="py-10 text-caption text-muted-foreground">Loading…</p>
      ) : query.isError ? (
        <p className="py-10 text-caption text-destructive">{query.error.message}</p>
      ) : query.data.length === 0 ? (
        <p className="mt-8 border border-hairline py-12 text-center text-caption text-muted-foreground">
          No enquiries here.
        </p>
      ) : (
        <ul className="mt-8 border-t border-hairline">
          {query.data.map((enquiry) => {
            const open = expanded === enquiry.id;
            return (
              <li key={enquiry.id} className="border-b border-hairline">
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : enquiry.id)}
                  aria-expanded={open}
                  className="focus-ring flex w-full items-center justify-between gap-6 py-4 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-serif text-lg text-foreground">
                      {enquiry.name}
                      <span className="ml-3 text-caption text-muted-foreground">{enquiry.reference}</span>
                    </span>
                    <span className="mt-1 block truncate text-caption text-muted-foreground">
                      {enquiry.email}
                      {enquiry.rooms?.length ? ` · ${enquiry.rooms.join(", ")}` : ""}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-4">
                    <span className="hidden text-caption text-muted-foreground sm:block">
                      {new Date(enquiry.created_at).toLocaleDateString("en-GB")}
                    </span>
                    <span
                      className={cn(
                        "border px-2.5 py-1 text-[9px] uppercase tracking-[0.2em]",
                        STATUS_TONE[enquiry.status],
                      )}
                    >
                      {enquiry.status}
                    </span>
                    <ChevronDown
                      className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
                    />
                  </span>
                </button>

                {open ? (
                  <div className="grid grid-cols-1 gap-8 pb-8 md:grid-cols-3">
                    <dl className="space-y-3 text-caption">
                      {[
                        ["Phone", enquiry.phone],
                        ["WhatsApp", enquiry.whatsapp_opt_in ? "Yes" : "No"],
                        ["Category", enquiry.category],
                        ["Budget", enquiry.budget_band],
                        ["Timeline", enquiry.timeline],
                        ["Area", enquiry.area],
                        [
                          "Wall",
                          enquiry.wall_width_cm && enquiry.wall_height_cm
                            ? `${enquiry.wall_width_cm} × ${enquiry.wall_height_cm} cm`
                            : null,
                        ],
                        ["Found us", enquiry.source],
                        ["Campaign", enquiry.utm?.utm_source],
                      ]
                        .filter(([, value]) => Boolean(value))
                        .map(([label, value]) => (
                          <div key={String(label)} className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">{label}</dt>
                            <dd className="text-right text-foreground">{String(value)}</dd>
                          </div>
                        ))}
                    </dl>

                    <div className="md:col-span-2">
                      <p className="whitespace-pre-line text-[14px] leading-[1.8] text-foreground">
                        {enquiry.message}
                      </p>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <label className="eyebrow" htmlFor={`status-${enquiry.id}`}>
                          Status
                        </label>
                        <select
                          id={`status-${enquiry.id}`}
                          value={enquiry.status}
                          onChange={(e) =>
                            update.mutate({
                              id: enquiry.id,
                              values: { status: e.target.value as EnquiryStatus },
                            })
                          }
                          className="focus-ring border border-hairline bg-background px-3 py-2 text-[13px] text-foreground"
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        <a
                          href={`mailto:${enquiry.email}?subject=Your%20JECMWA%20enquiry%20${enquiry.reference}`}
                          className="focus-ring border border-hairline px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-foreground hover:border-foreground"
                        >
                          Reply by email
                        </a>
                        {enquiry.phone ? (
                          <a
                            href={`https://wa.me/${enquiry.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="focus-ring border border-hairline px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-foreground hover:border-foreground"
                          >
                            WhatsApp
                          </a>
                        ) : null}
                      </div>

                      <label className="mt-6 block">
                        <span className="eyebrow mb-2 block">Internal notes</span>
                        <textarea
                          rows={3}
                          defaultValue={enquiry.internal_notes ?? ""}
                          onBlur={(e) =>
                            e.target.value !== (enquiry.internal_notes ?? "") &&
                            update.mutate({ id: enquiry.id, values: { internal_notes: e.target.value } })
                          }
                          className="focus-ring w-full resize-y border border-hairline bg-background px-3 py-2.5 text-[14px] text-foreground"
                        />
                      </label>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
