// -----------------------------------------------------------------------------
// sisiMove — My Journeys Page
// -----------------------------------------------------------------------------
//
// Authenticated My Journeys collection route.
//
// Responsibilities:
// - establish the My Journeys page route;
// - compose the MyJourneys feature surface.
//
// Non-responsibilities:
// - no Journey fetching;
// - no Journey mutations;
// - no loading/error/empty-state orchestration;
// - no Journey lifecycle logic;
// - no Journey routing decisions.
//
// The MyJourneys feature component owns the collection state and presentation.
//
// -----------------------------------------------------------------------------

import { MyJourneys } from "@/components/journey/my-journeys";

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function MyJourneysPage() {
  return (
    <main className="page-shell">
      <div className="page-container py-5 sm:py-8">
        <div className="mx-auto w-full max-w-5xl">
          {/* ----------------------------------------------------------------- */}
          {/* Page Header */}
          {/* ----------------------------------------------------------------- */}

          <header className="mb-6 sm:mb-8">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
                Your activity
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                My Journeys
              </h1>

              <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)] sm:text-base">
                Manage the Journeys you have created and shared with travellers.
              </p>
            </div>
          </header>

          {/* ----------------------------------------------------------------- */}
          {/* Journey Collection */}
          {/* ----------------------------------------------------------------- */}

          <MyJourneys />
        </div>
      </div>
    </main>
  );
}
