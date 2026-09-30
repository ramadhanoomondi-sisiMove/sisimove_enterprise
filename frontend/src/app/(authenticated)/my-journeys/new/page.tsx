// -----------------------------------------------------------------------------
// sisiMove — New Journey Page
// -----------------------------------------------------------------------------
//
// Authenticated entry point for creating a new Journey.
//
// This is the canonical Journey creation entry point.
//
// The JourneyCreateForm:
// - creates the Journey aggregate exactly once;
// - progressively attaches Journey-owned components;
// - leaves the Journey in DRAFT;
// - returns the backend-generated journeyPublicId when complete.
//
// -----------------------------------------------------------------------------

"use client";

import { useRouter } from "next/navigation";

import { AUTHENTICATED_ROUTES } from "@/foundation/routing";
import { JourneyCreateForm } from "@/components/journey/create";

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function NewMyJourneyPage() {
  const router = useRouter();

  return (
    <JourneyCreateForm
      onCreated={(journeyPublicId) => {
        router.push(
          AUTHENTICATED_ROUTES.JOURNEY_EDIT(
            journeyPublicId,
          ),
        );
      }}
      onCancel={() => {
        router.push(
          AUTHENTICATED_ROUTES.MY_JOURNEYS,
        );
      }}
    />
  );
}