
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Participant Card
// -----------------------------------------------------------------------------

import {
  Badge,
  Card,
  Divider,
} from '@/components/ui';

import {
  JourneyBoardingParticipantRole,
  JourneyBoardingParticipantStatus,
  type JourneyBoardingParticipant,
} from '@/features/journey-boarding/models';

import { JourneyBoardingParticipantSummary } from '../shared/journey-boarding-participant-summary';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyParticipantCardProps {
  journeyBoardingPublicId: string;
  participant: JourneyBoardingParticipant;
  isCurrentPassenger?: boolean;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatTimestamp(
  value: string | undefined,
): string | undefined {
  if (!value) return undefined;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return undefined;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

// -----------------------------------------------------------------------------
// Status Presentation
// -----------------------------------------------------------------------------

type StatusPresentation = {
  label: string;
  variant: 'success' | 'warning' | 'danger' | 'default';
  description: string;
};

function getStatusPresentation(
  status: JourneyBoardingParticipantStatus | null | undefined,
): StatusPresentation {
  switch (status) {
    case JourneyBoardingParticipantStatus.EXPECTED:
      return {
        label: 'Expected',
        variant: 'warning',
        description: 'Awaiting boarding confirmation',
      };

    case JourneyBoardingParticipantStatus.BOARDED:
      return {
        label: 'Boarded',
        variant: 'success',
        description: 'Boarding confirmed',
      };

    case JourneyBoardingParticipantStatus.WITHDRAWN:
      return {
        label: 'Withdrawn',
        variant: 'default',
        description: 'Withdrew from boarding',
      };

    case JourneyBoardingParticipantStatus.NO_SHOW:
      return {
        label: 'No-show',
        variant: 'danger',
        description: 'Recorded as a no-show',
      };

    case JourneyBoardingParticipantStatus.REMOVED:
      return {
        label: 'Removed',
        variant: 'default',
        description: 'Removed from boarding',
      };

    default:
      return {
        label: 'Status unavailable',
        variant: 'default',
        description: 'The boarding status is currently unavailable',
      };
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyParticipantCard({
  journeyBoardingPublicId,
  participant,
  isCurrentPassenger = false,
}: JourneyParticipantCardProps) {
  const statusPresentation = getStatusPresentation(participant.status);

  const expectedAt = formatTimestamp(participant.expectedAt);
  const boardedAt = formatTimestamp(participant.boardedAt);
  const withdrawnAt = formatTimestamp(participant.withdrawnAt);
  const noShowAt = formatTimestamp(participant.noShowAt);
  const removedAt = formatTimestamp(participant.removedAt);

  const isPassenger =
    participant.role === JourneyBoardingParticipantRole.PASSENGER;

  const participantIdentityPublicId =
    participant.memberPublicId?.trim() ?? '';

  const hasPassengerIdentity =
    isPassenger &&
    journeyBoardingPublicId.trim().length > 0 &&
    participantIdentityPublicId.length > 0;

  const roleLabel =
    participant.role === JourneyBoardingParticipantRole.PROVIDER
      ? 'Journey provider'
      : 'Passenger';

  const outcomeTimestamp =
    participant.status === JourneyBoardingParticipantStatus.BOARDED
      ? boardedAt
      : participant.status === JourneyBoardingParticipantStatus.WITHDRAWN
        ? withdrawnAt
        : participant.status === JourneyBoardingParticipantStatus.NO_SHOW
          ? noShowAt
          : participant.status === JourneyBoardingParticipantStatus.REMOVED
            ? removedAt
            : undefined;

  const outcomeLabel =
    participant.status === JourneyBoardingParticipantStatus.BOARDED
      ? 'Boarded at'
      : participant.status === JourneyBoardingParticipantStatus.WITHDRAWN
        ? 'Withdrawn at'
        : participant.status === JourneyBoardingParticipantStatus.NO_SHOW
          ? 'No-show recorded at'
          : participant.status === JourneyBoardingParticipantStatus.REMOVED
            ? 'Removed at'
            : undefined;

  return (
    <div className="min-w-0 space-y-3">
      {hasPassengerIdentity && (
        <JourneyBoardingParticipantSummary
          journeyBoardingPublicId={journeyBoardingPublicId.trim()}
          participantIdentityPublicId={participantIdentityPublicId}
        />
      )}

      {isPassenger && !hasPassengerIdentity && (
        <Card padding="md">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Passenger profile and contact information are unavailable for
            this participant.
          </p>
        </Card>
      )}

      <Card
        padding="md"
        className="min-w-0"
        aria-label={`${roleLabel} boarding status`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {roleLabel}
              </p>

              {isCurrentPassenger && (
                <Badge variant="brand" size="sm">
                  You
                </Badge>
              )}
            </div>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              {statusPresentation.description}
            </p>
          </div>

          <Badge variant={statusPresentation.variant} size="sm">
            {statusPresentation.label}
          </Badge>
        </div>

        {(expectedAt || outcomeTimestamp) && (
          <>
            <Divider className="my-3" />

            <dl className="grid gap-2 text-sm">
              {expectedAt && (
                <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                  <dt className="text-[var(--foreground-muted)]">
                    Expected at
                  </dt>

                  <dd className="text-right font-medium text-[var(--foreground)]">
                    {expectedAt}
                  </dd>
                </div>
              )}

              {outcomeTimestamp && outcomeLabel && (
                <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                  <dt className="text-[var(--foreground-muted)]">
                    {outcomeLabel}
                  </dt>

                  <dd className="text-right font-medium text-[var(--foreground)]">
                    {outcomeTimestamp}
                  </dd>
                </div>
              )}
            </dl>
          </>
        )}
      </Card>
    </div>
  );
}
