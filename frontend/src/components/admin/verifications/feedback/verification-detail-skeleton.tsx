// -----------------------------------------------------------------------------
// sisiMove — Verification Detail Skeleton
// -----------------------------------------------------------------------------
// Purpose: Represent a verification detail page during loading.
// -----------------------------------------------------------------------------

import { Skeleton } from "@/components/ui";

export interface VerificationDetailSkeletonProps {
  className?: string;
}

export function VerificationDetailSkeleton({
  className,
}: VerificationDetailSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading verification details"
      className={["w-full space-y-6", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="sr-only">Loading verification details…</span>

      {/* Page heading */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-64 max-w-full" />
            <Skeleton className="h-4 w-48 max-w-full" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>

      {/* Verification summary */}
      <section
        aria-label="Verification summary loading"
        className="rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Skeleton
            radius="full"
            className="h-16 w-16 shrink-0"
          />

          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-5 w-52 max-w-full" />

            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-4 w-44 max-w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-4 w-44 max-w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification evidence */}
      <section
        aria-label="Verification evidence loading"
        className="rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6"
      >
        <div className="mb-5 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 w-28 max-w-full" />
                <Skeleton radius="full" className="h-5 w-5" />
              </div>

              <Skeleton className="h-32 w-full" />

              <Skeleton className="h-4 w-36 max-w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Request history */}
      <section
        aria-label="Verification request history loading"
        className="rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6"
      >
        <div className="mb-5 space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-60 max-w-full" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 border-b border-[var(--border-subtle)] pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 max-w-full" />
                <Skeleton className="h-3 w-56 max-w-full" />
              </div>

              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default VerificationDetailSkeleton;