// -----------------------------------------------------------------------------
// sisiMove — Journey Creation
// Creation Progress
// -----------------------------------------------------------------------------
//
// Compact progress indicator for the authenticated Journey creation workflow.
//
// Creation sequence:
// 1. Route
// 2. Schedule
// 3. Vehicle
// 4. Seats
// 5. Pricing
// 6. Preferences
// 7. Photos
// 8. Review
//
// Responsibilities:
// - Communicate the user's current position in the creation workflow.
// - Show completed, current, and upcoming steps.
// - Provide accessible progress semantics.
// - Remain presentation-only.
//
// Architectural boundaries:
// - Does NOT create or mutate a Journey.
// - Does NOT persist creation state.
// - Does NOT perform navigation.
// - Does NOT inspect Journey lifecycle state.
// - Does NOT call APIs.
//
// The parent creation shell owns navigation and workflow state.
//
// Design boundaries:
// - Mobile-first.
// - Compact.
// - Uses only frozen sisiMove design tokens.
// - No gradients.
// - No new colors.
// - No component-specific design tokens.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';


// -----------------------------------------------------------------------------
// Creation steps
// -----------------------------------------------------------------------------

export const JOURNEY_CREATION_STEPS = [
  {
    key: 'route',
    label: 'Route',
  },
  {
    key: 'schedule',
    label: 'Schedule',
  },
  {
    key: 'vehicle',
    label: 'Vehicle',
  },
  {
    key: 'seats',
    label: 'Seats',
  },
  {
    key: 'pricing',
    label: 'Pricing',
  },
  {
    key: 'preferences',
    label: 'Preferences',
  },
  {
    key: 'photos',
    label: 'Photos',
  },
  {
    key: 'review',
    label: 'Review',
  },
] as const;

export type JourneyCreationStep =
  (typeof JOURNEY_CREATION_STEPS)[number]['key'];


// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCreationProgressProps {
  /**
   * Currently active creation step.
   */
  currentStep: JourneyCreationStep;

  /**
   * Optional set of completed steps.
   *
   * A Set is accepted so the parent workflow can derive completion state from
   * its own persisted or local creation state without this component making
   * assumptions about workflow persistence.
   */
  completedSteps?: ReadonlySet<JourneyCreationStep>;

  /**
   * Optional additional classes.
   */
  className?: string;

  /**
   * Optional accessible label.
   */
  ariaLabel?: string;
}


// -----------------------------------------------------------------------------
// Step indicator
// -----------------------------------------------------------------------------

function StepIndicator({
  index,
  state,
}: {
  index: number;
  state: 'completed' | 'current' | 'upcoming';
}) {
  const baseClasses = [
    'flex',
    'h-7',
    'w-7',
    'shrink-0',
    'items-center',
    'justify-center',
    'rounded-full',
    'text-xs',
    'font-semibold',
    'transition-colors',
    'duration-150',
    'ease-out',
  ];

  if (state === 'completed') {
    return (
      <span
        className={[
          ...baseClasses,
          'bg-[var(--brand)]',
          'text-[var(--brand-foreground)]',
        ].join(' ')}
        aria-hidden="true"
      >
        <CheckIcon />
      </span>
    );
  }

  if (state === 'current') {
    return (
      <span
        className={[
          ...baseClasses,
          'border-2',
          'border-[var(--brand)]',
          'bg-[var(--brand-soft)]',
          'text-[var(--brand)]',
        ].join(' ')}
        aria-hidden="true"
      >
        {index + 1}
      </span>
    );
  }

  return (
    <span
      className={[
        ...baseClasses,
        'border',
        'border-[var(--border)]',
        'bg-[var(--background-subtle)]',
        'text-[var(--foreground-muted)]',
      ].join(' ')}
      aria-hidden="true"
    >
      {index + 1}
    </span>
  );
}


// -----------------------------------------------------------------------------
// Connector
// -----------------------------------------------------------------------------

function StepConnector({
  completed,
}: {
  completed: boolean;
}) {
  return (
    <span
      className={[
        'hidden',
        'h-px',
        'min-w-3',
        'flex-1',
        'sm:block',
        completed
          ? 'bg-[var(--brand)]'
          : 'bg-[var(--border)]',
      ].join(' ')}
      aria-hidden="true"
    />
  );
}


// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="m3.5 8 3 3 6-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


// -----------------------------------------------------------------------------
// Screen-reader progress description
// -----------------------------------------------------------------------------

