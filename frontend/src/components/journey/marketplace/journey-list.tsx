// -----------------------------------------------------------------------------
// sisiMove — Public Journey List
// -----------------------------------------------------------------------------
//
// Presents a collection of public Journey marketplace projections.
//
// Responsibilities:
// - render a collection of PublicJourney projections;
// - delegate individual Journey presentation to JourneyCard;
// - expose parent-owned View Journey and Book Journey callbacks;
// - provide responsive vertical marketplace spacing.
//
// Non-responsibilities:
// - no data fetching;
// - no mutation handling;
// - no filtering;
// - no sorting;
// - no pagination;
// - no authorization decisions;
// - no route construction;
// - no Journey state reconstruction;
// - no marketplace ownership;
// - no import of JourneyMarketplace.
//
// Component hierarchy:
//
//   JourneyMarketplace
//          ↓
//   JourneyList
//          ↓
//   JourneyCard
//          ↓
//   JourneyActions
//
// JourneyList is intentionally a collection/presentation component.
// It does not know how Journeys were fetched or why they are ordered.
//
// -----------------------------------------------------------------------------

"use client";

import type { PublicJourney } from "@/features/journey/models";

import { cn } from "@/foundation";

import { JourneyCard } from "./journey-card";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyListProps {
  /**
   * Public Journey projections supplied by the marketplace query.
   *
   * The list renders the collection in the order supplied by its parent.
   * It does not sort or otherwise transform the collection.
   */
  readonly journeys: readonly PublicJourney[];

  /**
   * Controls the information density of each JourneyCard.
   */
  readonly emphasis?: "compact" | "default";

  /**
   * Optional additional classes for the list container.
   */
  readonly className?: string;

  /**
   * Parent-owned View Journey action.
   *
   * The JourneyList supplies the selected Journey to the callback but does
   * not decide how navigation is performed.
   */
  readonly onView?: (journey: PublicJourney) => void;

  /**
   * Parent-owned Book Journey action.
   *
   * The JourneyList supplies the selected Journey to the callback but does
   * not perform authorization, verification, or booking itself.
   */
  readonly onBook?: (journey: PublicJourney) => void;

  /**
   * Identifies the Journey currently being booked.
   *
   * Keeping this state outside the list prevents the collection component
   * from owning booking mutation state.
   */
  readonly bookingJourneyPublicId?: string | null;

  /**
   * Allows the parent to disable View actions.
   */
  readonly viewDisabled?: boolean;

  /**
   * Allows the parent to disable Book actions.
   */
  readonly bookDisabled?: boolean;

  /**
   * Optional action labels passed consistently to every JourneyCard.
   */
  readonly viewLabel?: string;
  readonly bookLabel?: string;
  readonly bookingLabel?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyList({
  journeys,
  emphasis = "default",
  className,
  onView,
  onBook,
  bookingJourneyPublicId = null,
  viewDisabled = false,
  bookDisabled = false,
  viewLabel = "View Journey",
  bookLabel = "Book Journey",
  bookingLabel = "Booking…",
}: JourneyListProps) {
  return (
    <div
      className={cn(
        "grid",
        "grid-cols-1",
        "gap-3",
        "sm:gap-4",
        className,
      )}
      aria-label="Available Journeys"
    >
      {journeys.map((journey) => {
        /**
         * Booking state belongs to the parent mutation owner.
         *
         * Only the Journey whose public ID matches the active mutation
         * receives the loading state.
         */
        const isBooking =
          bookingJourneyPublicId !== null &&
          bookingJourneyPublicId === journey.publicId;

        return (
          <JourneyCard
            key={journey.publicId}
            journey={journey}
            emphasis={emphasis}
            onView={
              onView
                ? () => {
                    onView(journey);
                  }
                : undefined
            }
            onBook={
              onBook
                ? () => {
                    onBook(journey);
                  }
                : undefined
            }
            isBooking={isBooking}
            viewDisabled={viewDisabled}
            bookDisabled={bookDisabled}
            viewLabel={viewLabel}
            bookLabel={bookLabel}
            bookingLabel={bookingLabel}
          />
        );
      })}
    </div>
  );
}