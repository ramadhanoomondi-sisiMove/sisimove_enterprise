// -----------------------------------------------------------------------------
// sisiMove — Journey Seats Loading State
// -----------------------------------------------------------------------------
//
// Route-level loading presentation for the Journey Seats step.
//
// Data fetching remains owned by the page and React Query.
// This component contains presentation only.
// -----------------------------------------------------------------------------

export default function JourneyCapacityLoading() {
  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--surface-muted)]" />

          <div className="mt-3 h-8 w-24 animate-pulse rounded bg-[var(--surface-muted)]" />

          <div className="mt-3 h-4 w-full max-w-lg animate-pulse rounded bg-[var(--surface-muted)]" />
        </header>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-[var(--surface-muted)]" />

            <div className="h-4 w-full max-w-md animate-pulse rounded bg-[var(--surface-muted)]" />

            <div className="h-10 w-full animate-pulse rounded-lg bg-[var(--surface-muted)]" />
          </div>

          <div className="flex justify-end border-t border-[var(--border-subtle)] pt-4">
            <div className="h-10 w-24 animate-pulse rounded-lg bg-[var(--surface-muted)]" />
          </div>
        </div>
      </div>
    </main>
  );
}

