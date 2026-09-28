// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Marketplace Route
// -----------------------------------------------------------------------------
//
// Public route:
//     /demands
//
// Route responsibility:
// - establish the public Journey Demand marketplace entry point;
// - compose the feature-owned marketplace component.
//
// The route does NOT:
// - fetch Journey Demands directly;
// - own marketplace state;
// - perform filtering/search logic;
// - perform authorization;
// - recreate Journey Demand models or business rules.
//
// Data retrieval and marketplace interaction are owned by the feature layer.
// -----------------------------------------------------------------------------

import { JourneyDemandMarketplace } from '@/components/journey-demand/marketplace';

export default function JourneyDemandsPage() {
  return <JourneyDemandMarketplace />;
}

