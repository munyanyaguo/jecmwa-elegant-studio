import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { useServices, useSiteSettings } from "@/lib/content/hooks";
import { ROOM_LABEL, ROOM_ORDER, type Room } from "@/lib/content/types";
import {
  BUDGET_BANDS,
  MAX_ATTACHMENTS,
  SOURCES,
  TIMELINES,
  enquirySchema,
  readUtm,
  validateAttachment,
  type EnquiryValues,
} from "@/lib/enquiry";
import { submitEnquiry, uploadAttachments } from "@/lib/enquiry-api";
import { cn } from "@/lib/utils";

type PrefillState = {
  serviceId?: string;
  category?: "art" | "mirror" | "decor";
  room?: Room;
  projectSlug?: string;
  wallWidthCm?: number;
  wallHeightCm?: number;
};

const Field = ({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="eyebrow mb-2 block">
      {label}
    </label>
    {children}
    {hint && !error ? <p className="mt-2 text-caption text-muted-foreground">{hint}</p> : null}
    {error ? (
      <p className="mt-2 text-caption text-destructive" role="alert">
        {error}
      </p>
    ) : null}
  </div>
);

const inputClass =
  "w-full border-b border-hairline bg-transparent py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground";

export const EnquiryForm = ({ onSuccess }: { onSuccess: (reference: string) => void }) => {
  const location = useLocation();
  const prefill = (location.state ?? {}) as PrefillState;
  const { data: services } = useServices();
  const { data: settings } = useSiteSettings();
  const [files, setFiles] = useState<File[]>([]);
  const formId = useId();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      whatsappOptIn: true,
      serviceId: prefill.serviceId ?? "",
      category: prefill.category ?? "",
      rooms: prefill.room ? [prefill.room] : [],
      budgetBand: "",
      timeline: "",
      area: "",
      wallWidthCm: prefill.wallWidthCm,
      wallHeightCm: prefill.wallHeightCm,
      message: prefill.projectSlug
        ? `I'd like something similar to "${prefill.projectSlug.replace(/-/g, " ")}" for my home.\n\n`
        : "",
      source: "",
      company: "",
    },
  });

  const selectedRooms = watch("rooms") ?? [];

  const toggleRoom = (room: Room) => {
    const next = selectedRooms.includes(room)
      ? selectedRooms.filter((r) => r !== room)
      : [...selectedRooms, room];
    setValue("rooms", next, { shouldValidate: true });
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const accepted: File[] = [];
    for (const file of Array.from(incoming)) {
      const problem = validateAttachment(file);
      if (problem) {
        toast.error(problem);
        continue;
      }
      accepted.push(file);
    }
    setFiles((current) => [...current, ...accepted].slice(0, MAX_ATTACHMENTS));
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const attachments = files.length ? await uploadAttachments(files) : [];
      const { reference } = await submitEnquiry({
        name: values.name,
        email: values.email,
        phone: values.phone || "",
        whatsappOptIn: Boolean(values.whatsappOptIn),
        serviceId: values.serviceId || "",
        category: values.category || "",
        rooms: (values.rooms ?? []) as Room[],
        budgetBand: values.budgetBand || "",
        timeline: values.timeline || "",
        area: values.area || "",
        wallWidthCm: Number.isFinite(values.wallWidthCm) ? Number(values.wallWidthCm) : undefined,
        wallHeightCm: Number.isFinite(values.wallHeightCm) ? Number(values.wallHeightCm) : undefined,
        message: values.message,
        source: values.source || "",
        attachments,
        utm: readUtm(window.location.search),
        referrer: document.referrer.slice(0, 500),
        pagePath: location.pathname,
      });
      onSuccess(reference);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-16">
      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input id={`${formId}-company`} tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <fieldset>
        <legend className="mb-8 flex items-center gap-4">
          <span className="hairline" />
          <span className="eyebrow">Who we're speaking to</span>
        </legend>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Field label="Your name" htmlFor={`${formId}-name`} error={errors.name?.message}>
            <input
              id={`${formId}-name`}
              autoComplete="name"
              className={inputClass}
              placeholder="Wanjiku Mwangi"
              {...register("name")}
            />
          </Field>

          <Field label="Email" htmlFor={`${formId}-email`} error={errors.email?.message}>
            <input
              id={`${formId}-email`}
              type="email"
              autoComplete="email"
              className={inputClass}
              placeholder="you@example.com"
              {...register("email")}
            />
          </Field>

          <Field
            label="Phone"
            htmlFor={`${formId}-phone`}
            hint="Optional, but it's the fastest way to reach you."
            error={errors.phone?.message}
          >
            <input
              id={`${formId}-phone`}
              type="tel"
              autoComplete="tel"
              className={inputClass}
              placeholder="0711 722 331"
              {...register("phone")}
            />
          </Field>

          <div className="flex items-end pb-3">
            <label className="flex cursor-pointer items-center gap-3 text-[15px] text-muted-foreground">
              <input
                type="checkbox"
                className="focus-ring h-4 w-4 rounded-none border-hairline accent-accent"
                {...register("whatsappOptIn")}
              />
              Happy to be reached on WhatsApp
            </label>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-8 flex items-center gap-4">
          <span className="hairline" />
          <span className="eyebrow">The work</span>
        </legend>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Field label="What are you after?" htmlFor={`${formId}-service`}>
            <select id={`${formId}-service`} className={inputClass} {...register("serviceId")}>
              <option value="">Not sure yet</option>
              {services?.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Where are you?" htmlFor={`${formId}-area`} hint="Estate, suburb or town.">
            <input
              id={`${formId}-area`}
              className={inputClass}
              placeholder={settings?.city ?? "Nairobi"}
              {...register("area")}
            />
          </Field>
        </div>

        <div className="mt-8">
          <span className="eyebrow mb-3 block" id={`${formId}-rooms-label`}>
            Which rooms?
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby={`${formId}-rooms-label`}>
            {ROOM_ORDER.map((room) => {
              const active = selectedRooms.includes(room);
              return (
                <button
                  key={room}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleRoom(room)}
                  className={cn(
                    "focus-ring border px-4 py-2 text-[10px] uppercase tracking-[0.24em] transition-colors",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-hairline text-muted-foreground hover:border-foreground/60 hover:text-foreground",
                  )}
                >
                  {ROOM_LABEL[room]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Field
            label="Wall width"
            htmlFor={`${formId}-wall-width`}
            hint="Optional — in centimetres, if you've measured."
          >
            <input
              id={`${formId}-wall-width`}
              type="number"
              inputMode="decimal"
              className={inputClass}
              placeholder="240"
              {...register("wallWidthCm")}
            />
          </Field>
          <Field label="Wall height" htmlFor={`${formId}-wall-height`} hint="Optional — in centimetres.">
            <input
              id={`${formId}-wall-height`}
              type="number"
              inputMode="decimal"
              className={inputClass}
              placeholder="280"
              {...register("wallHeightCm")}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-8 flex items-center gap-4">
          <span className="hairline" />
          <span className="eyebrow">Shape of the project</span>
        </legend>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Field label="Budget" htmlFor={`${formId}-budget`}>
            <select id={`${formId}-budget`} className={inputClass} {...register("budgetBand")}>
              <option value="">Prefer not to say</option>
              {BUDGET_BANDS.map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Timeline" htmlFor={`${formId}-timeline`}>
            <select id={`${formId}-timeline`} className={inputClass} {...register("timeline")}>
              <option value="">Not decided</option>
              {TIMELINES.map((timeline) => (
                <option key={timeline} value={timeline}>
                  {timeline}
                </option>
              ))}
            </select>
          </Field>

          <Field label="How did you find us?" htmlFor={`${formId}-source`}>
            <select id={`${formId}-source`} className={inputClass} {...register("source")}>
              <option value="">—</option>
              {SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          label="Tell us about the room"
          htmlFor={`${formId}-message`}
          hint="What's already there, what it needs, what you'd like it to feel like."
          error={errors.message?.message}
          className="mt-8"
        >
          <textarea
            id={`${formId}-message`}
            rows={6}
            className={cn(inputClass, "resize-y border border-hairline px-4 focus:border-foreground")}
            placeholder="Our lounge has a long empty wall above the sofa…"
            {...register("message")}
          />
        </Field>

        <div className="mt-8">
          <span className="eyebrow mb-3 block">Photos of the space</span>
          <label
            className={cn(
              "focus-within:border-foreground flex cursor-pointer items-center justify-center gap-3 border border-dashed border-hairline px-6 py-8 text-caption text-muted-foreground transition-colors hover:border-foreground/60",
            )}
          >
            <Upload className="h-4 w-4" strokeWidth={1.5} />
            <span>
              Add up to {MAX_ATTACHMENTS} photos — JPG, PNG or WebP, 5 MB each
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              multiple
              className="sr-only"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>

          {files.length ? (
            <ul className="mt-4 space-y-2">
              {files.map((file, i) => (
                <li
                  key={`${file.name}-${i}`}
                  className="flex items-center justify-between gap-4 border-b border-hairline py-2 text-caption"
                >
                  <span className="truncate text-foreground">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((current) => current.filter((_, index) => index !== i))}
                    aria-label={`Remove ${file.name}`}
                    className="focus-ring shrink-0 p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </fieldset>

      <div className="border-t border-hairline pt-10">
        <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-[1.7] text-muted-foreground">
          <input
            type="checkbox"
            className="focus-ring mt-1 h-4 w-4 shrink-0 rounded-none border-hairline accent-accent"
            {...register("consent")}
          />
          <span>
            I'm happy for JECMWA to contact me about this enquiry. We never share your details.
          </span>
        </label>
        {errors.consent ? (
          <p className="mt-2 text-caption text-destructive" role="alert">
            {errors.consent.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="focus-ring mt-10 inline-flex items-center gap-3 bg-foreground px-10 py-4 text-[11px] uppercase tracking-[0.28em] text-background transition-colors duration-500 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {isSubmitting ? "Sending" : "Send the enquiry"}
        </button>
      </div>
    </form>
  );
};
