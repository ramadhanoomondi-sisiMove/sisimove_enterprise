// src/features/journey-booking/components/create/journey-booking-progress.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Progress
// -----------------------------------------------------------------------------
//
// Progress indicator for the Journey Booking creation workflow.
//
// Booking lifecycle:
//
// 1. Seats
// 2. Snapshot
// 3. Pricing
// 4. Payment
// 5. Review
//
// This component is presentation-only. It does not perform API calls,
// validation, or booking state transitions.
// -----------------------------------------------------------------------------

"use client";

import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Step Definition
// -----------------------------------------------------------------------------

export const JOURNEY_BOOKING_STEPS = [
  {
    id: "seats",
    label: "Seats",
    description: "Choose seats",
  },
  {
    id: "snapshot",
    label: "Journey",
    description: "Review journey",
  },
  {
    id: "pricing",
    label: "Pricing",
    description: "Review price",
  },
  {
    id: "payment",
    label: "Payment",
    description: "Payment",
  },
  {
    id: "review",
    label: "Review",
    description: "Confirm booking",
  },
] as const;

export type JourneyBookingStepId =
  (typeof JOURNEY_BOOKING_STEPS)[number]["id"];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyBookingProgressProps {
  readonly currentStep?: JourneyBookingStepId;
  readonly isStarted?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBookingProgress({
  currentStep = "seats",
  isStarted = false,
}: JourneyBookingProgressProps) {
  const currentStepIndex = JOURNEY_BOOKING_STEPS.findIndex(
    (step) => step.id === currentStep,
  );

  return (
    <nav
      aria-label="Journey Booking progress"
      className="w-full"
    >
      <ol className="flex items-start justify-between gap-2">
        {JOURNEY_BOOKING_STEPS.map((step, index) => {
          const isCurrent =
            isStarted && step.id === currentStep;

          const isCompleted =
            isStarted &&
            currentStepIndex > index;

          const isUpcoming =
            !isStarted ||
            currentStepIndex < index;

          return (
            <li
              key={step.id}
              className="flex min-w-0 flex-1 items-start"
            >
              <div className="flex min-w-0 flex-1 items-start">
                <div className="flex min-w-0 flex-col items-center">
                  <div
                    aria-current={
                      isCurrent ? "step" : undefined
                    }
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center",
                      "rounded-full border text-sm font-semibold",
                      "transition-colors",
                      isCurrent &&
                        "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-foreground)] shadow-[var(--shadow-sm)]",
                      isCompleted &&
                        "border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]",
                      isUpcoming &&
                        "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground-muted)]",
                    )}
                  >
                    {isCompleted ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="size-4"
                        aria-hidden="true"
                      >
                        <path
                          d="m5 10 3.25 3.25L15 6.5"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div className="mt-2 min-w-0 text-center">
                    <p
                      className={cn(
                        "truncate text-xs font-semibold",
                        isCurrent &&
                          "text-[var(--foreground)]",
                        isCompleted &&
                          "text-[var(--foreground-secondary)]",
                        isUpcoming &&
                          "text-[var(--foreground-muted)]",
                      )}
                    >
                      {step.label}
                    </p>

                    <p className="mt-0.5 hidden text-[11px] text-[var(--foreground-subtle)] sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>

                {index <
                  JOURNEY_BOOKING_STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className={cn(
                      "mt-4 mx-2 h-px flex-1",
                      isStarted &&
                        currentStepIndex > index
                        ? "bg-[var(--success)]"
                        : "bg-[var(--border)]",
                    )}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}