// -----------------------------------------------------------------------------
// Path: src/features/journey/components/journey-detail.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Public Journey Detail
//
// Composes the public Journey detail sections.
//
// Product flow:
//
//     ACTIONS
//       ↓
//     ROUTE
//       ↓
//     WHEN
//       ↓
//     SEATS
//       ↓
//     PRICE
//       ↓
//     VEHICLE
//       ↓
//     EXPECTATIONS
//       ↓
//     VISUAL PROOF
//
// Route:
//
//     /journeys/[publicId]
//
// Projection:
//
//     PublicJourney
//
// Responsibilities:
// - compose the specialized public Journey detail components;
// - present the supplied PublicJourney projection;
// - present public Journey actions;
// - pass already-resolved public assets to asset presentation components;
// - render optional preference data when supplied.
//
// Non-responsibilities:
// - no API calls;
// - no data fetching;
// - no mutation;
// - no authenticated lifecycle management;
// - no booking orchestration;
// - no domain logic;
// - no status inference;
// - no route/schedule/capacity/pricing calculations;
// - no reconstruction of backend entities or aggregates.
//
// PublicJourney
//   ├── publicId
//   ├── provider
//   │   ├── traveller
//   │   └── trust
//   ├── route
//   ├── schedule
//   ├── vehicle
//   ├── capacity
//   ├── pricing
//   ├── preferences?
//   └── assets[]
//
// Authenticated owner management is intentionally outside this component.
//
//     /my-journeys/[publicId]
//         ↓
//     MyJourney
//         ↓
//     MyJourneyDetail
//
// This separation keeps the public and authenticated projection boundaries
// explicit and prevents the public detail component from depending on
// authenticated lifecycle data that PublicJourney does not expose.
//
// -----------------------------------------------------------------------------

"use client";

import { cn } from "@/foundation";

import type { PublicAsset } from "@/features/assets/models";
import type { PublicJourney } from "@/features/journey/models";

import { JourneyActions } from "../shared/journey-actions";
import { JourneyAssets } from "./journey-assets";
import { JourneyCapacity } from "./journey-capacity";
import { JourneyOverview } from "./journey-overview";
import { JourneyPreferences } from "./journey-preferences";
import { JourneyPricing } from "./journey-pricing";
import { JourneyTravelWindow } from "./journey-travel-window";
import { JourneyVehicle } from "./journey-vehicle";

// =============================================================================
// Props
// =============================================================================

export interface JourneyDetailProps {
  /**
   * Public Journey projection supplied by the public Journey boundary.
   */
  readonly journey: PublicJourney;

  /**
   * Already-resolved public assets.
   *
   * Asset resolution belongs to the public asset boundary, not this
   * composition component.
   */
  readonly publicAssets?: readonly PublicAsset[];

  /**
   * View the public Journey.
   */
  readonly onView?: () => void;

  /**
   * Share the public Journey.
   */
  readonly onShare?: () => void;

  /**
   * Begin booking the Journey.
   */
  readonly onBook?: () => void;

  /**
   * Indicates that the booking action is currently processing.
   */
  readonly isBooking?: boolean;

  /**
   * Disables the View action.
   */
  readonly viewDisabled?: boolean;

  /**
   * Disables the Share action.
   */
  readonly shareDisabled?: boolean;

  /**
   * Disables the Book action.
   */
  readonly bookDisabled?: boolean;

  /**
   * Optional custom action labels.
   */
  readonly viewLabel?: string;
  readonly shareLabel?: string;
  readonly bookLabel?: string;
  readonly bookingLabel?: string;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDetail({
  journey,
  publicAssets = [],
  onView,
  onShare,
  onBook,
  isBooking = false,
  viewDisabled = false,
  shareDisabled = false,
  bookDisabled = false,
  viewLabel = "View Journey",
  shareLabel = "Share",
  bookLabel = "Book Journey",
  bookingLabel = "Booking…",
  className,
}: JourneyDetailProps) {
  return (
    <div
      className={cn(
        "w-full",
        "px-4",
        "py-5",
        "sm:px-6",
        "sm:py-6",
        "lg:px-8",
        "lg:py-8",
        className,
      )}
    >
      <div className="space-y-5">
        {/* ----------------------------------------------------------------- */}
        {/* 00 — Journey actions                                               */}
        {/* ----------------------------------------------------------------- */}

        {onView || onShare || onBook ? (
          <section
            aria-label="Journey actions"
            className={cn(
              "flex",
              "w-full",
              "min-w-0",
              "items-center",
              "justify-end",
              "rounded-[clamp(0.7rem,1.2vw,1rem)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--surface-subtle)]",
              "px-[clamp(0.65rem,1.4vw,1.1rem)]",
              "py-[clamp(0.55rem,1vw,0.8rem)]",
              "shadow-[var(--shadow-sm)]",
            )}
          >
            <JourneyActions
              onView={onView}
              onShare={onShare}
              onBook={onBook}
              isBooking={isBooking}
              viewDisabled={viewDisabled}
              shareDisabled={shareDisabled}
              bookDisabled={bookDisabled}
              emphasis="default"
              viewLabel={viewLabel}
              shareLabel={shareLabel}
              bookLabel={bookLabel}
              bookingLabel={bookingLabel}
            />
          </section>
        ) : null}

        {/* ----------------------------------------------------------------- */}
        {/* 01 — Journey identity, route and provider                         */}
        {/* ----------------------------------------------------------------- */}

        <JourneyOverview journey={journey} />

        {/* ----------------------------------------------------------------- */}
        {/* 02 — When the Journey happens                                     */}
        {/* ----------------------------------------------------------------- */}

        <JourneyTravelWindow schedule={journey.schedule} />

        {/* ----------------------------------------------------------------- */}
        {/* 03 — Current seat availability                                    */}
        {/* ----------------------------------------------------------------- */}

        <JourneyCapacity capacity={journey.capacity} />

        {/* ----------------------------------------------------------------- */}
        {/* 04 — Published seat price                                         */}
        {/* ----------------------------------------------------------------- */}

        <JourneyPricing pricing={journey.pricing} />

        {/* ----------------------------------------------------------------- */}
        {/* 05 — Vehicle identity and imagery                                 */}
        {/* ----------------------------------------------------------------- */}

        <JourneyVehicle
          vehicle={journey.vehicle}
          assets={journey.assets}
          publicAssets={publicAssets}
        />

        {/* ----------------------------------------------------------------- */}
        {/* 06 — Shared Journey expectations                                  */}
        {/* ----------------------------------------------------------------- */}

        {journey.preferences ? (
          <JourneyPreferences preferences={journey.preferences} />
        ) : null}

        {/* ----------------------------------------------------------------- */}
        {/* 07 — Visual proof / Journey imagery                               */}
        {/* ----------------------------------------------------------------- */}

        <JourneyAssets
          assets={journey.assets}
          publicAssets={publicAssets}
        />
      </div>
    </div>
  );
}

export default JourneyDetail;