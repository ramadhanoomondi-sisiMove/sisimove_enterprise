// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Summary
// -----------------------------------------------------------------------------
//
// Operational summary for the Journey Boarding experience.
//
// Responsibilities:
// - Present the current boarding lifecycle state.
// - Present the provider/passenger participation counts.
// - Present the boarding progress as compact operational metadata.
// - Keep the summary readable on mobile and desktop.
//
// Architectural rules:
// - No lifecycle transitions are performed here.
// - No authorization rules are implemented here.
// - The backend JourneyBoardingAggregate remains authoritative.
// - This component only derives display information from the supplied model.
// - Visual styling uses the frozen sisiMove design tokens.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import { JourneyBoardingStatusBadge } from '../boarding-status';

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

export interface JourneyBoardingSummaryProps {
  /**
   * Current Journey Boarding aggregate.
   */
  boarding: JourneyBoarding;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function countPassengers(boarding: JourneyBoarding): number {
  return boarding.participants.filter(
    (participant) =>
      participant.role === JourneyBoardingParticipantRole.PASSENGER,
  ).length;
}

function countBoardedPassengers(boarding: JourneyBoarding): number {
  return boarding.participants.filter(
    (participant) =>
      participant.role === JourneyBoardingParticipantRole.PASSENGER &&
      participant.status === JourneyBoardingParticipantStatus.BOARDED,
  ).length;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingSummary({
  boarding,
}: JourneyBoardingSummaryProps) {
  const passengerCount = countPassengers(boarding);
  const boardedPassengerCount = countBoardedPassengers(boarding);

  return (
    <section
      aria-labelledby="journey-boarding-summary-title"
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
          'flex-col',
          'gap-3',
          'sm:flex-row',
          'sm:items-center',
          'sm:justify-between',
        ].join(' ')}
      >
        <div className="min-w-0">
          <h2
            id="journey-boarding-summary-title"
            className={[
              'text-sm',
              'font-semibold',
              'text-[var(--foreground)]',
            ].join(' ')}
          >
            Boarding
          </h2>

          <p
            className={[
              'mt-1',
              'text-sm',
              'text-[var(--foreground-muted)]',
            ].join(' ')}
          >
            Current journey boarding status and participation.
          </p>
        </div>

        <JourneyBoardingStatusBadge
          status={boarding.status}
          size="sm"
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Operational Metrics                                                 */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={[
          'mt-5',
          'grid',
          'grid-cols-2',
          'gap-3',
          'sm:grid-cols-3',
        ].join(' ')}
      >
        <div
          className={[
            'rounded-[var(--radius-lg)]',
            'bg-[var(--background-subtle)]',
            'p-3',
          ].join(' ')}
        >
          <p
            className={[
              'text-xs',
              'font-medium',
              'text-[var(--foreground-muted)]',
            ].join(' ')}
          >
            Passengers
          </p>

          <p
            className={[
              'mt-1',
              'text-lg',
              'font-semibold',
              'leading-6',
              'text-[var(--foreground)]',
            ].join(' ')}
          >
            {passengerCount}
          </p>
        </div>

        <div
          className={[
            'rounded-[var(--radius-lg)]',
            'bg-[var(--background-subtle)]',
            'p-3',
          ].join(' ')}
        >
          <p
            className={[
              'text-xs',
              'font-medium',
              'text-[var(--foreground-muted)]',
            ].join(' ')}
          >
            Boarded
          </p>

          <p
            className={[
              'mt-1',
              'text-lg',
              'font-semibold',
              'leading-6',
              'text-[var(--foreground)]',
            ].join(' ')}
          >
            {boardedPassengerCount}
          </p>
        </div>

        <div
          className={[
            'col-span-2',
            'rounded-[var(--radius-lg)]',
            'bg-[var(--brand-soft)]',
            'p-3',
            'sm:col-span-1',
          ].join(' ')}
        >
          <p
            className={[
              'text-xs',
              'font-medium',
              'text-[var(--brand)]',
            ].join(' ')}
          >
            Boarding progress
          </p>

          <p
            className={[
              'mt-1',
              'text-lg',
              'font-semibold',
              'leading-6',
              'text-[var(--foreground)]',
            ].join(' ')}
          >
            {boardedPassengerCount} / {passengerCount} boarded
          </p>
        </div>
      </div>
    </section>
  );
}