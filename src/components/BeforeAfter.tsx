import { useCallback, useRef, useState } from "react";
import type { ProjectImage } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type BeforeAfterProps = {
  before: ProjectImage;
  after: ProjectImage;
  className?: string;
};

/**
 * Drag/keyboard comparison slider. Uses a native range input as the control so
 * it is operable by keyboard and screen reader without extra ARIA plumbing.
 */
export const BeforeAfter = ({ before, after, className }: BeforeAfterProps) => {
  const [position, setPosition] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);

  const moveTo = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const { left, width } = frame.getBoundingClientRect();
    setPosition(Math.min(100, Math.max(0, ((clientX - left) / width) * 100)));
  }, []);

  return (
    <figure className={cn("group", className)}>
      <div
        ref={frameRef}
        className="relative aspect-[4/3] select-none overflow-hidden bg-stone"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          moveTo(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(e.clientX);
        }}
      >
        <img
          src={after.url}
          alt={after.alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={before.url}
            alt={before.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-background/90"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-background/70 bg-background/20 backdrop-blur-sm">
            <span className="text-[10px] uppercase tracking-[0.2em] text-background">↔</span>
          </span>
        </div>

        <span className="pointer-events-none absolute bottom-4 left-4 bg-charcoal/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-background backdrop-blur-sm">
          Before
        </span>
        <span className="pointer-events-none absolute bottom-4 right-4 bg-charcoal/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-background backdrop-blur-sm">
          After
        </span>
      </div>

      <label className="mt-4 block">
        <span className="sr-only">Reveal the before and after states</span>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="focus-ring h-1 w-full cursor-ew-resize appearance-none bg-hairline accent-accent"
        />
      </label>
    </figure>
  );
};
