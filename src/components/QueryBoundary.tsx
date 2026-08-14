import type { ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export const SectionSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("space-y-6", className)} aria-hidden>
    <div className="h-px w-12 bg-hairline" />
    <div className="h-8 w-2/3 animate-pulse rounded-sm bg-muted" />
    <div className="h-4 w-1/2 animate-pulse rounded-sm bg-muted" />
  </div>
);

export const GridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3" aria-hidden>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="space-y-4">
        <div className="aspect-[4/5] animate-pulse bg-muted" />
        <div className="h-3 w-1/3 animate-pulse bg-muted" />
        <div className="h-5 w-2/3 animate-pulse bg-muted" />
      </div>
    ))}
  </div>
);

export const EmptyState = ({ children }: { children: ReactNode }) => (
  <div className="border border-hairline py-16 text-center text-sm text-muted-foreground">
    {children}
  </div>
);

export const ErrorState = ({ onRetry }: { onRetry?: () => void }) => (
  <div className="border border-hairline px-6 py-16 text-center">
    <p className="text-sm text-muted-foreground">
      This section couldn't be loaded just now.
    </p>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="focus-ring mt-6 text-[11px] uppercase tracking-[0.28em] text-foreground"
      >
        <span className="border-b border-foreground/40 pb-1">Try again</span>
      </button>
    ) : null}
  </div>
);

type QueryBoundaryProps<T> = {
  query: UseQueryResult<T>;
  loading?: ReactNode;
  empty?: ReactNode;
  isEmpty?: (data: T) => boolean;
  children: (data: T) => ReactNode;
};

/** Renders the studio's loading/error/empty treatments around a query result. */
export function QueryBoundary<T>({
  query,
  loading,
  empty,
  isEmpty,
  children,
}: QueryBoundaryProps<T>) {
  if (query.isPending) return <>{loading ?? <GridSkeleton />}</>;
  if (query.isError) return <ErrorState onRetry={() => void query.refetch()} />;
  if (query.data === undefined) return null;
  if (isEmpty?.(query.data)) return <>{empty ?? <EmptyState>Nothing here yet.</EmptyState>}</>;
  return <>{children(query.data)}</>;
}
