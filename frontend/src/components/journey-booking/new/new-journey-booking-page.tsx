// -----------------------------------------------------------------------------
// SisiMove — New Journey Booking
// -----------------------------------------------------------------------------
//
// Path:
// src/components/journey-booking/new/new-journey-booking-page.tsx
//
// Purpose:
// Composes the authenticated Journey booking/review workflow.
//
// Product flow:
//
//     JOURNEY
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
//     ASSETS
//       ↓
//     BOOKING REVIEW
//       ↓
//     CREATE BOOKING
//
// Route:
//
//     /bookings/new?journeyPublicId=[journeyPublicId]
//
// Input:
//
//     journeyPublicId
//
// Resolved application data:
//
//     usePublicJourney()
//     useCurrentIdentity()
//
// Mutation:
//
//     useCreateJourneyBooking()
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - resolve the Journey selected for booking;
// - resolve the authenticated member creating the Booking;
// - compose the existing Journey presentation components;
// - manage local seat-selection state;
// - invoke Booking creation;
// - navigate to the persisted Booking after successful creation.
//
// -----------------------------------------------------------------------------
//
// Non-responsibilities:
//
// - no Journey creation;
// - no Journey mutation;
// - no Booking aggregate reconstruction;
// - no Booking pricing reconstruction;
// - no payment processing;
// - no lifecycle inference;
// - no backend domain validation;
// - no capacity calculation;
// - no route/schedule calculation;
// - no authenticated ownership determination.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
// ---------
//
// This is a BOOKING workflow component, not a second Journey detail model.
//
// Before booking:
//
//     PublicJourney
//
// After booking:
//
//     JourneyBooking
//
// The Booking bounded context remains authoritative for:
//
// - authenticated passenger identity;
// - Journey validation;
// - seat validation;
// - Booking snapshot;
// - pricing;
// - payment state;
// - Booking lifecycle;
// - domain invariants.
//
// The frontend only submits the HTTP fields accepted by the Booking create
// endpoint:
//
//     {
//       journeyPublicId,
//       seats,
//       correlationId?,
//       causationId?
//     }
//
// passengerPublicId is deliberately NOT submitted by this component.
//
// The backend derives passengerPublicId from the authenticated JWT identity.
// This prevents the client from choosing another passenger's identity.
//
// -----------------------------------------------------------------------------
//
// COMPOSITION
// -----------
//
// This intentionally follows the same composition style as JourneyDetail.
//
// Existing Journey presentation components remain responsible for presenting
// their respective Journey sections:
//
//     JourneyOverview
//     JourneyTravelWindow
//     JourneyCapacity
//     JourneyPricing
//     JourneyVehicle
//     JourneyPreferences
//     JourneyAssets
//
// Booking-specific presentation is limited to:
//
//     booking seat selection
//     booking review
//     booking creation action
//
// This avoids creating another parallel Journey presentation hierarchy.
//
// -----------------------------------------------------------------------------
//
// VISUAL SYSTEM
// -------------
//
// This component uses the frozen sisiMove global stylesheet as its only visual
// foundation.
//
// No local colors, invented design tokens, or Tailwind semantic aliases such
// as:
//
//     bg-background
//     text-foreground
//     text-muted-foreground
//     bg-brand
//     bg-[var(--surface-subtle)]
//
// are used.
//
// Frozen tokens are referenced directly:
//
//     --background
//     --background-subtle
//     --background-muted
//     --foreground
//     --foreground-secondary
//     --foreground-muted
//     --foreground-subtle
//     --border
//     --border-subtle
//     --brand
//     --brand-hover
//     --brand-soft
//     --brand-foreground
//     --danger
//     --danger-soft
//     --radius-*
//
//     --shadow-*
//
// -----------------------------------------------------------------------------

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/foundation";
import { AUTHENTICATED_ROUTES } from "@/foundation/routing";

import type { PublicAsset } from "@/features/assets/models";
import { usePublicJourney } from "@/features/journey/hooks/queries/use-public-journey";
import { useCurrentIdentity } from "@/features/identity/hooks/use-current-identity";
import { useCreateJourneyBooking } from "@/features/journey-booking";

