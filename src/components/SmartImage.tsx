import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SmartImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string | null;
  alt: string;
  /** Tailwind aspect utility, e.g. "aspect-[4/5]". */
  aspect?: string;
  blurDataUrl?: string | null;
  priority?: boolean;
  /** Applied to the <img>, not the frame — keeps hover transforms simple. */
  imageClassName?: string;
};

/**
 * Images are the product here, so every one gets a reserved box (no layout
 * shift), a warm placeholder while it decodes, and a soft fade-in.
 */
export const SmartImage = ({
  src,
  alt,
  aspect = "aspect-[4/5]",
  blurDataUrl,
  priority = false,
  className,
  imageClassName,
  ...props
}: SmartImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-stone", aspect, className)}>
      {blurDataUrl && !loaded ? (
        <img
          src={blurDataUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-105 object-cover blur-xl"
        />
      ) : null}

      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-1000 ease-elegant",
            loaded ? "opacity-100" : "opacity-0",
            imageClassName,
          )}
          {...props}
        />
      ) : null}
    </div>
  );
};
