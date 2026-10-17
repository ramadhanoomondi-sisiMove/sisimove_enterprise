// -----------------------------------------------------------------------------
// sisiMove — Verification Queue Skeleton
// -----------------------------------------------------------------------------
// Purpose: Represent the verification queue during loading.
// -----------------------------------------------------------------------------

import { Skeleton } from "@/components/ui";

export interface VerificationQueueSkeletonProps {
  rows?: number;
  className?: string;
}

export function VerificationQueueSkeleton({
  rows = 5,
  className,
}: VerificationQueueSkeletonProps) {
  const rowCount = Math.max(1, Math.floor(rows));

  return (
    <div
      role="status"
      aria-label="Loading verification review queue"
      className={["w-full space-y-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="sr-only">Loading verification review queue…</span>

      {/* Queue heading and supporting information */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>

        <Skeleton className="h-10 w-full sm:w-36" />
      </div>

      {/* Filter placeholders */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Queue rows */}
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
        {Array.from({ length: rowCount }, (_, index) => (
          <div
            key={index}
            className={[
              "flex",
              "flex-col",
              "gap-3",
              "border-b",
              "border-[var(--border-subtle)]",
              "p-4",
              "last:border-b-0",
              "sm:flex-row",
              "sm:items-center",
              "sm:justify-between",
            ].join(" ")}
          >
            <div className="flex min-w-0 items-center gap-3">
              <Skeleton radius="full" className="h-11 w-11 shrink-0" />

              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-40 max-w-full" />
                <Skeleton className="h-3 w-56 max-w-full" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VerificationQueueSkeleton;