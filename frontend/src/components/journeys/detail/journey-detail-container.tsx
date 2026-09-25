// -----------------------------------------------------------------------------
// sisiMove — Journey Detail Container
// -----------------------------------------------------------------------------
//
// Upper-level presentation container for the Journey detail surface.
//
// Responsibilities:
// - Compose the completed Journey detail sections in a stable visual order.
// - Provide the shared surface/container treatment for the detail content.
// - Keep Journey detail composition in one reusable component.
// - Remain presentation-only.
//
// Non-responsibilities:
// - Data fetching.
// - Routing.
// - Lifecycle mutations.
// - Booking.
// - Authorization.
// - Verification decisions.
// - Navigation decisions.
// - API communication.
//
// Architectural boundary:
//
//     Next.js route / page
//             │
//             │ Journey
//             ▼
//     JourneyDetailContainer
//             │
//             ├── JourneyDetailHeader
//             ├── JourneyDetailRoute
//             ├── JourneyDetailSchedule
//             ├── JourneyDetailVehicle
//             ├── JourneyDetailCapacity
//             ├── JourneyDetailPricing
//             ├── JourneyDetailPreferences
//             └── JourneyDetailAssets
//
// The page remains responsible for loading the Journey and deciding what
// workflow/navigation actions belong around the detail surface.
//
// -----------------------------------------------------------------------------

import type { Journey } from '@/features/journey/models/journey';

import {
  JourneyDetailAssets,
} from './journey-detail-assets';

import {
  JourneyDetailCapacity,
} from './journey-detail-capacity';

import {
  JourneyDetailHeader,
} from './journey-detail-header';

import {
  JourneyDetailPreferences,
} from './journey-detail-preferences';

import {
  JourneyDetailPricing,
} from './journey-detail-pricing';

import {
  JourneyDetailRoute,
} from './journey-detail-route';

import {
  JourneyDetailSchedule,
} from './journey-detail-schedule';

import {
  JourneyDetailVehicle,
} from './journey-detail-vehicle';

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------

export interface JourneyDetailContainerProps {
  journey: Journey;
  className?: string;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export function JourneyDetailContainer({
  journey,
  className,
}: JourneyDetailContainerProps) {
  return (
    <div
      className={[
        'space-y-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <JourneyDetailHeader journey={journey} />

      <JourneyDetailRoute journey={journey} />

      <JourneyDetailSchedule journey={journey} />

      <JourneyDetailVehicle journey={journey} />

      <JourneyDetailCapacity journey={journey} />

      <JourneyDetailPricing journey={journey} />

      <JourneyDetailPreferences journey={journey} />

      <JourneyDetailAssets journey={journey} />
    </div>
  );
}