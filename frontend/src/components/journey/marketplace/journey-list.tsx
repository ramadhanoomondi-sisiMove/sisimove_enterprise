// -----------------------------------------------------------------------------
// Path: src/features/journey/components/journey-list.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Public Journey List
//
// Presents a dense collection of public Journey marketplace projections.
//
// Responsive philosophy:
// - JourneyList remains a simple full-width collection.
// - JourneyCard owns all internal responsive scaling.
// - JourneyCards retain the same horizontal composition at every viewport.
// - Cards contract proportionally rather than switching to stacked layouts.
// - Collection spacing remains compact and consistent.
//
// Responsibilities:
// - render a collection of PublicJourney projections;
// - delegate individual Journey presentation to JourneyCard;
// - expose parent-owned View, Share, and Book Journey callbacks;
// - provide consistent marketplace collection spacing.
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
// - no price-range filtering;
// - no responsive reconstruction of JourneyCard.
//
// Price filtering:
// - JourneyList receives only the already-filtered PublicJourney projections;
// - price-range filtering is owned by JourneyMarketplace and the public
//   Journey discovery query;
// - JourneyList must never perform client-side price filtering;
// - the backend remains authoritative for marketplace discovery.
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
// It does not know how Journeys were fetched, filtered, or why they are ordered.
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
   * It does not sort, filter, or otherwise transform the collection.
   */
  readonly journeys: readonly PublicJourney[];

  /**
   * Controls the information density of each JourneyCard.
   *
   * Compact is the default for the public marketplace so more Journeys
   * remain visible on screen at once.
   */
  readonly emphasis?: "compact" | "default";

  /**
   * Optional additional classes for the list container.
   */
  readonly className?: string;

  /**
   * Parent-owned View Journey action.
   */
  readonly onView?: (journey: PublicJourney) => void;

  /**
   * Parent-owned Share Journey action.
   */
  readonly onShare?: (journey: PublicJourney) => void;

  /**
   * Parent-owned Book Journey action.
   */
  readonly onBook?: (journey: PublicJourney) => void;

  /**
   * Identifies the Journey currently being booked.
   *
   * Booking mutation state remains owned by the parent.
   */
  readonly bookingJourneyPublicId?: string | null;

  /**
   * Allows the parent to disable View actions.
   */
  readonly viewDisabled?: boolean;

  /**
   * Allows the parent to disable Share actions.
   */
  readonly shareDisabled?: boolean;

  /**
   * Allows the parent to disable Book actions.
   */
  readonly bookDisabled?: boolean;

  /**
   * Optional action labels passed consistently to every JourneyCard.
   */
  readonly viewLabel?: string;
  readonly shareLabel?: string;
  readonly bookLabel?: string;
  readonly bookingLabel?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyList({
  journeys,
  emphasis = "compact",
  className,
  onView,
  onShare,
  onBook,
  bookingJourneyPublicId = null,
  viewDisabled = false,
  shareDisabled = false,
  bookDisabled = false,
  viewLabel = "View",
  shareLabel = "Share",
  bookLabel = "Book",
  bookingLabel = "Booking…",
}: JourneyListProps) {
  return (
    <div
      className={cn(
        "flex",
        "w-full",
        "min-w-0",
        "flex-col",
        "gap-2",
        "sm:gap-3",
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
            onShare={
              onShare
                ? () => {
                    onShare(journey);
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
            shareDisabled={shareDisabled}
            bookDisabled={bookDisabled}
            viewLabel={viewLabel}
            shareLabel={shareLabel}
            bookLabel={bookLabel}
            bookingLabel={bookingLabel}
          />
        );
      })}
    </div>
  );
}