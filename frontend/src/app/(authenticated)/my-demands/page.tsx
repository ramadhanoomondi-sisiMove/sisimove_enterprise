// -----------------------------------------------------------------------------
// sisiMove — My Journey Demands Page
// -----------------------------------------------------------------------------
//
// Authenticated route entry point for the current member's Journey Demands.
//
// Responsibilities:
// - establish the /my-demands route;
// - compose the Journey Demand authenticated route/container component.
//
// Non-responsibilities:
// - data fetching;
// - loading state;
// - error state;
// - Journey Demand mapping;
// - lifecycle/business-state logic;
// - list rendering.
//
// The authenticated route group owns the authentication boundary.
// The Journey Demand feature owns its query and presentation composition.
//
// Route:
//
//   /my-demands
// -----------------------------------------------------------------------------

import { MyJourneyDemandsRoute } from '@/components/journey-demand/my-demands/my-journey-demands-route';

export default function MyJourneyDemandsPage() {
  return <MyJourneyDemandsRoute />;
}