import { JourneyCapacity } from "@/components/journey/detail/journey-capacity";
import { JourneyOverview } from "@/components/journey/detail/journey-overview";
import { JourneyPreferences } from "@/components/journey/detail/journey-preferences";
import { JourneyPricing } from "@/components/journey/detail/journey-pricing";
import { JourneyTravelWindow } from "@/components/journey/detail/journey-travel-window";
import { JourneyVehicle } from "@/components/journey/detail/journey-vehicle";
import { JourneyAssets } from "@/components/journey/detail/journey-assets";

import { JourneyBookingSelection } from "../shared/journey-booking-selection";

// =============================================================================
// Props
// =============================================================================

export interface NewJourneyBookingPageProps {
  /**
   * Public identifier of the Journey the traveller intends to book.
   *
   * Source:
   *
   *     /bookings/new?journeyPublicId=[journeyPublicId]
   */
  readonly journeyPublicId?: string;

  /**
   * Already-resolved public assets.
   *
   * Asset resolution belongs to the public asset boundary.
   *
   * This component only passes resolved assets into the Journey presentation
   * components when they are available.
   */
  readonly publicAssets?: readonly PublicAsset[];

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function NewJourneyBookingPage({
  journeyPublicId,
  publicAssets = [],
  className,
}: NewJourneyBookingPageProps) {
  const router = useRouter();

  // ===========================================================================
  // Journey
  // ===========================================================================
  //
  // The Journey is resolved through the existing public Journey application
  // boundary.
  //
  // We do not reconstruct a Journey object locally.
  // ===========================================================================

  const normalizedJourneyPublicId = journeyPublicId?.trim() ?? "";

  const {
    journey,
    isLoading: isJourneyLoading,
    error: journeyError,
  } = usePublicJourney(normalizedJourneyPublicId);

  // ===========================================================================
  // Current Identity
  // ===========================================================================
  //
  // Booking creation is authenticated.
  //
  // We resolve the current identity to ensure that the authenticated account
  // is available before allowing the booking workflow to proceed.
  //
  // IMPORTANT:
  //
  // identity.publicId is NOT sent to the booking create endpoint.
  //
  // The backend derives passengerPublicId from the authenticated JWT identity.
  // ===========================================================================

  const {
    data: identity,
    isLoading: isIdentityLoading,
    error: identityError,
  } = useCurrentIdentity();

  // ===========================================================================
  // Booking Mutation
  // ===========================================================================

  const createBooking = useCreateJourneyBooking();

  // ===========================================================================
  // Local Booking Selection State
  // ===========================================================================
  //
  // Seats are workflow/presentation state.
  //
  // They are not copied into a Journey model.
  //
  // availableSeats always comes from:
  //
  //     journey.capacity.availableSeats
  //
  // which is already backend-derived.
  // ===========================================================================

  const [seats, setSeats] = useState(1);

  // ===========================================================================
  // Missing Journey Identifier
  // ===========================================================================

  if (!normalizedJourneyPublicId) {
    return (
      <BookingState
        title="Journey not specified"
        message="The Journey you want to book was not specified."
        onBack={() => router.back()}
      />
    );
  }

  // ===========================================================================
  // Loading
  // ===========================================================================

  if (isJourneyLoading || isIdentityLoading) {
    return <BookingLoadingState />;
  }

  // ===========================================================================
  // Journey Error
  // ===========================================================================

  if (journeyError) {
    return (
      <BookingState
        title="Unable to load Journey"
        message={
          journeyError.message ||
          "We could not load this Journey."
        }
        onBack={() => router.back()}
      />
    );
  }

  // ===========================================================================
  // Identity Error
  // ===========================================================================

  if (identityError) {
    return (
      <BookingState
        title="Unable to load your account"
        message={
          identityError.message ||
          "We could not load your authenticated account."
        }
        onBack={() => router.back()}
      />
    );
  }

  // ===========================================================================
  // Missing Journey
  // ===========================================================================

  if (!journey) {
    return (
      <BookingState
        title="Journey unavailable"
        message="This Journey could not be found or is no longer available."
        onBack={() => router.back()}
      />
    );
  }

  // ===========================================================================
  // Missing Authenticated Identity
  // ===========================================================================
  //
  // The booking operation requires an authenticated account.
  //
  // The identity is checked here, but its public identifier is never included
  // in the booking request body.
  // ===========================================================================

  if (!identity) {
    return (
      <BookingState
        title="Authentication required"
        message="Your authenticated account could not be loaded. Please sign in again."
        onBack={() => router.back()}
      />
    );
  }

  // ===========================================================================
  // Booking Availability
  // ===========================================================================

  const availableSeats = journey.capacity.availableSeats;

  const isAvailable = availableSeats > 0;

  const isSeatSelectionValid =
    Number.isInteger(seats) &&
    seats >= 1 &&
    seats <= availableSeats;

  // ===========================================================================
  // Booking Creation
  // ===========================================================================
  //
  // IMPORTANT SECURITY BOUNDARY:
  //
  // The frontend sends ONLY the fields accepted by CreateJourneyBookingDto.
  //
  // Request:
  //
  //     {
  //       journeyPublicId,
  //       seats
  //     }
  //
  // passengerPublicId is intentionally omitted.
  //
  // The authenticated backend controller derives the passenger identity from
  // the authenticated JWT/session context.
  //
  // Pricing, snapshot, payment and Booking lifecycle state remain owned by
  // the Booking bounded context.
  // ===========================================================================

  const handleCreateBooking = () => {
    if (createBooking.isPending) {
      return;
    }

    if (!isSeatSelectionValid) {
      return;
    }

    createBooking.mutate(
      {
        journeyPublicId: journey.publicId,
        seats,
      },
      {
        onSuccess: (booking) => {
          router.push(
            AUTHENTICATED_ROUTES.BOOKING(
              booking.publicId,
            ),
          );
        },
      },
    );
  };

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <main
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
      <div className="mx-auto w-full max-w-3xl">
        <div className="space-y-5">
          {/* ----------------------------------------------------------------- */}
          {/* 00 — Booking heading                                             */}
          {/* ----------------------------------------------------------------- */}

          <section
            aria-label="Booking"
            className={cn(
              "w-full",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--background-subtle)]",
              "px-[clamp(0.65rem,1.4vw,1.1rem)]",
              "py-[clamp(0.65rem,1vw,0.85rem)]",
              "shadow-[var(--shadow-sm)]",
            )}
          >
            <button
              type="button"
              onClick={() => router.back()}
              className={cn(
                "text-sm",
                "font-medium",
                "text-[var(--foreground-muted)]",
                "transition-colors",
                "hover:text-[var(--foreground)]",
              )}
            >
              ← Back
            </button>

            <div className="mt-2">
              <p
                className={cn(
                  "text-xs",
                  "font-semibold",
                  "uppercase",
                  "tracking-wide",
                  "text-[var(--brand)]",
                )}
              >
                Book Journey
              </p>

              <h1
                className={cn(
                  "mt-0.5",
                  "text-lg",
                  "font-semibold",
                  "text-[var(--foreground)]",
                  "sm:text-xl",
                )}
              >
                Review and book this Journey
              </h1>

              <p
                className={cn(
                  "mt-1",
                  "text-sm",
                  "text-[var(--foreground-muted)]",
                )}
              >
                Confirm the Journey details and choose the
                number of seats you need.
              </p>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* 01 — Journey identity, route and provider                        */}
          {/* ----------------------------------------------------------------- */}

          <JourneyOverview journey={journey} />

          {/* ----------------------------------------------------------------- */}
          {/* 02 — When the Journey happens                                    */}
          {/* ----------------------------------------------------------------- */}

          <JourneyTravelWindow
            schedule={journey.schedule}
          />

          {/* ----------------------------------------------------------------- */}
          {/* 03 — Current seat availability                                   */}
          {/* ----------------------------------------------------------------- */}

          <JourneyCapacity
            capacity={journey.capacity}
          />

          {/* ----------------------------------------------------------------- */}
          {/* 04 — Published seat price                                        */}
          {/* ----------------------------------------------------------------- */}

          <JourneyPricing
            pricing={journey.pricing}
          />

          {/* ----------------------------------------------------------------- */}
          {/* 05 — Vehicle identity and imagery                                */}
          {/* ----------------------------------------------------------------- */}

          <JourneyVehicle
            vehicle={journey.vehicle}
            assets={journey.assets}
            publicAssets={publicAssets}
          />

          {/* ----------------------------------------------------------------- */}
          {/* 06 — Shared Journey expectations                                 */}
          {/* ----------------------------------------------------------------- */}

          {journey.preferences ? (
            <JourneyPreferences
              preferences={journey.preferences}
            />
          ) : null}

          {/* ----------------------------------------------------------------- */}
          {/* 07 — Journey assets                                              */}
          {/* ----------------------------------------------------------------- */}

          <JourneyAssets
            assets={journey.assets}
            publicAssets={publicAssets}
          />

          {/* ----------------------------------------------------------------- */}
          {/* 08 — Booking selection                                           */}
          {/* ----------------------------------------------------------------- */}

          <JourneyBookingSelection
            seats={seats}
            availableSeats={availableSeats}
            pricePerSeat={journey.pricing.amount}
            currency={journey.pricing.currency}
            isAvailable={isAvailable}
            isSubmitting={createBooking.isPending}
            error={createBooking.error}
            onSeatsChange={setSeats}
            onSubmit={handleCreateBooking}
          />
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Loading State
// =============================================================================
//
// Loading is deliberately structural rather than a separate loading page.
//
// The user remains inside the same Journey/Booking surface while the Journey
// and authenticated identity reads resolve.
//
// Uses only frozen global design tokens.
//