function ProgressDescription({
  currentIndex,
}: {
  currentIndex: number;
}) {
  const total =
    JOURNEY_CREATION_STEPS.length;

  const current =
    JOURNEY_CREATION_STEPS[currentIndex];

  if (!current) {
    return null;
  }

  return (
    <span className="sr-only">
      Step {currentIndex + 1} of {total}:{' '}
      {current.label}.
    </span>
  );
}


// -----------------------------------------------------------------------------
// Journey Creation Progress
// -----------------------------------------------------------------------------

export function JourneyCreationProgress({
  currentStep,
  completedSteps,
  className,
  ariaLabel = 'Journey creation progress',
}: JourneyCreationProgressProps) {
  const currentIndex =
    JOURNEY_CREATION_STEPS.findIndex(
      (step) => step.key === currentStep,
    );

  /**
   * A missing current step is a programming/configuration error rather than
   * something the presentation layer should silently reinterpret.
   *
   * Keeping the fallback at the beginning makes the component resilient in
   * production while preserving deterministic rendering.
   */
  const safeCurrentIndex =
    currentIndex >= 0
      ? currentIndex
      : 0;

  const completed =
    completedSteps ?? new Set<JourneyCreationStep>();

  return (
    <nav
      aria-label={ariaLabel}
      className={[
        'w-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <ProgressDescription
        currentIndex={safeCurrentIndex}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Desktop / tablet step sequence                                      */}
      {/* ------------------------------------------------------------------- */}

      <ol className="hidden items-center gap-2 sm:flex">
        {JOURNEY_CREATION_STEPS.map(
          (step, index) => {
            const isCurrent =
              index === safeCurrentIndex;

            const isCompleted =
              completed.has(step.key) ||
              index < safeCurrentIndex;

            const state =
              isCurrent
                ? 'current'
                : isCompleted
                  ? 'completed'
                  : 'upcoming';

            return (
              <li
                key={step.key}
                className="flex min-w-0 flex-1 items-center gap-2"
                aria-current={
                  isCurrent
                    ? 'step'
                    : undefined
                }
              >
                <StepIndicator
                  index={index}
                  state={state}
                />

                <span
                  className={[
                    'min-w-0 truncate text-xs font-medium',
                    isCurrent
                      ? 'text-[var(--foreground)]'
                      : isCompleted
                        ? 'text-[var(--foreground-secondary)]'
                        : 'text-[var(--foreground-muted)]',
                  ].join(' ')}
                >
                  {step.label}
                </span>

                {index <
                  JOURNEY_CREATION_STEPS.length -
                    1 && (
                  <StepConnector
                    completed={
                      isCompleted
                    }
                  />
                )}
              </li>
            );
          },
        )}
      </ol>

      {/* ------------------------------------------------------------------- */}
      {/* Mobile progress                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <StepIndicator
              index={safeCurrentIndex}
              state="current"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                {
                  JOURNEY_CREATION_STEPS[
                    safeCurrentIndex
                  ]?.label
                }
              </p>

              <p className="text-xs text-[var(--foreground-muted)]">
                Step {safeCurrentIndex + 1} of{' '}
                {JOURNEY_CREATION_STEPS.length}
              </p>
            </div>
          </div>

          <span className="shrink-0 text-xs font-medium text-[var(--foreground-muted)]">
            {Math.round(
              ((safeCurrentIndex + 1) /
                JOURNEY_CREATION_STEPS.length) *
                100,
            )}
            %
          </span>
        </div>

        <div
          className="mt-3 h-1.5 overflow-hidden rounded-[var(--radius-full)] bg-[var(--background-muted)]"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={
            JOURNEY_CREATION_STEPS.length
          }
          aria-valuenow={
            safeCurrentIndex + 1
          }
          aria-valuetext={`Step ${
            safeCurrentIndex + 1
          } of ${
            JOURNEY_CREATION_STEPS.length
          }: ${
            JOURNEY_CREATION_STEPS[
              safeCurrentIndex
            ]?.label
          }`}
        >
          <span
            className="block h-full rounded-[var(--radius-full)] bg-[var(--brand)] transition-[width] duration-200 ease-out"
            style={{
              width: `${
                ((safeCurrentIndex + 1) /
                  JOURNEY_CREATION_STEPS.length) *
                100
              }%`,
            }}
          />
        </div>
      </div>
    </nav>
  );
}