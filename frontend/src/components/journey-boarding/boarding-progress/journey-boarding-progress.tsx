// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Progress
// -----------------------------------------------------------------------------
//
// Visual progress indicator for Journey Boarding.
//
// Responsibilities:
// - Present passenger boarding progress.
// - Show boarded versus total passenger counts.
// - Provide an accessible textual representation of progress.
//
// Architectural rules:
// - No lifecycle/business rules are implemented here.
// - The backend aggregate remains authoritative.
// - This component only derives display information from participants.
// - Styling uses the frozen sisiMove design tokens.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Model
// -----------------------------------------------------------------------------

import {
  JourneyBoardingParticipantRole,
  JourneyBoardingParticipantStatus,
  type JourneyBoarding,
} from '@/features/journey-boarding/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBoardingProgressProps {
  /**
   * Current Journey Boarding aggregate.
   */
  boarding: JourneyBoarding;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingProgress({
  boarding,
}: JourneyBoardingProgressProps) {
  const passengers = boarding.participants.filter(
    (participant) =>
      participant.role === JourneyBoardingParticipantRole.PASSENGER,
  );

  const totalPassengers = passengers.length;

  const boardedPassengers = passengers.filter(
    (participant) =>
      participant.status === JourneyBoardingParticipantStatus.BOARDED,
  ).length;

  const progressPercentage =
    totalPassengers === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (boardedPassengers / totalPassengers) * 100,
          ),
        );

  return (
    <section
      aria-labelledby="journey-boarding-progress-title"
      className={[
        'surface',
        'p-4',
        'sm:p-5',
      ].join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={[
          'flex',
          'items-center',
          'justify-between',
          'gap-4',
        ].join(' ')}
      >
        <div className="min-w-0">
          <h2
            id="journey-boarding-progress-title"
            className={[
              'text-sm',
              'font-semibold',
              'text-[var(--foreground)]',
            ].join(' ')}
          >
            Boarding progress
          </h2>

          <p
            className={[
              'mt-1',
              'text-sm',
              'text-[var(--foreground-muted)]',
            ].join(' ')}
          >
            {boardedPassengers} of {totalPassengers} passengers boarded
          </p>
        </div>

        <span
          className={[
            'shrink-0',
            'text-sm',
            'font-semibold',
            'text-[var(--foreground)]',
          ].join(' ')}
        >
          {progressPercentage}%
        </span>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Progress Bar                                                        */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={[
          'mt-4',
          'h-2',
          'w-full',
          'overflow-hidden',
          'rounded-[var(--radius-full)]',
          'bg-[var(--background-muted)]',
        ].join(' ')}
        role="progressbar"
        aria-labelledby="journey-boarding-progress-title"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercentage}
      >
        <div
          className={[
            'h-full',
            'rounded-[var(--radius-full)]',
            'bg-[var(--brand)]',
            'transition-[width]',
            'duration-200',
          ].join(' ')}
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Empty State                                                         */}
      {/* ------------------------------------------------------------------- */}

      {totalPassengers === 0 && (
        <p
          className={[
            'mt-3',
            'text-xs',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
        >
          No passenger boarding records are currently available.
        </p>
      )}
    </section>
  );
}