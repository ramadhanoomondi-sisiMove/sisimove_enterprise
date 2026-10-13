
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
// - The shared participant summary retains ownership of its own Card.
// -----------------------------------------------------------------------------

import {
  Fingerprint,
  UserRound,
} from 'lucide-react';

import type {
  JourneyBoardingParticipant as JourneyBoardingParticipantModel,
} from '@/features/journey-boarding/models';

import { Badge } from '@/components/ui';

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
  /** Public identifier of the Journey Boarding record. */
  journeyBoardingPublicId: string;

  /** Passenger participant to present. */
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

  const identifiersAreValid =
    normalizedBoardingPublicId.length > 0 &&
    participantIdentityPublicId.length > 0;

  return (
    <article
      aria-label="Journey boarding participant"
      className="flex min-w-0 flex-col gap-4"
    >
      {/* Participant Heading */}

      <header className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] text-[var(--brand)]">
            <UserRound size={19} aria-hidden="true" />
          </span>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Passenger
            </h2>

            <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
              Participant profile and boarding details
            </p>
          </div>
        </div>

        <JourneyBoardingParticipantStatusBadge
          status={participant.status}
        />
      </header>

      {/* Shared Profile, Verification, Trust and Contact Summary */}

      {identifiersAreValid ? (
        <JourneyBoardingParticipantSummary
          journeyBoardingPublicId={normalizedBoardingPublicId}
          participantIdentityPublicId={participantIdentityPublicId}
        />
      ) : (
        <div
          role="status"
          className="flex min-w-0 items-start gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--background-subtle)] p-4"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface)] text-[var(--foreground-muted)]">
            <UserRound size={18} aria-hidden="true" />
          </span>

          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--foreground)]">
              Passenger profile unavailable
            </p>

            <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
              Valid boarding and participant identifiers are required to
              load this profile.
            </p>
          </div>
        </div>
      )}

      {/* Boarding Participant Reference */}

      <footer className="flex min-w-0 items-start gap-3 border-t border-[var(--border)] pt-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
          <Fingerprint size={17} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Participant reference
          </p>

          <p
            className="mt-1 break-all font-mono text-xs leading-5 text-[var(--foreground-secondary)]"
            title={participant.publicId}
          >
            {participant.publicId}
          </p>
        </div>

        <Badge variant="outline" size="sm">
          Boarding record
        </Badge>
      </footer>
    </article>
  );
}
