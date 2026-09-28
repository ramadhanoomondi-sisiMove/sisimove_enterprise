// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Create Progress
// -----------------------------------------------------------------------------
//
// Presentational progress indicator for the Journey Demand creation flow.
//
// Architecture:
// - Owns no server state.
// - Performs no API requests.
// - Performs no authorization checks.
// - Performs no validation.
// - Does not determine whether a step is complete.
// - Does not navigate between steps.
// - Parent create form owns the active step and workflow state.
//
// The component receives the current step from the parent and presents the
// fixed creation sequence:
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

export interface JourneyDemandCreateProgressProps {
  readonly currentStep: JourneyDemandCreateStep;
  readonly className?: string;
}

export function JourneyDemandCreateProgress({
  currentStep,
  className,
}: JourneyDemandCreateProgressProps) {
  const currentStepIndex = JOURNEY_DEMAND_CREATE_STEPS.findIndex(
    (step) => step.id === currentStep,
  );

  return (
    <nav
      className={cn('min-w-0', className)}
      aria-label="Journey Demand creation progress"
    >
      <ol className="flex min-w-0 items-start">
        {JOURNEY_DEMAND_CREATE_STEPS.map((step, index) => {
          const isCurrent = step.id === currentStep;
          const isCompleted = index < currentStepIndex;
          const isLast = index === JOURNEY_DEMAND_CREATE_STEPS.length - 1;

          return (
            <li
              key={step.id}
              className={cn(
                'flex min-w-0 flex-1 items-start',
                !isLast && 'pr-2 sm:pr-4',
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center',
                      'rounded-[var(--radius-full)]',
                      'border text-xs font-semibold',
                      'transition-colors',
                      isCurrent &&
                        'border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-foreground)]',
                      isCompleted &&
                        'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]',
                      !isCurrent &&
                        !isCompleted &&
                        'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-muted)]',
                    )}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </span>

                  {!isLast ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        'mx-2 h-px min-w-2 flex-1 sm:mx-3',
                        index < currentStepIndex
                          ? 'bg-[var(--brand)]'
                          : 'bg-[var(--border)]',
                      )}
                    />
                  ) : null}
                </div>

                <span
                  className={cn(
                    'mt-2 max-w-full truncate text-center text-xs',
                    isCurrent
                      ? 'font-semibold text-foreground'
                      : isCompleted
                        ? 'font-medium text-[var(--brand)]'
                        : 'text-foreground-muted',
                  )}
                >
                  {step.label}
                </span>

                {isCurrent ? (
                  <span className="sr-only">Current step</span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

