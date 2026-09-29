// -----------------------------------------------------------------------------
// sisiMove — New Journey Page
// -----------------------------------------------------------------------------
//
// Authenticated entry point for creating a new Journey.
//
// Responsibilities:
// - provide a convenient `/my-journeys/new` entry point;
// - redirect into the canonical Journey creation workflow.
//
// Non-responsibilities:
// - no Journey creation mutation;
// - no Journey form state;
// - no Journey component attachment;
// - no Journey validation;
// - no Journey lifecycle logic;
// - no duplicate creation workflow.
//
// The canonical Journey creation workflow remains under the authenticated
// Journey creation routes defined by AUTHENTICATED_ROUTES.
//
// -----------------------------------------------------------------------------

import { redirect } from "next/navigation";

import { AUTHENTICATED_ROUTES } from "@/foundation/routing";

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function NewMyJourneyPage() {
  redirect(AUTHENTICATED_ROUTES.MY_JOURNEY_NEW);
}

