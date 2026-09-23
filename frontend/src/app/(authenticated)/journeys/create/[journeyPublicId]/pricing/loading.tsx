// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing Loading State
// -----------------------------------------------------------------------------
//
// Route-level loading UI for the Journey Pricing step.
//
// The actual data-loading state is handled by the Pricing page/query.
// This component provides the Next.js route transition fallback.
//
// -----------------------------------------------------------------------------

export default function JourneyPricingLoading() {
  return (
    <main className="min-h-[60vh] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div
          aria-hidden="true"
          className="animate-pulse space-y-6"
        >
          <div className="space-y-3">
            <div className="h-4 w-28 rounded bg-[var(--background-subtle)]" />
            <div className="h-8 w-32 rounded bg-[var(--background-subtle)]" />
            <div className="h-4 w-full max-w-xl rounded bg-[var(--background-subtle)]" />
          </div>

          <div className="space-y-3">
            <div className="h-4 w-40 rounded bg-[var(--background-subtle)]" />
            <div className="h-11 w-full rounded-lg bg-[var(--background-subtle)]" />
          </div>

          <div className="flex justify-end border-t border-[var(--border-subtle)] pt-4">
            <div className="h-10 w-24 rounded-lg bg-[var(--background-subtle)]" />
          </div>
        </div>

        <p className="sr-only">
          Loading journey pricing…
        </p>
      </div>
    </main>
  );
}

