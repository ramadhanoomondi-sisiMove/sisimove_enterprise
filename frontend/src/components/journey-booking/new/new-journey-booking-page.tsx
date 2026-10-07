// src/components/journey-booking/new/new-journey-booking-page.tsx

// -----------------------------------------------------------------------------
// SisiMove — New Journey Booking
// -----------------------------------------------------------------------------
//
// Purpose:
// Composes the authenticated Journey booking workflow.
//
// Route:
//   /bookings/new?journeyPublicId=[journeyPublicId]
//
// Architecture:
//
//   PublicJourney
//       ↓
//   Journey presentation
//       ↓
//   JourneyBookingForm
//       ↓
//   JourneyBooking
//
// The JourneyBookingForm owns the booking workflow and its mutations.
// This page resolves the selected Journey and authenticated identity,
// then adapts the PublicJourney read model into the booking workflow model.
//
// passengerPublicId is never submitted by this component.
// The backend derives passenger identity from the authenticated JWT.
// -----------------------------------------------------------------------------

"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/foundation";
import { AUTHENTICATED_ROUTES } from "@/foundation/routing";

import type { PublicAsset } from "@/features/assets/models";
import { usePublicJourney } from "@/features/journey/hooks/queries/use-public-journey";
import { useCurrentIdentity } from "@/features/identity/hooks/use-current-identity";

import type { JourneyBookingFormJourney } from "@/components/journey-booking/create";
import { JourneyBookingForm } from "@/components/journey-booking/create";

import { JourneyCapacity } from "@/components/journey/detail/journey-capacity";
import { JourneyOverview } from "@/components/journey/detail/journey-overview";
import { JourneyPreferences } from "@/components/journey/detail/journey-preferences";
import { JourneyPricing } from "@/components/journey/detail/journey-pricing";
import { JourneyTravelWindow } from "@/components/journey/detail/journey-travel-window";
import { JourneyVehicle } from "@/components/journey/detail/journey-vehicle";
import { JourneyAssets } from "@/components/journey/detail/journey-assets";

// =============================================================================
// Props
// =============================================================================

export interface NewJourneyBookingPageProps {
  /**
   * Public identifier of the Journey the traveller intends to book.
   *
   * Source:
   *
   *   /bookings/new?journeyPublicId=[journeyPublicId]
   */
  readonly journeyPublicId?: string;

  /**
   * Already-resolved public assets.
   *
   * Asset resolution belongs to the public asset boundary.
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
  // Booking creation requires an authenticated account.
  //
  // The identity is only used as an authentication/readiness check.
  //
  // Its public identifier is never submitted to the Booking API.
  // ===========================================================================

  const {
    data: identity,
    isLoading: isIdentityLoading,
    error: identityError,
  } = useCurrentIdentity();

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
  // Booking Journey Adapter
  // ===========================================================================
  //
  // The PublicJourney model already contains the resolved route coordinates.
  //
  // No coordinates are invented here.
  //
  // No route calculation is performed here.
  //
  // The booking workflow receives the exact Journey route and schedule
  // projection supplied by the Journey application boundary.
  // ===========================================================================

  const bookingJourney: JourneyBookingFormJourney = {
    publicId: journey.publicId,

    originName: journey.route.origin.name,
    destinationName: journey.route.destination.name,

    originCoordinates: {
      latitude: journey.route.origin.latitude,
      longitude: journey.route.origin.longitude,
    },

    destinationCoordinates: {
      latitude: journey.route.destination.latitude,
      longitude: journey.route.destination.longitude,
    },

    departureAt: journey.schedule.departureAt,
    arrivalAt: journey.schedule.arrivalAt,
    timezone: journey.schedule.timezone,

    availableSeats: journey.capacity.availableSeats,

    pricePerSeat: journey.pricing.amount,
    currency: journey.pricing.currency,

    vehicleMake: journey.vehicle.make,
    vehicleModel: journey.vehicle.model,
    vehicleYear: journey.vehicle.year,
    vehicleColor: journey.vehicle.color,
    vehicleRegistration: journey.vehicle.registration,
  };

  // ===========================================================================
  // Booking Confirmation
  // ===========================================================================
  //
  // JourneyBookingForm completes the booking workflow.
  //
  // Once the backend returns the persisted Journey Booking public identifier,
  // this page navigates to the canonical persisted Booking route.
  // ===========================================================================

  const handleBookingConfirmed = (
    journeyBookingPublicId: string,
  ) => {
    router.push(
      AUTHENTICATED_ROUTES.BOOKING(
        journeyBookingPublicId,
      ),
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
          {/* -----------------------------------------------------------------
              00 — Booking heading
          ----------------------------------------------------------------- */}

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
                Confirm the Journey details and complete your
                booking step by step.
              </p>
            </div>
          </section>

          {/* -----------------------------------------------------------------
              01 — Journey identity, route and provider
          ----------------------------------------------------------------- */}

          <JourneyOverview journey={journey} />

          {/* -----------------------------------------------------------------
              02 — When the Journey happens
          ----------------------------------------------------------------- */}

          <JourneyTravelWindow
            schedule={journey.schedule}
          />

          {/* -----------------------------------------------------------------
              03 — Current seat availability
          ----------------------------------------------------------------- */}

          <JourneyCapacity
            capacity={journey.capacity}
          />

          {/* -----------------------------------------------------------------
              04 — Published seat price
          ----------------------------------------------------------------- */}

          <JourneyPricing
            pricing={journey.pricing}
          />

          {/* -----------------------------------------------------------------
              05 — Vehicle identity and imagery
          ----------------------------------------------------------------- */}

          <JourneyVehicle
            vehicle={journey.vehicle}
            assets={journey.assets}
            publicAssets={publicAssets}
          />

          {/* -----------------------------------------------------------------
              06 — Shared Journey expectations
          ----------------------------------------------------------------- */}

          {journey.preferences ? (
            <JourneyPreferences
              preferences={journey.preferences}
            />
          ) : null}

          {/* -----------------------------------------------------------------
              07 — Journey assets
          ----------------------------------------------------------------- */}

          <JourneyAssets
            assets={journey.assets}
            publicAssets={publicAssets}
          />

          {/* -----------------------------------------------------------------
              08 — Complete Booking workflow
          ----------------------------------------------------------------- */}

          <JourneyBookingForm
            journey={bookingJourney}
            onConfirmed={handleBookingConfirmed}
          />
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Loading State
// =============================================================================

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