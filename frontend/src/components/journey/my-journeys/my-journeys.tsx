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
// Collection contract:
// - includes all Journeys returned by the backend, including CANCELLED Journeys;
// - preserves the authoritative backend ordering;
// - does not hide or remove terminal Journeys from the collection.
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
import { cn } from "@/foundation/utils/cn";

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

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex",
          "min-h-48",
          "w-full",
          "items-center",
          "justify-center",
          "rounded-[var(--radius-lg)]",
          "border",
          "border-[var(--border)]",
          "bg-[var(--surface)]",
          "shadow-[var(--shadow-sm)]",
        )}
        aria-label="Loading your Journeys"
        role="status"
      >
        <div
          className={cn(
            "flex",
            "items-center",
            "gap-3",
          )}
        >
          <Spinner size="md" />

          <span
            className={cn(
              "text-sm",
              "text-[var(--foreground-muted)]",
            )}
          >
            Loading your Journeys…
          </span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

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

  if (journeys.length === 0) {
    return (
      <MyJourneyEmptyState
        onCreateJourney={() => {
          router.push(AUTHENTICATED_ROUTES.MY_JOURNEY_NEW);
        }}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Success
  // ---------------------------------------------------------------------------
  //
  // All Journeys returned by the backend are rendered, including terminal
  // CANCELLED Journeys.
  //
  // The list receives the authoritative ordering returned by the backend.
  // No client-side sorting or filtering is introduced here.
  //

  return <MyJourneysList journeys={journeys} />;
}
