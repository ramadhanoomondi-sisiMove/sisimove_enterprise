// -----------------------------------------------------------------------------
// sisiMove — Journey Create Progress
// -----------------------------------------------------------------------------
//
// Compact progress indicator for the Journey creation workflow.
//
// Responsibilities:
// - Present the current Journey creation step.
// - Show completed, current, and upcoming steps.
// - Provide accessible progress information.
//
// This component does NOT:
// - manage workflow state;
// - call APIs;
// - validate Journey data;
// - persist Journey state;
// - navigate between steps;
// - recreate Journey domain behavior.
//
// The parent JourneyCreateForm owns the workflow state and supplies the
// current step.
// -----------------------------------------------------------------------------

import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Step Definition
// -----------------------------------------------------------------------------

export const JOURNEY_CREATE_STEPS = [
  {
    id: "where",
    label: "Where",
  },
  {
    id: "when",
    label: "When",
  },
  {
    id: "vehicle",
    label: "Vehicle",
  },
  {
    id: "seats",
    label: "Seats",
  },
  {
    id: "price",
    label: "Price",
  },
  {
    id: "preferences",
    label: "Preferences",
  },
  {
    id: "assets",
    label: "Assets",
  },
] as const;

export type JourneyCreateStepId =
  (typeof JOURNEY_CREATE_STEPS)[number]["id"];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCreateProgressProps {
  /**
   * Currently active creation step.
   */
  readonly currentStep: JourneyCreateStepId;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCreateProgress({
  currentStep,
  className,
}: JourneyCreateProgressProps) {
  const currentStepIndex = JOURNEY_CREATE_STEPS.findIndex(
    (step) => step.id === currentStep,
  );

  const currentStepNumber = currentStepIndex + 1;
  const totalSteps = JOURNEY_CREATE_STEPS.length;

  return (
    <nav
      aria-label="Journey creation progress"
      className={cn("space-y-3", className)}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {JOURNEY_CREATE_STEPS[currentStepIndex]?.label}
        </p>

        <p className="shrink-0 text-xs text-[var(--foreground-muted)]">
          Step {currentStepNumber} of {totalSteps}
        </p>
      </div>

      <ol className="flex items-center gap-1.5">
        {JOURNEY_CREATE_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <li
              key={step.id}
              className="flex min-w-0 flex-1"
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="w-full">
                <span className="sr-only">
                  {step.label}
                  {isCompleted
                    ? " — completed"
                    : isCurrent
                      ? " — current"
                      : " — upcoming"}
                </span>

                <div
                  aria-hidden="true"
                  className={cn(
                    "h-1.5",
                    "w-full",
                    "rounded-[var(--radius-full)]",
                    isCompleted && "bg-[var(--brand)]",
                    isCurrent && "bg-[var(--brand)]",
                    !isCompleted &&
                      !isCurrent &&
                      "bg-[var(--background-muted)]",
                  )}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="hidden items-center justify-between gap-2 sm:flex">
        {JOURNEY_CREATE_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <span
              key={step.id}
              className={cn(
                "min-w-0 truncate text-xs",
                isCurrent && "font-medium text-[var(--foreground)]",
                isCompleted && "text-[var(--foreground-secondary)]",
                !isCompleted &&
                  !isCurrent &&
                  "text-[var(--foreground-subtle)]",
              )}
            >
              {step.label}
            </span>
          );
        })}
      </div>
    </nav>
  );
}