function BookingLoadingState() {
  return (
    <main
      className={cn(
        "w-full",
        "px-4",
        "py-5",
        "sm:px-6",
        "sm:py-6",
        "lg:px-8",
        "lg:py-8",
      )}
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="space-y-5">
          <div
            aria-hidden="true"
            className={cn(
              "h-24",
              "animate-pulse",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--background-subtle)]",
            )}
          />

          <div
            aria-hidden="true"
            className={cn(
              "h-36",
              "animate-pulse",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--background-subtle)]",
            )}
          />

          <div
            aria-hidden="true"
            className={cn(
              "h-28",
              "animate-pulse",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--background-subtle)]",
            )}
          />

          <div
            aria-hidden="true"
            className={cn(
              "h-28",
              "animate-pulse",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--background-subtle)]",
            )}
          />
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Error / Empty State
// =============================================================================

interface BookingStateProps {
  readonly title: string;
  readonly message: string;
  readonly onBack?: () => void;
}

function BookingState({
  title,
  message,
  onBack,
}: BookingStateProps) {
  return (
    <main
      className={cn(
        "w-full",
        "px-4",
        "py-5",
        "sm:px-6",
        "sm:py-6",
        "lg:px-8",
        "lg:py-8",
      )}
    >
      <div className="mx-auto w-full max-w-3xl">
        <section
          aria-label={title}
          className={cn(
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--border-subtle)]",
            "bg-[var(--background-subtle)]",
            "p-5",
            "shadow-[var(--shadow-sm)]",
          )}
        >
          <h1
            className={cn(
              "text-base",
              "font-semibold",
              "text-[var(--foreground)]",
            )}
          >
            {title}
          </h1>

          <p
            className={cn(
              "mt-1",
              "text-sm",
              "text-[var(--foreground-muted)]",
            )}
          >
            {message}
          </p>

          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className={cn(
                "mt-4",
                "text-sm",
                "font-medium",
                "text-[var(--brand)]",
                "transition-colors",
                "hover:text-[var(--brand-hover)]",
              )}
            >
              ← Go back
            </button>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export default NewJourneyBookingPage;
