// -----------------------------------------------------------------------------
// sisiMove — Journey Creation Loading Boundary
// -----------------------------------------------------------------------------
//
// Next.js route-level loading UI for the Journey creation entry route.
//
// This file is intentionally a pure rendering boundary.
//
// It does NOT:
// - call the Journey API;
// - create a Journey draft;
// - use React Query;
// - manage mutation state;
// - inspect authentication state;
// - perform navigation;
// - manage idempotency.
//
// The actual Journey draft creation remains the responsibility of:
//
//     page.tsx
//
// This boundary is rendered by Next.js while the route is loading.
//
// -----------------------------------------------------------------------------

export default function JourneyCreateLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading journey creation"
      className="min-h-screen bg-[var(--background-brand)]"
    >
      <div className="page-container py-6 sm:py-8">
        <div className="mx-auto w-full max-w-2xl">
          {/* -----------------------------------------------------------------
              Page heading
              ----------------------------------------------------------------- */}

          <div className="animate-pulse">
            <div className="h-3 w-32 rounded bg-[var(--background-muted)]" />

            <div className="mt-3 h-7 w-64 rounded bg-[var(--background-muted)]" />

            <div className="mt-3 h-4 w-full max-w-lg rounded bg-[var(--background-muted)]" />
          </div>

          {/* -----------------------------------------------------------------
              Creation progress
              ----------------------------------------------------------------- */}

          <section
            aria-label="Journey creation progress"
            className="mt-6 surface p-4 sm:p-5"
          >
            <div className="animate-pulse">
              <div className="flex items-center justify-between gap-4">
                <div className="h-4 w-20 rounded bg-[var(--background-muted)]" />

                <div className="h-4 w-24 rounded bg-[var(--background-muted)]" />
              </div>

              <div className="mt-4 h-2 w-full rounded-full bg-[var(--background-muted)]" />

              <div className="mt-5 hidden gap-3 sm:flex">
                <div className="h-8 flex-1 rounded bg-[var(--background-muted)]" />
                <div className="h-8 flex-1 rounded bg-[var(--background-muted)]" />
                <div className="h-8 flex-1 rounded bg-[var(--background-muted)]" />
              </div>
            </div>
          </section>

          {/* -----------------------------------------------------------------
              Creation content
              ----------------------------------------------------------------- */}

          <section
            aria-label="Loading journey creation form"
            className="mt-5 surface p-5 sm:p-6"
          >
            <div className="animate-pulse">
              <div className="h-5 w-40 rounded bg-[var(--background-muted)]" />

              <div className="mt-3 h-4 w-full max-w-md rounded bg-[var(--background-muted)]" />

              <div className="mt-6 space-y-4">
                <div className="h-11 w-full rounded-xl bg-[var(--background-muted)]" />
                <div className="h-11 w-full rounded-xl bg-[var(--background-muted)]" />
                <div className="h-11 w-full rounded-xl bg-[var(--background-muted)]" />
              </div>
            </div>
          </section>

          {/* -----------------------------------------------------------------
              Navigation
              ----------------------------------------------------------------- */}

          <div
            aria-hidden="true"
            className="mt-5 flex animate-pulse items-center justify-between gap-3"
          >
            <div className="h-10 w-24 rounded-xl bg-[var(--background-muted)]" />

            <div className="h-10 w-32 rounded-xl bg-[var(--background-muted)]" />
          </div>
        </div>
      </div>
    </main>
  );
}

