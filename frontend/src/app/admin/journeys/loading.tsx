
/**
 * sisiMove — Admin Journeys Loading
 *
 * Next.js App Router loading boundary.
 *
 * Responsibilities:
 * - Provide an immediate loading experience.
 * - Preserve the approximate Journeys Control Center layout.
 * - Reuse the established JourneyLoadingState component.
 * - Avoid introducing additional design-system styles.
 */

import { JourneyLoadingState } from '@/components/admin/journeys/shared';

export default function AdminJourneysLoading() {
  return (
    <main
      className="min-h-screen bg-[var(--background-subtle)]"
      aria-label="Loading Journey Control Center"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Page heading skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-3 w-32 animate-pulse rounded bg-[var(--background-muted)]" />

          <div className="h-8 w-72 max-w-full animate-pulse rounded-lg bg-[var(--background-muted)]" />

          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-[var(--background-muted)]" />
        </div>

        {/* Metrics skeleton */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="mb-5 h-4 w-28 animate-pulse rounded bg-[var(--background-muted)]" />

              <div className="h-9 w-20 animate-pulse rounded-lg bg-[var(--background-muted)]" />

              <div className="mt-4 h-3 w-36 animate-pulse rounded bg-[var(--background-muted)]" />
            </div>
          ))}
        </div>

        {/* Directory loading */}
        <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <JourneyLoadingState
            variant="skeleton"
            title="Loading Journey Control Center"
            description="Preparing journey records and operational information…"
            rows={5}
          />
        </div>
      </div>
    </main>
  );
}
