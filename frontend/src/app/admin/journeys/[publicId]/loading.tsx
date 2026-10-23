
/**
 * sisiMove — Admin Journey Detail Loading
 *
 * Next.js App Router loading boundary for an individual journey.
 */

import { JourneyLoadingState } from '@/components/admin/journeys/shared';

export default function AdminJourneyDetailLoading() {
  return (
    <main
      className="min-h-screen bg-[var(--background-subtle)]"
      aria-label="Loading journey details"
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb and heading skeleton */}
        <div className="space-y-4">
          <div className="h-3 w-48 animate-pulse rounded bg-[var(--background-muted)]" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-8 w-72 max-w-full animate-pulse rounded-lg bg-[var(--background-muted)]" />
              <div className="h-4 w-96 max-w-full animate-pulse rounded bg-[var(--background-muted)]" />
            </div>

            <div className="h-10 w-32 animate-pulse rounded-[var(--radius-md)] bg-[var(--background-muted)]" />
          </div>
        </div>

        {/* Journey identity and status */}
        <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-[var(--background-muted)]" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-5 w-48 max-w-full animate-pulse rounded bg-[var(--background-muted)]" />
              <div className="h-3 w-64 max-w-full animate-pulse rounded bg-[var(--background-muted)]" />
            </div>

            <div className="hidden h-6 w-24 animate-pulse rounded-full bg-[var(--background-muted)] sm:block" />
          </div>
        </section>

        {/* Journey detail panels */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <JourneyLoadingState
              title="Loading journey overview"
              description="Retrieving journey information…"
              rows={3}
            />
          </section>

          <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <JourneyLoadingState
              title="Loading journey operations"
              description="Preparing operational details…"
              rows={3}
            />
          </section>
        </div>

        {/* Activity panel */}
        <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <JourneyLoadingState
            title="Loading journey activity"
            description="Retrieving available activity information…"
            rows={4}
          />
        </section>
      </div>
    </main>
  );
}
