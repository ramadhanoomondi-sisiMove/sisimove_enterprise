// -----------------------------------------------------------------------------
// sisiMove — Journey Creation — Route Loading
// -----------------------------------------------------------------------------
//
// Route-level loading UI.
//
// This component is intentionally independent of API calls and mutations.
// Next.js displays it while the Route page is loading.
// -----------------------------------------------------------------------------

export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading journey route"
      className="min-h-[60vh] px-4 py-8 sm:px-6 sm:py-10"
    >
      <div className="mx-auto w-full max-w-2xl">
        <div className="space-y-6">
          {/* ---------------------------------------------------------------- */}
          {/* Heading                                                            */}
          {/* ---------------------------------------------------------------- */}

          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-[var(--background-subtle)]" />

            <div className="h-8 w-24 animate-pulse rounded bg-[var(--background-subtle)]" />

            <div className="h-4 w-full max-w-lg animate-pulse rounded bg-[var(--background-subtle)]" />
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Corridor                                                           */}
          {/* ---------------------------------------------------------------- */}

          <div className="h-24 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)]" />

          {/* ---------------------------------------------------------------- */}
          {/* Waypoints                                                          */}
          {/* ---------------------------------------------------------------- */}

          <div className="h-52 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)]" />

          {/* ---------------------------------------------------------------- */}
          {/* Action                                                             */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex justify-end border-t border-[var(--border-subtle)] pt-4">
            <div className="h-10 w-24 animate-pulse rounded-lg bg-[var(--background-subtle)]" />
          </div>
        </div>
      </div>
    </main>
  );
}

