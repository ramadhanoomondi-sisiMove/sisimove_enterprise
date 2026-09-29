// -----------------------------------------------------------------------------
// sisiMove — My Journeys
// -----------------------------------------------------------------------------
//
// Authenticated My Journeys collection surface.
//
// Responsibilities:
// - execute useMyJourneys();
// - coordinate loading, error, empty, and success states;
// - provide Journey creation navigation to the empty state;
// - delegate Journey collection rendering to MyJourneysList.
//
// Non-responsibilities:
// - no direct API calls;
// - no Journey mutations;
// - no Journey lifecycle logic;
// - no Journey card presentation;
// - no Journey sorting or filtering;
// - no recreation of backend Journey behavior.
//
// The query hook owns data retrieval. The child components own presentation.
// This component is the stateful composition boundary for the collection.
//
// -----------------------------------------------------------------------------

"use client";

import { useRouter } from "next/navigation";

import { Spinner } from "@/components/ui";
import { AUTHENTICATED_ROUTES } from "@/foundation/routing";

import { useMyJourneys } from "@/features/journey/hooks/queries/use-my-journeys";

import { MyJourneyEmptyState } from "./my-journey-empty-state";
import { MyJourneyErrorState } from "./my-journey-error-state";
import { MyJourneysList } from "./my-journeys-list";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MyJourneys() {
  const router = useRouter();

  const {
    journeys,
    isLoading,
    error,
    refetch,
  } = useMyJourneys();

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------
  //
  // The query owns loading state. This surface only presents it.
  //
  // Keep the loading presentation deliberately lightweight so the collection
  // does not introduce a second domain-specific loading primitive.
  //

  if (isLoading) {
    return (
      <div
        className={[
          "flex",
          "min-h-48",
          "w-full",
          "items-center",
          "justify-center",
        ].join(" ")}
        aria-label="Loading your Journeys"
        role="status"
      >
        <Spinner />
        <span className="sr-only">
          Loading your Journeys
        </span>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------
  //
  // The query hook already normalizes unknown thrown values into Error.
  // MyJourneyErrorState remains responsible only for presentation and retry.
  //

  if (error) {
    return (
      <MyJourneyErrorState
        error={error}
        onRetry={refetch}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Empty
  // ---------------------------------------------------------------------------
  //
  // Empty is a successful query result containing no Journey projections.
  // It is intentionally distinct from loading and error states.
  //

  if (journeys.length === 0) {
    return (
      <MyJourneyEmptyState
        onCreateJourney={() =>
          router.push(AUTHENTICATED_ROUTES.JOURNEY_CREATE_START)
        }
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Success
  // ---------------------------------------------------------------------------
  //
  // The list receives the authoritative ordering returned by the backend.
  // No client-side sorting or filtering is introduced here.
  //

  return (
    <MyJourneysList journeys={journeys} />
  );
}

