// -----------------------------------------------------------------------------
// src/features/journey-booking/components/create/journey-booking-form.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Booking Form
//
// -----------------------------------------------------------------------------
//
// Journey Booking workflow orchestrator.
//
// Canonical workflow:
//
//   Selected Journey
//        |
//        v
//   Step 1 — Seats
//        |
//        | POST /journey-bookings
//        v
//   PENDING Booking
//        |
//        v
//   Step 2 — Snapshot
//        |
//        | POST /journey-bookings/:bookingPublicId/snapshot
//        v
//   Step 3 — Pricing
//        |
//        | POST /journey-bookings/:bookingPublicId/pricing
//        v
//   Step 4 — Payment
//        |
//        | POST /journey-bookings/:bookingPublicId/payment
//        v
//   Payment Record Created
//        |
//        v
//   Step 5 — Review
//        |
//        | POST /journey-bookings/:bookingPublicId/confirm
//        |
//        | Atomic backend operation:
//        |   - authorize payment
//        |   - create financial hold
//        |   - create financial transaction
//        |   - authorize booking payment
//        |   - confirm booking
//        |   - reserve journey capacity
//        v
//   Confirmed Journey Booking
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Own booking workflow state.
// - Own the current step.
// - Create the Booking exactly once.
// - Coordinate snapshot, pricing, payment, and atomic confirmation mutations.
// - Pass presentation state into child components.
//
// Non-responsibilities:
//
// - Implementing domain rules.
// - Reconstructing the Journey aggregate.
// - Performing authentication.
// - Performing authorization.
// - Calling HTTP APIs directly.
// - Implementing payment-provider logic.
// - Performing payment authorization locally.
//
// The backend owns the atomic payment + confirmation operation.
//
// Mutation hooks remain the React-facing API boundary.
// The backend JourneyBooking aggregate remains authoritative.
//
// -----------------------------------------------------------------------------

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ErrorState } from "@/components/ui/error-state";
import { cn } from "@/foundation/utils/cn";

import { AUTHENTICATED_ROUTES } from "@/foundation/routing/authenticated-routes";

import {
  useConfirmJourneyBooking,
  useCreateJourneyBooking,
  useCreateJourneyBookingPayment,
  useCreateJourneyBookingSnapshot,
  useSetJourneyBookingPricing,
} from "@/features/journey-booking/hooks/mutations";

import {
  JOURNEY_BOOKING_STEPS,
  type JourneyBookingStepId,
  JourneyBookingProgress,
} from "./journey-booking-progress";

import { JourneyBookingSeats } from "./journey-booking-seats";

import {
  JourneyBookingSnapshot,
  type JourneyBookingSnapshotValues,
} from "./journey-booking-snapshot";

import {
  JourneyBookingPricing,
  type JourneyBookingPricingValues,
} from "./journey-booking-pricing";

import {
  JourneyBookingPayment,
  type JourneyBookingPaymentValues,
} from "./journey-booking-payment";

import {
  JourneyBookingReview,
  type JourneyBookingReviewValues,
} from "./journey-booking-review";

// =============================================================================
// Journey Input
// =============================================================================

export interface JourneyBookingFormCoordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export interface JourneyBookingFormJourney {
  readonly publicId: string;

  readonly originName: string;
  readonly destinationName: string;

  /**
   * Coordinates resolved by the Journey corridor.
   *
   * These come from the selected Journey's resolved origin and destination.
   * The passenger never enters or edits these values in the booking flow.
   */
  readonly originCoordinates: JourneyBookingFormCoordinates;
  readonly destinationCoordinates: JourneyBookingFormCoordinates;

  readonly departureAt: string;
  readonly arrivalAt?: string | null;
  readonly timezone: string;

  readonly availableSeats: number;

  readonly pricePerSeat: number;
  readonly currency: string;

  readonly vehicleMake?: string | null;
  readonly vehicleModel?: string | null;
  readonly vehicleYear?: number | null;
  readonly vehicleColor?: string | null;
  readonly vehicleRegistration?: string | null;
}

// =============================================================================
// Props
// =============================================================================

export interface JourneyBookingFormProps {
  /**
   * The Journey selected by the passenger before entering the booking flow.
   *
   * This is the public Journey projection. It is not a Journey Booking.
   */
  readonly journey: JourneyBookingFormJourney;

