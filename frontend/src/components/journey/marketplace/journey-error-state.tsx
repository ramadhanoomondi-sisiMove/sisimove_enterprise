// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Error State
// -----------------------------------------------------------------------------
//
// Journey-specific error state for the public Journey marketplace.
//
// Responsibilities:
// - Explain that Journey marketplace data could not be loaded.
// - Provide Journey-marketplace-specific copy.
// - Expose retry and optional secondary actions.
// - Delegate presentation to the shared ErrorState primitive.
//
// This component does NOT:
// - fetch Journeys;
// - own query state;
// - inspect backend error codes;
// - transform API errors;
// - perform navigation.
//
// The parent marketplace component owns the query lifecycle and supplies the
// appropriate callbacks.
// -----------------------------------------------------------------------------

import { ErrorState } from "@/components/ui";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyErrorStateProps {
  /**
   * Called when the user requests another marketplace load attempt.
   */
  readonly onRetry: () => void;

  /**
   * Optional secondary action supplied by the marketplace parent.
   *
   * For example, the parent may use this to clear an active search.
   */
  readonly onSecondaryAction?: () => void;

  /**
   * Label for the optional secondary action.
   *
   * Kept configurable because the component does not own marketplace
   * navigation or filter behavior.
   */
  readonly secondaryActionLabel?: string;

  /**
   * Optional additional classes for the error-state root.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Icon
// -----------------------------------------------------------------------------

function JourneyErrorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.5 21 19H3L12 3.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5h.01"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyErrorState({
  onRetry,
  onSecondaryAction,
  secondaryActionLabel = "Clear filters",
  className,
}: JourneyErrorStateProps) {
  return (
    <ErrorState
      icon={<JourneyErrorIcon />}
      title="Unable to load Journeys"
      description="We could not load the Journey marketplace right now. Please try again."
      retryAction={{
        label: "Try again",
        variant: "primary",
        onClick: onRetry,
      }}
      secondaryAction={
        onSecondaryAction
          ? {
              label: secondaryActionLabel,
              variant: "outline",
              onClick: onSecondaryAction,
            }
          : undefined
      }
      className={className}
    />
  );
}