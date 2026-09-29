//src/components/journey/shared/journey-actions.tsx
// -----------------------------------------------------------------------------
// sisiMove — Journey Actions
// -----------------------------------------------------------------------------
//
// Shared action row for Journey presentation surfaces.
//
// Responsibilities:
// - present optional View Journey and Book Journey actions;
// - provide consistent Journey action styling;
// - expose loading/disabled state supplied by the parent;
// - remain reusable by marketplace and detail presentation components.
//
// Non-responsibilities:
// - no navigation;
// - no authorization decisions;
// - no verification checks;
// - no booking eligibility calculation;
// - no mutation handling;
// - no route construction;
// - no Journey lifecycle interpretation.
//
// The consuming component owns the callbacks and all business behavior.
//
// -----------------------------------------------------------------------------

"use client";

import { Button } from "@/components/ui";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyActionsProps {
  /**
   * Opens the public Journey detail surface.
   *
   * Navigation remains owned by the parent.
   */
  readonly onView?: () => void;

  /**
   * Starts the Journey booking action.
   *
   * Authorization, verification, capability checks, and mutation handling
   * remain owned by the parent.
   */
  readonly onBook?: () => void;

  /**
   * Whether the booking operation is currently processing.
   */
  readonly isBooking?: boolean;

  /**
   * Allows the parent to disable the View action.
   */
  readonly viewDisabled?: boolean;

  /**
   * Allows the parent to disable the Book action.
   */
  readonly bookDisabled?: boolean;

  /**
   * Controls information density.
   *
   * Compact is appropriate for marketplace cards.
   * Default provides the normal Journey action treatment.
   */
  readonly emphasis?: "compact" | "default";

  /**
   * Optional action labels.
   */
  readonly viewLabel?: string;
  readonly bookLabel?: string;
  readonly bookingLabel?: string;

  /**
   * Optional additional classes for the action row.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 4.5h10.5A3.5 3.5 0 0 1 19 8v11.5H8.5A3.5 3.5 0 0 1 5 16V4.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 16a3.5 3.5 0 0 1 3.5-3.5H19"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyActions({
  onView,
  onBook,
  isBooking = false,
  viewDisabled = false,
  bookDisabled = false,
  emphasis = "default",
  viewLabel = "View Journey",
  bookLabel = "Book Journey",
  bookingLabel = "Booking…",
  className,
}: JourneyActionsProps) {
  if (!onView && !onBook) {
    return null;
  }

  const isCompact = emphasis === "compact";

  return (
    <div
      className={cn(
        "flex",
        "flex-col-reverse",
        "gap-2",
        "border-t",
        "border-[var(--border-subtle)]",
        "pt-3",
        "sm:flex-row",
        "sm:items-center",
        "sm:justify-end",
        className,
      )}
    >
      {onView && (
        <Button
          type="button"
          variant="outline"
          size={isCompact ? "sm" : "md"}
          leadingIcon={<ArrowRightIcon />}
          onClick={onView}
          disabled={viewDisabled}
          className="w-full sm:w-auto"
        >
          {viewLabel}
        </Button>
      )}

      {onBook && (
        <Button
          type="button"
          variant="primary"
          size={isCompact ? "sm" : "md"}
          leadingIcon={<BookIcon />}
          onClick={onBook}
          loading={isBooking}
          disabled={bookDisabled}
          className="w-full sm:w-auto"
        >
          {isBooking ? bookingLabel : bookLabel}
        </Button>
      )}
    </div>
  );
}