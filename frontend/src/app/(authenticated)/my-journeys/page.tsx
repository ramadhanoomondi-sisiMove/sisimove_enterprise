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
      <div className="page-container py-6 sm:py-8">
        <div className="mx-auto w-full max-w-4xl">
          <header className="mb-6">
            <h1 className="text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
              My Journeys
            </h1>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Manage the Journeys you have created and shared with travellers.
            </p>
          </header>

          <MyJourneys />
        </div>
      </div>
    </main>
  );
}