
// -----------------------------------------------------------------------------
// sisiMove — Create Journey Demand Page
// -----------------------------------------------------------------------------
//
// Authenticated route entry point for starting a new Journey Demand.
//
// Route:
//
//   /my-demands/new
//
// Responsibilities:
// - establish the create Journey Demand route;
// - compose the Journey Demand creation form.
//
// Non-responsibilities:
// - authentication/authorization;
// - API requests;
// - Journey Demand aggregate construction;
// - backend validation;
// - persistence;
// - lifecycle/business-state logic.
//
// JourneyDemandCreateForm owns its temporary client-side creation workflow.
// The route remains a thin composition boundary.
//
// Creation flow:
//
//   Where → When → Seats → Price
// -----------------------------------------------------------------------------

import { JourneyDemandCreateForm } from '@/components/journey-demand/create';

export default function NewJourneyDemandPage() {
  return <JourneyDemandCreateForm />;
}

