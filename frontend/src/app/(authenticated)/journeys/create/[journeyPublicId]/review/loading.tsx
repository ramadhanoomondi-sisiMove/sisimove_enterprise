// -----------------------------------------------------------------------------
// sisiMove — Journey Review Loading State
// -----------------------------------------------------------------------------

export default function JourneyReviewLoading() {
  return (
    <main className="min-h-[60vh] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        {/* ----------------------------------------------------------------- */}
        {/* Header skeleton                                                    */}
        {/* ----------------------------------------------------------------- */}

        <div className="mb-6 space-y-3">
          <div className="h-4 w-28 animate-pulse rounded bg-[var(--background-subtle)]" />

          <div className="h-8 w-28 animate-pulse rounded bg-[var(--background-subtle)]" />

          <div className="h-5 w-full max-w-xl animate-pulse rounded bg-[var(--background-subtle)]" />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Review sections                                                    */}
        {/* ----------------------------------------------------------------- */}

        <div className="space-y-5">
          <div className="h-40 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)]" />

          <div className="h-36 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)]" />

          <div className="h-36 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)]" />

          <div className="h-28 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)]" />

          <div className="h-28 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)]" />

          <div className="h-52 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)]" />

          <div className="h-32 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)]" />
        </div>
      </div>
    </main>
  );
}