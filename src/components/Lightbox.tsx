import { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SmartImage } from "./SmartImage";
import { CATEGORY_LABEL, ROOM_LABEL, type Project } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type LightboxProps = {
  projects: Project[];
  /** Index into `projects`; null closes the lightbox. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

export const Lightbox = ({ projects, index, onIndexChange }: LightboxProps) => {
  const open = index !== null;
  const project = open ? projects[index] : undefined;

  const step = useCallback(
    (delta: number) => {
      if (index === null || projects.length === 0) return;
      onIndexChange((index + delta + projects.length) % projects.length);
    },
    [index, projects.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  // Touch-swipe, since most of this audience arrives on a phone.
  const [touchStart, setTouchStart] = useState<number | null>(null);

  if (!project) return null;

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onIndexChange(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-charcoal/95 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed inset-0 z-[80] flex flex-col focus:outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
          onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStart === null) return;
            const delta = e.changedTouches[0].clientX - touchStart;
            if (Math.abs(delta) > 60) step(delta < 0 ? 1 : -1);
            setTouchStart(null);
          }}
        >
          <Dialog.Title className="sr-only">{project.title}</Dialog.Title>
          <Dialog.Description className="sr-only">{project.caption}</Dialog.Description>

          <div className="flex items-center justify-between px-6 py-5 text-background/70 md:px-10">
            <span className="text-[11px] uppercase tracking-[0.28em]">
              {index !== null ? index + 1 : 0} / {projects.length}
            </span>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="focus-ring-invert rounded-full p-2 transition-colors hover:text-background"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex min-h-0 flex-1 items-center gap-4 px-4 md:gap-8 md:px-10">
            <NavButton direction="prev" onClick={() => step(-1)} disabled={projects.length < 2} />

            <figure className="flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-6">
              <SmartImage
                key={project.id}
                src={project.heroImage?.url ?? null}
                alt={project.heroImage?.alt ?? project.title}
                blurDataUrl={project.heroImage?.blurDataUrl}
                priority
                aspect="aspect-auto"
                className="max-h-[68vh] w-auto max-w-full bg-transparent"
                imageClassName="max-h-[68vh] w-auto object-contain"
              />
              <figcaption className="max-w-xl text-center">
                <div className="text-[10px] uppercase tracking-[0.28em] text-background/50">
                  {CATEGORY_LABEL[project.category]} · {ROOM_LABEL[project.room]}
                </div>
                <h2 className="mt-2 font-serif text-2xl text-background md:text-3xl">
                  {project.title}
                </h2>
                <p className="mt-2 text-sm leading-[1.75] text-background/60">{project.caption}</p>
              </figcaption>
            </figure>

            <NavButton direction="next" onClick={() => step(1)} disabled={projects.length < 2} />
          </div>

          <div className="px-6 pb-8 pt-6 text-center md:px-10">
            <a
              href={`/portfolio/${project.slug}`}
              className="focus-ring-invert text-[11px] uppercase tracking-[0.28em] text-background/70 transition-colors hover:text-background"
            >
              <span className="border-b border-background/30 pb-1">View the full piece</span>
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const NavButton = ({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) => {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous piece" : "Next piece"}
      className={cn(
        "focus-ring-invert shrink-0 rounded-full p-2 text-background/50 transition-colors hover:text-background md:p-3",
        disabled && "invisible",
      )}
    >
      <Icon className="h-6 w-6 md:h-8 md:w-8" strokeWidth={1.2} />
    </button>
  );
};
