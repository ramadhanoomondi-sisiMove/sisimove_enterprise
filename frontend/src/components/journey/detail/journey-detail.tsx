// -----------------------------------------------------------------------------
// sisiMove — Public Journey Detail
// -----------------------------------------------------------------------------
//
// Composes the public Journey detail sections.
//
// Route:
//
//     /journeys/[publicId]
//
// Projection:
//
//     PublicJourney
//
// Responsibilities:
// - compose the specialized public Journey detail components;
// - present the supplied PublicJourney projection;
// - pass already-resolved public assets to asset presentation components;
// - render optional preference data when supplied.
//
// Non-responsibilities:
// - no API calls;
// - no data fetching;
// - no mutation;
// - no authenticated lifecycle management;
// - no booking orchestration;
// - no domain logic;
// - no status inference;
// - no route/schedule/capacity/pricing calculations;
// - no reconstruction of backend entities or aggregates.
//
// PublicJourney
//   ├── publicId
//   ├── provider
//   │   ├── traveller
//   │   └── trust
//   ├── route
//   ├── schedule
//   ├── vehicle
//   ├── capacity
//   ├── pricing
//   ├── preferences?
//   └── assets[]
//
// Authenticated owner management is intentionally outside this component.
//
//     /my-journeys/[publicId]
//         ↓
//     MyJourney
//         ↓
//     MyJourneyDetail
//
// This separation keeps the public and authenticated projection boundaries
// explicit and prevents the public detail component from depending on
// authenticated lifecycle data that PublicJourney does not expose.
//
// -----------------------------------------------------------------------------

import { cn } from "@/foundation";

import type { PublicAsset } from "@/features/assets/models";
import type { PublicJourney } from "@/features/journey/models";

import { JourneyAssets } from "./journey-assets";
import { JourneyCapacity } from "./journey-capacity";
import { JourneyOverview } from "./journey-overview";
import { JourneyPreferences } from "./journey-preferences";
import { JourneyPricing } from "./journey-pricing";
import { JourneyTravelWindow } from "./journey-travel-window";
import { JourneyVehicle } from "./journey-vehicle";

export interface JourneyDetailProps {
  readonly journey: PublicJourney;
  readonly publicAssets?: readonly PublicAsset[];
  readonly className?: string;
}

export function JourneyDetail({
  journey,
  publicAssets = [],
  className,
}: JourneyDetailProps) {
  return (
    <div
      className={cn(
        "w-full",
        "space-y-4",
        className,
      )}
    >
      <JourneyOverview journey={journey} />

      <JourneyTravelWindow schedule={journey.schedule} />

      <JourneyCapacity capacity={journey.capacity} />

      <JourneyPricing pricing={journey.pricing} />

      <JourneyVehicle
        vehicle={journey.vehicle}
        assets={journey.assets}
        publicAssets={publicAssets}
      />

      {journey.preferences ? (
        <JourneyPreferences preferences={journey.preferences} />
      ) : null}

      <JourneyAssets
        assets={journey.assets}
        publicAssets={publicAssets}
      />
    </div>
  );
}