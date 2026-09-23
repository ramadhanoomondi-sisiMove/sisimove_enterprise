// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Loading State
// -----------------------------------------------------------------------------

export default function JourneyPreferencesLoading() {
  return (
    <main className="min-h-[60vh] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 space-y-3">
          <div className="h-4 w-28 animate-pulse rounded bg-[var(--background-subtle)]" />

          <div className="h-8 w-40 animate-pulse rounded bg-[var(--background-subtle)]" />

          <div className="h-5 w-full max-w-xl animate-pulse rounded bg-[var(--background-subtle)]" />
        </div>

        <div className="space-y-5">
          <div className="h-72 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)]" />

          <div className="h-48 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)]" />
        </div>
      </div>
    </main>
  );
}