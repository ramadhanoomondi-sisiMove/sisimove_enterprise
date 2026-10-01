// -----------------------------------------------------------------------------
// sisiMove — Journey Create Progress
// -----------------------------------------------------------------------------
//
// Premium progress indicator for the Journey creation workflow.
//
// Lifecycle:
//
//   Start journey creation
//          |
//          v
//   Where → When → Vehicle → Seats → Price → Preferences
//          |
//          v
//       Journey remains DRAFT
//
// State ownership:
//
//   JourneyCreateForm
//        │
//        └── currentStep
//                 │
//                 ▼
//        JourneyCreateProgress
//
// This component does NOT keep local workflow state.
//
// Therefore the progress position survives step navigation:
//
//   Where
//     ↓
//   When
//     ↓
//   Vehicle
//     ↓
//   Back
//     ↓
//   When
//
// The parent still owns "when" the workflow changes. This component only
// reflects that state.
//
// Important:
// - "Start journey creation" is the workflow entry point.
// - Starting creation creates the Journey aggregate.
// - The creation steps then progressively configure that existing draft.
// - Vehicle includes the vehicle photo Asset upload.
// - There is NO separate Assets creation step.
// - This component does NOT create the Journey.
// - This component does NOT call APIs.
// - This component does NOT manage workflow state.
// - This component only presents workflow progress.
//
// Responsibilities:
// - Present the current Journey creation step.
// - Present the not-yet-started creation state.
// - Show completed, current, and upcoming steps.
// - Provide accessible progress information.
// - Remain purely presentational.
// -----------------------------------------------------------------------------

import { cn } from "@/foundation/utils/cn";

// =============================================================================
// Step Definition
// =============================================================================

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
] as const;

export type JourneyCreateStepId =
  (typeof JOURNEY_CREATE_STEPS)[number]["id"];

// =============================================================================
// Props
// =============================================================================

export interface JourneyCreateProgressProps {
  /**
   * Whether Journey creation has been started.
   *
   * Before this becomes true, the Journey aggregate does not yet exist.
   */
  readonly isStarted: boolean;

  /**
   * Currently active creation step.
   *
   * The parent JourneyCreateForm owns this state.
   */
  readonly currentStep?: JourneyCreateStepId;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;
}

// =============================================================================
// Helpers
// =============================================================================

