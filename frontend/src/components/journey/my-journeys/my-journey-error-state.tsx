// -----------------------------------------------------------------------------
// sisiMove — My Journey Error State
// -----------------------------------------------------------------------------
//
// Error state for the authenticated My Journeys collection.
//
// Responsibilities:
// - present a recoverable My Journeys loading/data error;
// - expose the retry action;
// - remain independent of query implementation details.
//
// Non-responsibilities:
// - no Journey fetching;
// - no Journey mutation;
// - no error transformation;
// - no routing.
//
// The owning MyJourneys component supplies the retry callback from
// useMyJourneys(). The feature error component only presents that state.
//
// -----------------------------------------------------------------------------

import { ErrorState } from "@/components/ui";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MyJourneyErrorStateProps {
  /**
   * Error returned by the My Journeys query.
   *
   * The component does not inspect or transform the Error. The owning
   * collection component remains responsible for deciding what error
   * information should be exposed to the member.
   */
  readonly error: Error;

  /**
   * Retry the My Journeys query.
   */
  readonly onRetry: () => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MyJourneyErrorState({
  error,
  onRetry,
}: MyJourneyErrorStateProps) {
  return (
    <ErrorState
      title="We could not load your Journeys"
      description={
        error.message ||
        "We could not load your Journeys. Please try again."
      }
      retryAction={{
        label: "Try again",
        onClick: onRetry,
      }}
      className="py-16"
    />
  );
}

