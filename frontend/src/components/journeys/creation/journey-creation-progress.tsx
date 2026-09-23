// -----------------------------------------------------------------------------
// sisiMove — Journey Creation Progress
// -----------------------------------------------------------------------------
//
// Compact progress indicator for the multi-step journey creation flow.
//
// Creation steps:
//   1. Route
//   2. Schedule
//   3. Vehicle
//   4. Seats
//   5. Pricing
//   6. Preferences
//   7. Photos
//   8. Review
//
// Responsibilities:
// - Display the current creation step.
// - Display completed steps.
// - Communicate progress accessibly.
// - Remain presentation-only.
//
// Non-responsibilities:
// - No routing.
// - No navigation.
// - No API calls.
// - No form state.
// - No lifecycle/business logic.
//
// The parent route/container decides what "current" means.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface JourneyCreationStep {
  /**
   * Stable identifier for the creation step.
   */
  id: string;

  /**
   * Human-readable step label.
   */
  label: string;
}

export interface JourneyCreationProgressProps {
  /**
   * Ordered creation steps.
   */
  steps: readonly JourneyCreationStep[];

  /**
   * Zero-based index of the active step.
   */
  currentStep: number;

  /**
   * Optional content rendered alongside the progress indicator.
   */
  trailing?: ReactNode;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export function JourneyCreationProgress({
  steps,
  currentStep,
  trailing,
}: JourneyCreationProgressProps) {
  const totalSteps = steps.length;
  const safeCurrentStep =
    totalSteps > 0
      ? Math.min(Math.max(currentStep, 0), totalSteps - 1)
      : 0;

  const progressPercentage =
    totalSteps > 1
      ? (safeCurrentStep / (totalSteps - 1)) * 100
      : 100;

  const activeStep = steps[safeCurrentStep];

  return (
    <div
      aria-label="Journey creation progress"
      className="space-y-3"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Step {totalSteps === 0 ? 0 : safeCurrentStep + 1} of {totalSteps}
          </p>

          {activeStep ? (
            <p className="mt-0.5 truncate text-sm font-semibold text-[var(--foreground)]">
              {activeStep.label}
            </p>
          ) : null}
        </div>

        {trailing ? (
          <div className="shrink-0">
            {trailing}
          </div>
        ) : null}
      </div>

      <div
        aria-hidden="true"
        className="h-1.5 overflow-hidden rounded-full bg-[var(--background-muted)]"
      >
        <div
          className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-200"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <ol className="hidden items-center justify-between gap-2 sm:flex">
        {steps.map((step, index) => {
          const isCompleted = index < safeCurrentStep;
          const isCurrent = index === safeCurrentStep;

          return (
            <li
              key={step.id}
              className="min-w-0 flex-1"
            >
              <div className="flex items-center gap-2">
                <span
                  className={[
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                    'text-xs font-semibold',
                    isCompleted || isCurrent
                      ? 'bg-[var(--brand)] text-[var(--brand-foreground)]'
                      : 'bg-[var(--background-muted)] text-[var(--foreground-muted)]',
                  ].join(' ')}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>

                <span
                  className={[
                    'truncate text-xs',
                    isCurrent
                      ? 'font-semibold text-[var(--foreground)]'
                      : isCompleted
                        ? 'font-medium text-[var(--foreground-secondary)]'
                        : 'text-[var(--foreground-muted)]',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}