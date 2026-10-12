
'use client';

import { Badge, Card, Divider } from '@/components/ui';
import {
  JourneyBoardingParticipantStatus,
  type JourneyBoardingParticipant,
} from '@/features/journey-boarding/models';

interface PassengerBoardingStatusCardProps {
  participant: JourneyBoardingParticipant;
  className?: string;
}

function getStatusPresentation(status: JourneyBoardingParticipantStatus): {
  label: string;
  variant: 'success' | 'warning' | 'danger' | 'default';
  message: string;
} {
  switch (status) {
    case JourneyBoardingParticipantStatus.BOARDED:
      return {
        label: 'Boarded',
        variant: 'success',
        message: 'Your boarding has been recorded.',
      };

    case JourneyBoardingParticipantStatus.EXPECTED:
      return {
        label: 'Expected',
        variant: 'warning',
        message: 'You have not been marked as boarded yet.',
      };

    case JourneyBoardingParticipantStatus.WITHDRAWN:
      return {
        label: 'Withdrawn',
        variant: 'default',
        message: 'Your participation in this journey was withdrawn.',
      };

    case JourneyBoardingParticipantStatus.NO_SHOW:
      return {
        label: 'No-show',
        variant: 'danger',
        message: 'Your boarding record is marked as no-show.',
      };

    case JourneyBoardingParticipantStatus.REMOVED:
      return {
        label: 'Removed',
        variant: 'default',
        message: 'You are no longer listed as a participant.',
      };

    default:
      return {
        label: 'Unknown',
        variant: 'default',
        message: 'Your boarding status is unavailable.',
      };
  }
}

function formatTimestamp(value?: string | Date | null): string | null {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function PassengerBoardingStatusCard({
  participant,
  className,
}: PassengerBoardingStatusCardProps) {
  const presentation = getStatusPresentation(participant.status);
  const expectedAt = formatTimestamp(participant.expectedAt);
  const boardedAt = formatTimestamp(participant.boardedAt);

  return (
    <Card padding="md" className={className}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Your boarding status
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            {presentation.message}
          </p>
        </div>

        <Badge variant={presentation.variant} size="sm">
          {presentation.label}
        </Badge>
      </div>

      {(expectedAt || boardedAt) && (
        <>
          <Divider className="my-4" />

          <dl className="grid gap-3 sm:grid-cols-2">
            {expectedAt && (
              <div>
                <dt className="text-xs text-[var(--foreground-muted)]">
                  EXPECTED AT
                </dt>
                <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
                  {expectedAt}
                </dd>
              </div>
            )}

            {boardedAt && (
              <div>
                <dt className="text-xs text-[var(--foreground-muted)]">
                  BOARDED AT
                </dt>
                <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
                  {boardedAt}
                </dd>
              </div>
            )}
          </dl>
        </>
      )}
    </Card>
  );
}
