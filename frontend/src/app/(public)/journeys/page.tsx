// -----------------------------------------------------------------------------
// sisiMove — Public Journey Marketplace Route
// -----------------------------------------------------------------------------
//
// Route:
//
//   /journeys
//
// Responsibilities:
// - establish the public Journey marketplace route;
// - provide optional initial marketplace filters;
// - compose JourneyMarketplace.
//
// Non-responsibilities:
// - no Journey API calls;
// - no query hooks;
// - no filter state;
// - no Journey card/list rendering;
// - no booking behavior;
// - no route construction;
// - no Journey domain logic.
//
// The JourneyMarketplace component owns the marketplace interaction boundary.
//
// -----------------------------------------------------------------------------

import { JourneyMarketplace } from "@/components/journey/marketplace";

export default function JourneysPage() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <JourneyMarketplace />
      </div>
    </main>
  );
}