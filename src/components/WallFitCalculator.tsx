import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/primitives";
import { useSizeOptions } from "@/lib/content/hooks";
import { CATEGORY_SHORT_LABEL, type PrimaryCategory } from "@/lib/content/types";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/navigation";
import { isWallInputValid, suggestCluster, suggestSizes, EYE_LEVEL_CM } from "@/lib/sizing";
import { cn } from "@/lib/utils";

const NumberField = ({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <label htmlFor={id} className="eyebrow mb-2 block">
      {label}
    </label>
    <div className="flex items-baseline gap-2 border-b border-hairline focus-within:border-foreground">
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-full bg-transparent py-3 font-serif text-2xl text-foreground outline-none placeholder:text-muted-foreground/40"
      />
      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">cm</span>
    </div>
    {hint ? <p className="mt-2 text-caption text-muted-foreground">{hint}</p> : null}
  </div>
);

export const WallFitCalculator = () => {
  const { data: options = [] } = useSizeOptions();
  const [category, setCategory] = useState<PrimaryCategory>("mirror");
  const [wallWidth, setWallWidth] = useState("");
  const [wallHeight, setWallHeight] = useState("");
  const [furnitureWidth, setFurnitureWidth] = useState("");
  const [furnitureHeight, setFurnitureHeight] = useState("");

  const input = {
    wallWidthCm: Number(wallWidth),
    wallHeightCm: Number(wallHeight),
    furnitureWidthCm: furnitureWidth ? Number(furnitureWidth) : null,
    furnitureHeightCm: furnitureHeight ? Number(furnitureHeight) : null,
  };

  const ready = isWallInputValid(input);

  const suggestions = useMemo(() => {
    if (!ready) return [];
    return suggestSizes(input, options.filter((o) => o.category === category)).slice(0, 4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, wallWidth, wallHeight, furnitureWidth, furnitureHeight, options, category]);

  const best = suggestions[0];

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
      <Reveal className="lg:col-span-5">
        <fieldset>
          <legend className="eyebrow mb-4">What are you hanging?</legend>
          <div className="mb-10 flex flex-wrap gap-2">
            {(["mirror", "art"] as PrimaryCategory[]).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
                className={cn(
                  "focus-ring border px-4 py-2 text-[10px] uppercase tracking-[0.24em] transition-colors",
                  category === value
                    ? "border-foreground bg-foreground text-background"
                    : "border-hairline text-muted-foreground hover:border-foreground/60 hover:text-foreground",
                )}
              >
                {CATEGORY_SHORT_LABEL[value]}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="space-y-8">
          <NumberField id="wall-width" label="Wall width" value={wallWidth} onChange={setWallWidth} />
          <NumberField
            id="wall-height"
            label="Wall height"
            value={wallHeight}
            onChange={setWallHeight}
            hint="Floor to ceiling, or floor to the top of the usable wall."
          />
          <NumberField
            id="furniture-width"
            label="Furniture width"
            value={furnitureWidth}
            onChange={setFurnitureWidth}
            hint="Optional — the console, sofa or bed it will hang above."
          />
          <NumberField
            id="furniture-height"
            label="Furniture height"
            value={furnitureHeight}
            onChange={setFurnitureHeight}
            hint="Optional — floor to the top surface."
          />
        </div>
      </Reveal>

      <Reveal className="lg:col-span-7" delay={80}>
        {!ready ? (
          <div className="flex h-full min-h-[280px] items-center justify-center border border-hairline p-10 text-center">
            <p className="max-w-xs text-[15px] leading-[1.85] text-muted-foreground">
              Enter your wall width and height and we'll suggest the sizes that will sit well on it.
            </p>
          </div>
        ) : (
          <>
            {best ? <WallPreview widthCm={input.wallWidthCm} heightCm={input.wallHeightCm} best={best} /> : null}

            <ul className="mt-10 border-t border-hairline">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.option.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-hairline py-5"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-serif text-xl text-foreground">{suggestion.option.label}</span>
                    <p className="mt-1 text-caption text-muted-foreground">{suggestion.note}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Hang bottom edge at {suggestion.hangBottomCm} cm
                    </span>
                    {formatPrice(suggestion.option.basePriceKes) ? (
                      <span className="mt-1 block font-serif text-base text-foreground">
                        {formatPrice(suggestion.option.basePriceKes)}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>

            {best ? (
              <div className="mt-8 space-y-3 text-caption text-muted-foreground">
                <p>
                  Centre of the piece sits at {best.hangCentreCm} cm from the floor
                  {Math.abs(best.hangCentreCm - EYE_LEVEL_CM) <= 10
                    ? " — right at standing eye level."
                    : "."}
                </p>
                {suggestCluster(input, best) ? <p>{suggestCluster(input, best)}</p> : null}
              </div>
            ) : null}

            <Link
              to={routes.enquire}
              state={{
                category,
                wallWidthCm: input.wallWidthCm,
                wallHeightCm: input.wallHeightCm,
                sizeOptionId: best?.option.id,
              }}
              className="focus-ring group mt-10 inline-flex items-center gap-3 bg-foreground px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-background transition-colors duration-500 hover:bg-accent"
            >
              Send these measurements to the studio
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </>
        )}
      </Reveal>
    </div>
  );
};

/** To-scale sketch of the piece on the wall — the part that actually reassures people. */
const WallPreview = ({
  widthCm,
  heightCm,
  best,
}: {
  widthCm: number;
  heightCm: number;
  best: ReturnType<typeof suggestSizes>[number];
}) => {
  const pieceLeft = ((widthCm - best.widthCm) / 2 / widthCm) * 100;
  const pieceWidth = (best.widthCm / widthCm) * 100;
  const pieceHeight = (best.heightCm / heightCm) * 100;
  const pieceBottom = (best.hangBottomCm / heightCm) * 100;

  return (
    <div>
      <h3 className="eyebrow mb-4">To scale — {best.option.label}</h3>
      <div
        className="relative w-full border border-hairline bg-secondary/40"
        style={{ aspectRatio: `${widthCm} / ${heightCm}` }}
        role="img"
        aria-label={`A ${best.option.label} piece centred on a ${widthCm} by ${heightCm} centimetre wall, bottom edge ${best.hangBottomCm} centimetres from the floor.`}
      >
        <div
          className="absolute border border-foreground/70 bg-foreground/10"
          style={{
            left: `${pieceLeft}%`,
            width: `${pieceWidth}%`,
            height: `${pieceHeight}%`,
            bottom: `${pieceBottom}%`,
            borderRadius: best.option.diameterCm ? "9999px" : undefined,
          }}
        />
        <span className="absolute bottom-1 left-2 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Floor
        </span>
      </div>
    </div>
  );
};
