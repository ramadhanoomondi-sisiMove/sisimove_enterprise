// src/features/admin/boardings/overview/BoardingParticipantOverview.tsx

import { Badge } from '@/components/ui/badge';

import {
  AdminBoardingParticipantStatus,
} from '@/features/admin/boardings';

import type {
  AdminBoardingParticipantStatusCounts,
} from '@/features/admin/boardings';

import { BoardingMetricCard } from './BoardingMetricCard';

import { cn } from '@/foundation/utils/cn';

export interface BoardingParticipantOverviewProps {
  totalParticipants: number;
  participantStatusCounts: AdminBoardingParticipantStatusCounts;
  className?: string;
}

const participantStatuses = [
  {
    status: AdminBoardingParticipantStatus.EXPECTED,
    label: 'Expected',
    description: 'Awaiting confirmation of boarding',
    accent: 'default',
  },
  {
    status: AdminBoardingParticipantStatus.BOARDED,
    label: 'Boarded',
    description: 'Confirmed on board',
    accent: 'success',
  },
  {
    status: AdminBoardingParticipantStatus.WITHDRAWN,
    label: 'Withdrawn',
    description: 'Withdrawn from boarding',
    accent: 'warning',
  },
  {
    status: AdminBoardingParticipantStatus.NO_SHOW,
    label: 'No-show',
    description: 'Did not board as expected',
    accent: 'danger',
  },
  {
    status: AdminBoardingParticipantStatus.REMOVED,
    label: 'Removed',
    description: 'Removed from the boarding record',
    accent: 'default',
  },
] as const;

export function BoardingParticipantOverview({
  totalParticipants,
  participantStatusCounts,
  className,
}: BoardingParticipantOverviewProps) {
  const countedParticipants = Object.values(
    participantStatusCounts,
  ).reduce((sum, count) => sum + count, 0);

  return (
    <section
      aria-labelledby="boarding-participants-heading"
      className={cn('space-y-4', className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="boarding-participants-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Participant overview
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Participant status across boarding records.
          </p>
        </div>

        <Badge variant="outline">
          {totalParticipants.toLocaleString()} participants
        </Badge>
      </div>

      {countedParticipants !== totalParticipants && (
        <p className="text-xs text-[var(--foreground-muted)]">
          Status counts total {countedParticipants.toLocaleString()}.
          The participant total may include records not represented in
          these status counts.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {participantStatuses.map((item) => (
          <BoardingMetricCard
            key={item.status}
            label={item.label}
            value={participantStatusCounts[item.status]}
            description={item.description}
            accent={item.accent}
          />
        ))}
      </div>
    </section>
  );
}
