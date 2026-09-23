// -----------------------------------------------------------------------------
// sisiMove — Journey Creation — Vehicle Loading
// -----------------------------------------------------------------------------
//
// Route-level loading UI for:
//
//   /authenticated/journeys/create/:journeyPublicId/vehicle
//
// Responsibilities:
// - Provide immediate visual feedback while the Vehicle route is loading.
//
// Non-responsibilities:
// - No API calls.
// - No query hooks.
// - No business logic.
// - No navigation.
// - No persistence.
//
// -----------------------------------------------------------------------------

export default function JourneyVehicleLoading() {
  return (
    <main className="min-h-[60vh] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div
          aria-hidden="true"
          className="animate-pulse"
        >
          {/* ---------------------------------------------------------------- */}
          {/* Header                                                           */}
          {/* ---------------------------------------------------------------- */}

          <header className="mb-6">
            <div className="h-4 w-32 rounded bg-[var(--background-subtle)]" />

            <div className="mt-2 h-8 w-28 rounded bg-[var(--background-subtle)]" />

            <div className="mt-3 h-4 w-full max-w-md rounded bg-[var(--background-subtle)]" />
          </header>

          {/* ---------------------------------------------------------------- */}
          {/* Form                                                             */}
          {/* ---------------------------------------------------------------- */}

          <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <div className="space-y-2">
              <div className="h-4 w-36 rounded bg-[var(--background-subtle)]" />

              <div className="h-4 w-72 max-w-full rounded bg-[var(--background-subtle)]" />
            </div>

            <div className="h-10 w-full rounded-lg bg-[var(--background-subtle)]" />

            <div className="h-28 w-full rounded-xl bg-[var(--background-subtle)]" />

            <div className="flex justify-end border-t border-[var(--border-subtle)] pt-4">
              <div className="h-10 w-24 rounded-lg bg-[var(--background-subtle)]" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

