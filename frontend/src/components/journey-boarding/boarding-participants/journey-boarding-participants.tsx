// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Participant
// -----------------------------------------------------------------------------
//
// Individual participant presentation for the Journey Boarding experience.
//
// Responsibilities:
// - Present one boarding participant.
// - Show participant identity reference.
// - Show the participant's current boarding status.
// - Keep participant presentation separate from participant actions.
//
// Architectural rules:
// - No boarding lifecycle rules are implemented here.
// - The backend aggregate remains authoritative.
// - No participant mutation is performed here.
// - Actions are owned by the boarding-actions components.
// - Public identifiers remain opaque.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Model
// -----------------------------------------------------------------------------

import type { JourneyBoardingParticipant as JourneyBoardingParticipantModel } from '@/features/journey-boarding/models';

// -----------------------------------------------------------------------------
// Child Component
// -----------------------------------------------------------------------------

import { JourneyBoardingParticipantStatus } from './journey-boarding-participant-status';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBoardingParticipantProps {
  /**
   * Passenger participant to present.
   */
  participant: JourneyBoardingParticipantModel;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingParticipant({
  participant,
}: JourneyBoardingParticipantProps) {
  return (
    <article
      className={[
        'flex',
        'items-center',
        'gap-3',
        'py-4',
        'first:pt-0',
        'last:pb-0',
      ].join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Participant Avatar                                                  */}
      {/* ------------------------------------------------------------------- */}

      <div
        aria-hidden="true"
        className={[
          'flex',
          'h-10',
          'w-10',
          'shrink-0',
          'items-center',
          'justify-center',
          'rounded-[var(--radius-full)]',
          'bg-[var(--background-muted)]',
          'text-sm',
          'font-semibold',
          'text-[var(--foreground-secondary)]',
        ].join(' ')}
      >
        P
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Participant Identity                                                */}
      {/* ------------------------------------------------------------------- */}

      <div className="min-w-0 flex-1">
        <p
          className={[
            'truncate',
            'text-sm',
            'font-medium',
            'text-[var(--foreground)]',
          ].join(' ')}
        >
          Passenger
        </p>

        <p
          className={[
            'truncate',
            'text-xs',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
          title={participant.memberPublicId}
        >
          {participant.memberPublicId}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Participant Status                                                  */}
      {/* ------------------------------------------------------------------- */}

      <JourneyBoardingParticipantStatus
        status={participant.status}
      />
    </article>
  );
}