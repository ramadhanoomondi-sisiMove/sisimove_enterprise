// -----------------------------------------------------------------------------
// sisiMove — Landing Page
// -----------------------------------------------------------------------------
//
// The landing page is the public composition of the two primary marketplace
// surfaces.
//
// The public route layout owns:
// - SiteHeader;
// - the document-level <main>;
// - SiteFooter.
//
// LandingPage therefore owns only:
// - JourneyMarketplace;
// - JourneyDemandMarketplace.
//
// Each marketplace remains an independent feature boundary and owns its own:
// - query;
// - filter state;
// - loading state;
// - error state;
// - empty state;
// - result presentation.
//
// There is deliberately no combined marketplace abstraction.
//
// -----------------------------------------------------------------------------

import { JourneyMarketplace } from "@/components/journey/marketplace";
import { JourneyDemandMarketplace } from "@/components/journey-demand/marketplace";

// =============================================================================
// Landing Page
// =============================================================================

export function LandingPage() {
  return (
    <div className="w-full min-w-0">
      <JourneyMarketplace />

      <JourneyDemandMarketplace />
    </div>
  );
}