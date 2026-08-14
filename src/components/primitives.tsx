import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** Tightens the default vertical rhythm for stacked sections. */
  tone?: "default" | "muted" | "inverted";
};

const TONE: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "",
  muted: "bg-secondary/40",
  inverted: "bg-foreground text-background",
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ as: Tag = "section", tone = "default", className, children, ...props }, ref) => (
    <Tag ref={ref} className={cn("py-24 md:py-36", TONE[tone], className)} {...props}>
      <div className="container-edge">{children}</div>
    </Tag>
  ),
);
Section.displayName = "Section";

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Rendered in the studio's light italic, continuing the same sentence. */
  emphasis?: ReactNode;
  lede?: ReactNode;
  align?: "start" | "between";
  inverted?: boolean;
  className?: string;
};

export const SectionHeading = ({
  eyebrow,
  title,
  emphasis,
  lede,
  align = "between",
  inverted = false,
  className,
}: SectionHeadingProps) => (
  <div
    className={cn(
      "reveal mb-16 gap-8 md:mb-20",
      align === "between"
        ? "flex flex-col md:flex-row md:items-end md:justify-between"
        : "flex flex-col",
      className,
    )}
  >
    <div className="max-w-2xl">
      {eyebrow ? (
        <div className="mb-8 flex items-center gap-4">
          <span className={cn("hairline", inverted && "bg-background/40")} />
          <span className={cn("eyebrow", inverted && "text-background/60")}>{eyebrow}</span>
        </div>
      ) : null}
      <h2
        className={cn(
          "font-serif text-h1 leading-[1.02]",
          inverted ? "text-background" : "text-foreground",
        )}
      >
        {title}
        {emphasis ? <span className="font-light italic"> {emphasis}</span> : null}
      </h2>
    </div>
    {lede ? (
      <p
        className={cn(
          "text-[15px] leading-[1.8] md:max-w-sm",
          inverted ? "text-background/70" : "text-muted-foreground",
        )}
      >
        {lede}
      </p>
    ) : null}
  </div>
);

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  as?: ElementType;
  /** Stagger in ms. Kept small — the studio's motion is slow but not laboured. */
  delay?: number;
};

export const Reveal = ({ as: Tag = "div", delay = 0, className, style, ...props }: RevealProps) => (
  <Tag
    className={cn("reveal", className)}
    style={delay ? { transitionDelay: `${delay}ms`, ...style } : style}
    {...props}
  />
);

/** The studio's recurring "— label —" rule, used between and under sections. */
export const RuleLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => (
  <a
    href={href}
    className={cn(
      "focus-ring group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-foreground",
      className,
    )}
  >
    <span className="h-px w-10 bg-foreground/40 transition-all duration-500 group-hover:w-16 group-hover:bg-foreground" />
    {children}
    <span className="h-px w-10 bg-foreground/40 transition-all duration-500 group-hover:w-16 group-hover:bg-foreground" />
  </a>
);
