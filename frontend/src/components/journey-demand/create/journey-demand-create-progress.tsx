// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Configuration Progress
// -----------------------------------------------------------------------------
//
// Presentational progress indicator for Journey Demand configuration.
//
// Workflow:
//
//   1. User chooses "Create Journey Demand"
//   2. Creation form starts
//   3. Journey Demand aggregate is created
//   4. journeyDemandPublicId is established
//   5. Journey Demand configuration begins
//      ├── Where
//      ├── When
//      ├── Seats
//      └── Price
//   6. Configuration is completed
//   7. Navigate to Edit
//   8. Publish
//
// This component represents step 5 of the overall workflow.
//
// Architecture:
// - Owns no server state.
// - Performs no API requests.
// - Performs no authorization checks.
// - Performs no validation.
// - Does not determine whether a step is complete.
// - Does not navigate between steps.
// - Does not create the Journey Demand aggregate.
// - Does not establish journeyDemandPublicId.
// - Parent create form owns the active step and workflow state.
//
// The component receives the current configuration step from the parent and
// presents the fixed configuration sequence:
//
// 1. Where
// 2. When
// 3. Seats
// 4. Price
//
// Step completion is represented only from the parent's supplied currentStep.
// The component does not infer completion from form values.
// -----------------------------------------------------------------------------

import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Configuration steps
// -----------------------------------------------------------------------------

export const JOURNEY_DEMAND_CREATE_STEPS = [
  {
    id: 'where',
    label: 'Where',
  },
  {
    id: 'when',
    label: 'When',
  },
  {
    id: 'seats',
    label: 'Seats',
  },
  {
    id: 'price',
    label: 'Price',
  },
] as const;

export type JourneyDemandCreateStep =
  (typeof JOURNEY_DEMAND_CREATE_STEPS)[number]['id'];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandCreateProgressProps {
  /**
   * Current Journey Demand configuration step.
   */
  readonly currentStep: JourneyDemandCreateStep;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCreateProgress({
  currentStep,
  className,
}: JourneyDemandCreateProgressProps) {
  const currentStepIndex = JOURNEY_DEMAND_CREATE_STEPS.findIndex(
    (step) => step.id === currentStep,
  );

  return (
    <nav
      className={cn(
        'min-w-0',
        className,
      )}
      aria-label="Journey Demand configuration progress"
    >
      <ol className="flex min-w-0 items-start">
        {JOURNEY_DEMAND_CREATE_STEPS.map((step, index) => {
          const isCurrent = step.id === currentStep;
          const isCompleted = index < currentStepIndex;
          const isLast =
            index === JOURNEY_DEMAND_CREATE_STEPS.length - 1;

          return (
            <li
              key={step.id}
              className={cn(
                'flex min-w-0 flex-1 items-start',
                !isLast && 'pr-2 sm:pr-4',
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col items-center">
                {/* ----------------------------------------------------------
                    Step indicator
                ---------------------------------------------------------- */}

                <div className="flex w-full items-center">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center',
                      'rounded-[var(--radius-full)]',
                      'border',
                      'text-xs font-semibold',
                      'transition-[background-color,border-color,color,box-shadow]',
                      'duration-200',

                      isCurrent &&
                        'border-[var(--brand)]',
                      isCurrent &&
                        'bg-[var(--brand)]',
                      isCurrent &&
                        'text-[var(--brand-foreground)]',
                      isCurrent &&
                        'shadow-[var(--shadow-sm)]',

                      isCompleted &&
                        'border-[var(--brand)]',
                      isCompleted &&
                        'bg-[var(--brand-soft)]',
                      isCompleted &&
                        'text-[var(--brand)]',

                      !isCurrent &&
                        !isCompleted &&
                        'border-[var(--border)]',
                      !isCurrent &&
                        !isCompleted &&
                        'bg-[var(--surface)]',
                      !isCurrent &&
                        !isCompleted &&
                        'text-[var(--foreground-muted)]',
                    )}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </span>

                  {/* --------------------------------------------------------
                      Connector
                  -------------------------------------------------------- */}

                  {!isLast ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        'mx-2 h-px min-w-2 flex-1 sm:mx-3',
                        'transition-colors duration-200',
                        index < currentStepIndex
                          ? 'bg-[var(--brand)]'
                          : 'bg-[var(--border)]',
                      )}
                    />
                  ) : null}
                </div>

                {/* ----------------------------------------------------------
                    Label
                ---------------------------------------------------------- */}

                <span
                  className={cn(
                    'mt-2 max-w-full truncate text-center text-xs',
                    'transition-colors duration-200',

                    isCurrent &&
                      'font-semibold',
                    isCurrent &&
                      'text-[var(--foreground)]',

                    isCompleted &&
                      'font-medium',
                    isCompleted &&
                      'text-[var(--brand)]',

                    !isCurrent &&
                      !isCompleted &&
                      'font-medium',
                    !isCurrent &&
                      !isCompleted &&
                      'text-[var(--foreground-muted)]',
                  )}
                >
                  {step.label}
                </span>

                {isCurrent ? (
                  <span className="sr-only">
                    Current configuration step
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}