function getCurrentStepIndex(
  isStarted: boolean,
  currentStep: JourneyCreateStepId | undefined,
): number {
  if (!isStarted) {
    return -1;
  }

  if (currentStep === undefined) {
    return 0;
  }

  const index =
    JOURNEY_CREATE_STEPS.findIndex(
      (step) => step.id === currentStep,
    );

  return index >= 0 ? index : 0;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyCreateProgress({
  isStarted,
  currentStep,
  className,
}: JourneyCreateProgressProps) {
  const totalSteps =
    JOURNEY_CREATE_STEPS.length;

  const currentStepIndex =
    getCurrentStepIndex(
      isStarted,
      currentStep,
    );

  const safeCurrentStepIndex =
    currentStepIndex >= 0
      ? currentStepIndex
      : 0;

  const currentStepDefinition =
    JOURNEY_CREATE_STEPS[
      safeCurrentStepIndex
    ];

  const currentStepNumber =
    safeCurrentStepIndex + 1;

  const progressPercentage =
    isStarted && totalSteps > 1
      ? (safeCurrentStepIndex /
          (totalSteps - 1)) *
        100
      : 0;

  // ===========================================================================
  // Not Started
  // ===========================================================================
  //
  // The Journey does not exist yet.
  //
  //   Not started
  //       ↓
  //   Start journey creation
  //       ↓
  //   Journey aggregate created
  //       ↓
  //   Where
  //
  // Therefore "Where" is not presented as an active persisted step before
  // creation has started.
  // ===========================================================================

  if (!isStarted) {
    return (
      <nav
        aria-label="Journey creation progress"
        className={cn(
          "w-full",
          className,
        )}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ----------------------------------------------------------------- */}

        <div className="mb-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
              Journey creation
            </p>

            <p className="truncate text-base font-semibold tracking-tight text-[var(--foreground)]">
              Ready to begin
            </p>
          </div>

          <div
            aria-label={`0 of ${totalSteps} steps completed`}
            className="shrink-0 rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--background-subtle)] px-3 py-1.5"
          >
            <span className="text-xs font-semibold tabular-nums text-[var(--foreground-secondary)]">
              <span className="text-[var(--foreground-subtle)]">
                0
              </span>

              <span className="mx-1 text-[var(--foreground-subtle)]">
                /
              </span>

              {totalSteps}
            </span>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Not-started Track                                                 */}
        {/* ----------------------------------------------------------------- */}

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-[var(--radius-full)] bg-[var(--background-muted)]"
          />

          <ol className="relative flex items-center justify-between">
            {JOURNEY_CREATE_STEPS.map(
              (step) => (
                <li
                  key={step.id}
                  className="relative flex items-center justify-center"
                >
                  <span className="sr-only">
                    {step.label} — upcoming
                  </span>

                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative flex size-8 items-center justify-center",
                      "rounded-full border-2",
                      "border-[var(--border-strong)]",
                      "bg-[var(--surface)]",
                      "text-[var(--foreground-subtle)]",
                    )}
                  >
                    <span className="size-2 rounded-full bg-[var(--border-strong)]" />
                  </span>
                </li>
              ),
            )}
          </ol>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Step Labels                                                       */}
        {/* ----------------------------------------------------------------- */}

        <ol className="mt-3 hidden items-start justify-between gap-2 sm:flex">
          {JOURNEY_CREATE_STEPS.map(
            (step) => (
              <li
                key={step.id}
                className="min-w-0 flex-1 text-center"
              >
                <span className="text-[0.6875rem] font-medium text-[var(--foreground-subtle)]">
                  {step.label}
                </span>
              </li>
            ),
          )}
        </ol>

        {/* ----------------------------------------------------------------- */}
        {/* Mobile Context                                                    */}
        {/* ----------------------------------------------------------------- */}

        <div className="mt-3 flex items-center justify-between sm:hidden">
          <p className="text-xs text-[var(--foreground-muted)]">
            Start when you&apos;re ready
          </p>

          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
            Ready to begin
          </p>
        </div>
      </nav>
    );
  }

  // ===========================================================================
  // Started
  // ===========================================================================

  return (
    <nav
      aria-label="Journey creation progress"
      className={cn(
        "w-full",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
            Create your journey
          </p>

          <p className="truncate text-base font-semibold tracking-tight text-[var(--foreground)]">
            {currentStepDefinition.label}
          </p>
        </div>

        <div
          aria-label={`Step ${currentStepNumber} of ${totalSteps}`}
          className="shrink-0 rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--background-subtle)] px-3 py-1.5"
        >
          <span className="text-xs font-semibold tabular-nums text-[var(--foreground-secondary)]">
            <span className="text-[var(--brand)]">
              {currentStepNumber}
            </span>

            <span className="mx-1 text-[var(--foreground-subtle)]">
              /
            </span>

            {totalSteps}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Progress Track                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div className="relative">
        {/* Background track */}

        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-[var(--radius-full)] bg-[var(--background-muted)]"
        />

        {/* Completed progress */}

        <div
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-[var(--radius-full)] bg-[var(--brand)] transition-[width] duration-500 ease-out"
          style={{
            width: `${progressPercentage}%`,
          }}
        />

        {/* Steps */}

        <ol className="relative flex items-center justify-between">
          {JOURNEY_CREATE_STEPS.map(
            (step, index) => {
              const isCompleted =
                index <
                safeCurrentStepIndex;

              const isCurrent =
                index ===
                safeCurrentStepIndex;

              const isUpcoming =
                index >
                safeCurrentStepIndex;

              return (
                <li
                  key={step.id}
                  className="relative flex items-center justify-center"
                  aria-current={
                    isCurrent
                      ? "step"
                      : undefined
                  }
                >
                  {/* Accessible description */}

                  <span className="sr-only">
                    {step.label}
                    {isCompleted
                      ? " — completed"
                      : isCurrent
                        ? " — current"
                        : " — upcoming"}
                  </span>

                  {/* Step marker */}

                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative flex size-8 items-center justify-center",
                      "rounded-full border-2",
                      "transition-all duration-300 ease-out",

                      isCompleted &&
                        "border-[var(--brand)]",

                      isCompleted &&
                        "bg-[var(--brand)]",

                      isCompleted &&
                        "text-[var(--brand-foreground)]",

                      isCompleted &&
                        "shadow-[var(--shadow-sm)]",

                      isCurrent &&
                        "border-[var(--brand)]",

                      isCurrent &&
                        "bg-[var(--surface)]",

                      isCurrent &&
                        "text-[var(--brand)]",

                      isCurrent &&
                        "shadow-[0_0_0_4px_var(--brand-soft)]",

                      isUpcoming &&
                        "border-[var(--border-strong)]",

                      isUpcoming &&
                        "bg-[var(--surface)]",

                      isUpcoming &&
                        "text-[var(--foreground-subtle)]",
                    )}
                  >
                    {isCompleted ? (
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="size-4"
                      >
                        <path
                          d="M3.25 8.25 6.5 11.5l6.25-7"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          isCurrent
                            ? "bg-[var(--brand)]"
                            : "bg-[var(--border-strong)]",
                        )}
                      />
                    )}
                  </span>
                </li>
              );
            },
          )}
        </ol>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Step Labels                                                         */}
      {/* ------------------------------------------------------------------- */}

      <ol className="mt-3 hidden items-start justify-between gap-2 sm:flex">
        {JOURNEY_CREATE_STEPS.map(
          (step, index) => {
            const isCompleted =
              index <
              safeCurrentStepIndex;

            const isCurrent =
              index ===
              safeCurrentStepIndex;

            return (
              <li
                key={step.id}
                className="min-w-0 flex-1 text-center"
              >
                <span
                  className={cn(
                    "text-[0.6875rem] font-medium transition-colors duration-200",

                    isCurrent &&
                      "font-semibold text-[var(--brand)]",

                    isCompleted &&
                      "text-[var(--foreground-secondary)]",

                    !isCompleted &&
                      !isCurrent &&
                      "text-[var(--foreground-subtle)]",
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          },
        )}
      </ol>

      {/* ------------------------------------------------------------------- */}
      {/* Mobile Step Context                                                 */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-3 flex items-center justify-between sm:hidden">
        <p className="text-xs text-[var(--foreground-muted)]">
          {safeCurrentStepIndex === 0
            ? "Let's get started"
            : safeCurrentStepIndex ===
                totalSteps - 1
              ? "Almost there"
              : `${totalSteps - currentStepNumber} ${
                  totalSteps -
                    currentStepNumber ===
                  1
                    ? "step"
                    : "steps"
                } remaining`}
        </p>

        <p className="text-xs font-medium text-[var(--foreground-secondary)]">
          {currentStepDefinition.label}
        </p>
      </div>
    </nav>
  );
}