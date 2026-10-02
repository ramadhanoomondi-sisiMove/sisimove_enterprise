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
// After successful creation, ownership of the existing Journey passes to the
// JourneyEditor surface at:
//
//   /my-journeys/:publicId/edit
//
// The review surface is reached later, after editing is complete.
//
// -----------------------------------------------------------------------------

"use client";

import { useRouter } from "next/navigation";

import { JourneyCreateForm } from "@/components/journey/create";
import { AUTHENTICATED_ROUTES } from "@/foundation/routing";

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function NewMyJourneyPage() {
  const router = useRouter();

  return (
    <JourneyCreateForm
      onCreated={(journeyPublicId) => {
        router.push(
          AUTHENTICATED_ROUTES.JOURNEY_CREATE(
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