  /**
   * Called after the booking has been successfully confirmed.
   */
  readonly onConfirmed: (journeyBookingPublicId: string) => void;

  /**
   * Optional cancellation callback owned by the route.
   */
  readonly onCancel?: () => void;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyBookingForm({
  journey,
  onConfirmed,
  onCancel,
  className,
}: JourneyBookingFormProps) {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Workflow state
  // ---------------------------------------------------------------------------

  const [currentStep, setCurrentStep] =
    useState<JourneyBookingStepId>("seats");

  const [
    journeyBookingPublicId,
    setJourneyBookingPublicId,
  ] = useState<string | null>(null);

  const [seats, setSeats] = useState(1);

  const [snapshotAccepted, setSnapshotAccepted] =
    useState(false);

  const [reviewAccepted, setReviewAccepted] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // ---------------------------------------------------------------------------
  // Payment state
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the transaction created by the payment domain.
   *
   * The frontend deliberately does not generate this identifier.
   *
   * It is returned by the payment creation operation and is later supplied
   * to the atomic booking confirmation operation.
   */
  const [
    paymentTransactionPublicId,
    setPaymentTransactionPublicId,
  ] = useState<string | null>(null);

  const [error, setError] =
    useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Mutation hooks
  // ---------------------------------------------------------------------------

  const createBookingMutation =
    useCreateJourneyBooking();

  const createSnapshotMutation =
    useCreateJourneyBookingSnapshot();

  const setPricingMutation =
    useSetJourneyBookingPricing();

  const createPaymentMutation =
    useCreateJourneyBookingPayment();

  /**
   * Confirmation is now the atomic backend operation.
   *
   * It performs payment authorization, financial hold creation, booking
   * confirmation, and journey capacity reservation inside one transaction.
   */
  const confirmBookingMutation =
    useConfirmJourneyBooking();

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const currentStepIndex =
    JOURNEY_BOOKING_STEPS.findIndex(
      (step) => step.id === currentStep,
    );

  const isFirstStep =
    currentStepIndex === 0;

  const isLastStep =
    currentStepIndex ===
    JOURNEY_BOOKING_STEPS.length - 1;

  const totalAmount =
    journey.pricePerSeat * seats;

  /**
   * The insufficient-funds response is a domain-level payment failure.
   *
   * We deliberately inspect the backend message rather than inventing a new
   * frontend error code here, because the atomic confirmation mutation exposes
   * the authoritative domain error.
   */
  const hasInsufficientFundsError =
    error?.message
      .toLowerCase()
      .includes(
        "insufficient available funds",
      ) ?? false;

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  function validateSeats(): void {
    if (
      !Number.isInteger(seats) ||
      seats < 1
    ) {
      throw new Error(
        "Select at least one seat.",
      );
    }

    if (seats > journey.availableSeats) {
      throw new Error(
        "The selected number of seats is no longer available.",
      );
    }
  }

  function requireBookingPublicId(): string {
    if (!journeyBookingPublicId) {
      throw new Error(
        "A Journey Booking has not been created yet.",
      );
    }

    return journeyBookingPublicId;
  }

  function requirePaymentTransactionPublicId(): string {
    if (!paymentTransactionPublicId) {
      throw new Error(
        "A payment transaction identifier is required before confirmation.",
      );
    }

    return paymentTransactionPublicId;
  }

  // ---------------------------------------------------------------------------
  // Step 1 — Create Booking
  // ---------------------------------------------------------------------------

  async function createBooking(): Promise<void> {
    validateSeats();

    const result =
      await createBookingMutation.mutateAsync({
        journeyPublicId: journey.publicId,
        seats,
      });

    if (
      !result ||
      typeof result.publicId !== "string" ||
      result.publicId.trim().length === 0
    ) {
      throw new Error(
        "Booking creation succeeded but did not return a booking public ID.",
      );
    }

    setJourneyBookingPublicId(
      result.publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Step 2 — Create Snapshot
  // ---------------------------------------------------------------------------

  async function createSnapshot(): Promise<void> {
    const bookingPublicId =
      requireBookingPublicId();

    if (!snapshotAccepted) {
      throw new Error(
        "Accept the Journey details before continuing.",
      );
    }

    await createSnapshotMutation.mutateAsync({
      journeyBookingPublicId: bookingPublicId,
      request: {
        originName: journey.originName,
        destinationName:
          journey.destinationName,

        originCoordinates: {
          latitude:
            journey.originCoordinates.latitude,
          longitude:
            journey.originCoordinates.longitude,
        },

        destinationCoordinates: {
          latitude:
            journey.destinationCoordinates.latitude,
          longitude:
            journey.destinationCoordinates.longitude,
        },

        departureAt: journey.departureAt,

        arrivalAt:
          journey.arrivalAt ?? undefined,

        timezone: journey.timezone,

        vehicleMake:
          journey.vehicleMake ?? undefined,

        vehicleModel:
          journey.vehicleModel ?? undefined,

        vehicleYear:
          journey.vehicleYear ?? undefined,

        vehicleColor:
          journey.vehicleColor ?? undefined,

        vehicleRegistration:
          journey.vehicleRegistration ??
          undefined,
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Step 3 — Set Pricing
  // ---------------------------------------------------------------------------

  async function setPricing(): Promise<void> {
    const bookingPublicId =
      requireBookingPublicId();

    await setPricingMutation.mutateAsync({
      journeyBookingPublicId: bookingPublicId,
      request: {
        pricePerSeat:
          journey.pricePerSeat,
        seats,
        subtotal: totalAmount,
        totalAmount,
        currency: journey.currency,
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Step 4 — Create Payment Record
  // ---------------------------------------------------------------------------

  async function createPayment(): Promise<void> {
    const bookingPublicId =
      requireBookingPublicId();

    /**
     * Payment creation is intentionally idempotent at the form level.
     *
     * If the payment transaction has already been created, do not create
     * another payment record. The existing transaction remains the payment
     * transaction used by the final atomic confirmation.
     */
    if (paymentTransactionPublicId) {
      setCurrentStep("review");
      return;
    }

    const result =
      await createPaymentMutation.mutateAsync({
        journeyBookingPublicId: bookingPublicId,
        request: {
          status: "PENDING",
          amount: totalAmount,
          currency: journey.currency,
        },
      });

    /**
     * The Journey Booking payment model exposes the cross-domain transaction
     * reference through:
     *
     *   result.payment.transactionPublicId
     *
     * The frontend does not generate this identifier.
     */
    const transactionPublicId =
      result?.payment?.transactionPublicId?.trim();

    if (!transactionPublicId) {
      throw new Error(
        "Payment creation succeeded but did not return a transaction public ID.",
      );
    }

    setPaymentTransactionPublicId(
      transactionPublicId,
    );

    /**
     * Payment creation is complete.
     *
     * Payment authorization is intentionally NOT performed here.
     *
     * The final confirmation endpoint now performs authorization and booking
     * confirmation atomically, preventing a successful payment hold from
     * surviving a later capacity failure.
     */
    setCurrentStep("review");
  }

  // ---------------------------------------------------------------------------
  // Wallet
  // ---------------------------------------------------------------------------

  function handleGoToWallet(): void {
    router.push(
      AUTHENTICATED_ROUTES.WALLET_TOP_UP,
    );
  }

  // ---------------------------------------------------------------------------
  // Step 5 — Atomic Confirm
  // ---------------------------------------------------------------------------

  async function confirmBooking(): Promise<void> {
    const bookingPublicId =
      requireBookingPublicId();

    const transactionPublicId =
      requirePaymentTransactionPublicId();

    if (!reviewAccepted) {
      throw new Error(
        "Confirm that the booking details are correct before continuing.",
      );
    }

    setError(null);

    await confirmBookingMutation.mutateAsync({
      journeyBookingPublicId: bookingPublicId,
      request: {
        transactionPublicId,
      },
    });

    /**
     * The backend has now completed the complete atomic operation:
     *
     * - financial authorization;
     * - financial hold;
     * - financial transaction;
     * - booking payment authorization;
     * - booking confirmation;
     * - journey capacity reservation.
     *
     * If any of those operations failed, the backend transaction would have
     * rolled back and this callback would not be reached.
     */
    onConfirmed(bookingPublicId);
  }

  // ---------------------------------------------------------------------------
  // Step persistence
  // ---------------------------------------------------------------------------

  async function persistCurrentStep(): Promise<void> {
    switch (currentStep) {
      case "seats":
        await createBooking();
        return;

      case "snapshot":
        await createSnapshot();
        return;

      case "pricing":
        await setPricing();
        return;

      case "payment":
        await createPayment();
        return;

      case "review":
        await confirmBooking();
        return;

      default:
        return;
    }
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  async function handleNext(): Promise<void> {
    if (isSubmitting) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await persistCurrentStep();

      /**
       * Payment creation moves directly to Review.
       *
       * This is intentional because payment authorization now belongs to the
       * atomic confirmation transaction rather than a separate API call.
       */
      if (currentStep === "payment") {
        return;
      }

      if (isLastStep) {
        return;
      }

      const nextStep =
        JOURNEY_BOOKING_STEPS[
          currentStepIndex + 1
        ];

      if (nextStep) {
        setCurrentStep(nextStep.id);
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to continue with the booking.",
            ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack(): void {
    if (
      isSubmitting ||
      confirmBookingMutation.isPending ||
      isFirstStep
    ) {
      return;
    }

    setError(null);

    const previousStep =
      JOURNEY_BOOKING_STEPS[
        currentStepIndex - 1
      ];

    if (previousStep) {
      setCurrentStep(previousStep.id);
    }
  }

  // ---------------------------------------------------------------------------
  // Step values
  // ---------------------------------------------------------------------------

  const snapshotValues:
    JourneyBookingSnapshotValues = {
    originName: journey.originName,
    destinationName:
      journey.destinationName,
    departureAt: journey.departureAt,
    arrivalAt: journey.arrivalAt,
    timezone: journey.timezone,
    vehicleMake: journey.vehicleMake,
    vehicleModel: journey.vehicleModel,
    vehicleYear: journey.vehicleYear,
    vehicleColor: journey.vehicleColor,
    vehicleRegistration:
      journey.vehicleRegistration,
  };

  const pricingValues:
    JourneyBookingPricingValues = {
    pricePerSeat:
      journey.pricePerSeat,
    seats,
    subtotal: totalAmount,
    totalAmount,
    currency: journey.currency,
  };

  const paymentValues:
    JourneyBookingPaymentValues = {
    amount: totalAmount,
    currency: journey.currency,
    status: "PENDING",
  };

  const reviewValues:
    JourneyBookingReviewValues = {
    journeyBookingPublicId:
      journeyBookingPublicId ?? "",

    journeyPublicId:
      journey.publicId,

    seats,

    originName:
      journey.originName,

    destinationName:
      journey.destinationName,

    departureAt:
      journey.departureAt,

    arrivalAt:
      journey.arrivalAt,

    timezone:
      journey.timezone,

    vehicleMake:
      journey.vehicleMake,

    vehicleModel:
      journey.vehicleModel,

    vehicleColor:
      journey.vehicleColor,

    vehicleRegistration:
      journey.vehicleRegistration,

    pricePerSeat:
      journey.pricePerSeat,

    subtotal:
      totalAmount,

    totalAmount,

    currency:
      journey.currency,
  };

  // ---------------------------------------------------------------------------
  // Current step
  // ---------------------------------------------------------------------------

  function renderCurrentStep() {
    switch (currentStep) {
      case "seats":
        return (
          <JourneyBookingSeats
            seats={seats}
            availableSeats={
              journey.availableSeats
            }
            pricePerSeat={
              journey.pricePerSeat
            }
            currency={
              journey.currency
            }
            isAvailable={
              journey.availableSeats > 0
            }
            disabled={isSubmitting}
            error={error}
            onSeatsChange={
              setSeats
            }
          />
        );

      case "snapshot":
        return (
          <JourneyBookingSnapshot
            values={snapshotValues}
            accepted={
              snapshotAccepted
            }
            onAcceptedChange={
              setSnapshotAccepted
            }
            disabled={
              isSubmitting
            }
          />
        );

      case "pricing":
        return (
          <JourneyBookingPricing
            values={pricingValues}
            disabled={
              isSubmitting
            }
          />
        );

      case "payment":
        return (
          <JourneyBookingPayment
            values={paymentValues}
            disabled={
              isSubmitting
            }
          />
        );

      case "review":
        return (
          <JourneyBookingReview
            values={reviewValues}
            accepted={
              reviewAccepted
            }
            onAcceptedChange={
              setReviewAccepted
            }
            disabled={
              isSubmitting ||
              confirmBookingMutation.isPending
            }
          />
        );

      default:
        return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-4rem)]",
        "bg-[var(--background-brand)]",
        "px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}

        <header className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] text-[var(--brand-foreground)] shadow-[var(--shadow-sm)]">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="size-4"
                aria-hidden="true"
              >
                <path
                  d="M4 15.5V5.75C4 4.784 4.784 4 5.75 4h8.5C15.216 4 16 4.784 16 5.75v9.75"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                <path
                  d="M3 15.5h14M6.5 12.5h2M11.5 12.5h2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
              Journey booking
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Book this journey
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-[var(--foreground-secondary)] sm:text-base">
            Choose your seats, review the journey
            and complete your booking.
          </p>
        </header>

        {/* Progress */}

        <div className="mb-6 rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
          <JourneyBookingProgress
            isStarted={true}
            currentStep={currentStep}
          />
        </div>

        {/* Error */}

        {error !== null && (
          <div className="mb-6">
            <ErrorState
              title="We couldn't continue your booking"
              description={
                error.message
              }
              retryAction={{
                label: "Try again",
                onClick:
                  handleNext,
                disabled:
                  isSubmitting ||
                  confirmBookingMutation.isPending,
              }}
            />

            {hasInsufficientFundsError && (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={
                    handleGoToWallet
                  }
                  disabled={
                    isSubmitting ||
                    confirmBookingMutation.isPending
                  }
                  className={cn(
                    "inline-flex",
                    "min-h-10",
                    "items-center",
                    "justify-center",
                    "rounded-[var(--radius-md)]",
                    "bg-[var(--brand)]",
                    "px-4",
                    "py-2",
                    "text-sm",
                    "font-semibold",
                    "text-[var(--brand-foreground)]",
                    "transition-colors",
                    "hover:bg-[var(--brand-hover)]",
                    "focus-visible:outline-2",
                    "focus-visible:outline-[var(--brand)]",
                    "focus-visible:outline-offset-2",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-60",
                  )}
                >
                  Go to Wallet
                </button>
              </div>
            )}
          </div>
        )}

        {/* Form */}

        <section
          aria-label="Journey Booking form"
          className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)]"
        >
          <div
            aria-hidden="true"
            className="h-1 bg-[var(--brand)]"
          />

          <div className="p-5 sm:p-8 lg:p-10">
            {renderCurrentStep()}
          </div>

          {/* Actions */}

          <div className="border-t border-[var(--border-subtle)] bg-[var(--background-subtle)] px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {isFirstStep ? (
                  onCancel ? (
                    <button
                      type="button"
                      onClick={
                        onCancel
                      }
                      disabled={
                        isSubmitting ||
                        confirmBookingMutation.isPending
                      }
                      className="inline-flex items-center justify-center rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--background-muted)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  ) : null
                ) : (
                  <button
                    type="button"
                    onClick={
                      handleBack
                    }
                    disabled={
                      isSubmitting ||
                      confirmBookingMutation.isPending
                    }
                    className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--background-muted)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Back
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  void handleNext();
                }}
                disabled={
                  isSubmitting ||
                  confirmBookingMutation.isPending ||
                  (
                    currentStep ===
                      "seats" &&
                    (
                      !journey.availableSeats ||
                      seats >
                        journey.availableSeats
                    )
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-[var(--brand-foreground)] shadow-[var(--shadow-sm)] transition-colors hover:bg-[var(--brand-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Processing…"
                  : isLastStep
                    ? "Confirm booking"
                    : "Continue"}

                {!isSubmitting && (
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 10h11M11 6l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Reassurance */}

        <div className="mt-5 flex items-center justify-center gap-2 text-center">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="size-4 text-[var(--foreground-subtle)]"
            aria-hidden="true"
          >
            <path
              d="M10 2.75 16 5v4.5c0 3.5-2.15 6.35-6 7.75-3.85-1.4-6-4.25-6-7.75V5l6-2.25Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            <path
              d="m7.5 10 1.7 1.7 3.3-3.4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="text-xs text-[var(--foreground-muted)]">
            Your booking is managed by the sisiMove Journey
            Booking system.
          </p>
        </div>
      </div>
    </div>
  );
}

export default JourneyBookingForm;
