
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Participant
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Present one boarding participant.
// - Show the participant's shared profile and trust summary.
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

import type {
  JourneyBoardingParticipant as JourneyBoardingParticipantModel,
} from '@/features/journey-boarding/models';

import {
  JourneyBoardingParticipantStatusBadge,
} from './journey-boarding-participant-status';

import {
  JourneyBoardingParticipantSummary,
} from '../shared/journey-boarding-participant-summary';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBoardingParticipantProps {
  /**
   * Public identifier of the Journey Boarding record.
   */
  journeyBoardingPublicId: string;

  /**
   * Passenger participant to present.
   */
  participant: JourneyBoardingParticipantModel;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingParticipant({
  journeyBoardingPublicId,
  participant,
}: JourneyBoardingParticipantProps) {
  const normalizedBoardingPublicId = journeyBoardingPublicId.trim();

  const participantIdentityPublicId =
    participant.memberPublicId?.trim() ?? '';

  return (
    <article className="space-y-4">
      {/* ----------------------------------------------------------------- */}
      {/* Passenger Profile Summary                                         */}
      {/* ----------------------------------------------------------------- */}

      {normalizedBoardingPublicId &&
      participantIdentityPublicId ? (
        <JourneyBoardingParticipantSummary
          journeyBoardingPublicId={normalizedBoardingPublicId}
          participantIdentityPublicId={participantIdentityPublicId}
        />
      ) : (
        <p className="text-sm text-[var(--foreground-secondary)]">
          Passenger profile is unavailable.
        </p>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Boarding Participant Status                                       */}
      {/* ----------------------------------------------------------------- */}

      <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--foreground)]">
            Boarding status
          </p>

          <p className="mt-1 truncate text-xs text-[var(--foreground-muted)]">
            Passenger reference: {participant.publicId}
          </p>
        </div>

        <JourneyBoardingParticipantStatusBadge
          status={participant.status}
        />
      </div>
    </article>
  );
}
