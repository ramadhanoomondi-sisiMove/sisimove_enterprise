
'use client';

import {
  CheckCircle2,
  Clock3,
  UserRound,
  UserX,
} from 'lucide-react';

import type { AdminBoardingParticipant } from '@/features/admin/boardings/models';
import {
  AdminBoardingParticipantRole,
  AdminBoardingParticipantStatus,
} from '@/features/admin/boardings/models';
import { BoardingPublicId } from '@/components/admin/boardings/shared';
import { cn } from '@/foundation/utils/cn';

interface BoardingParticipantRowProps {
  participant: AdminBoardingParticipant;
}

const STATUS_PRESENTATION: Record<
  AdminBoardingParticipantStatus,
  {
    label: string;
    className: string;
    Icon: typeof CheckCircle2;
  }
> = {
  [AdminBoardingParticipantStatus.EXPECTED]: {
    label: 'Expected',
    className:
      'bg-[var(--warning)]/10 text-[var(--warning)]',
    Icon: Clock3,
  },
  [AdminBoardingParticipantStatus.BOARDED]: {
    label: 'Boarded',
    className:
      'bg-[var(--success)]/10 text-[var(--success)]',
    Icon: CheckCircle2,
  },
  [AdminBoardingParticipantStatus.WITHDRAWN]: {
    label: 'Withdrawn',
    className:
      'bg-[var(--muted)] text-[var(--muted-foreground)]',
    Icon: UserX,
  },
  [AdminBoardingParticipantStatus.NO_SHOW]: {
    label: 'No show',
    className:
      'bg-[var(--danger)]/10 text-[var(--danger)]',
    Icon: UserX,
  },
  [AdminBoardingParticipantStatus.REMOVED]: {
    label: 'Removed',
    className:
      'bg-[var(--muted)] text-[var(--muted-foreground)]',
    Icon: UserX,
  },
};

function formatDateTime(value?: string | null): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi',
  }).format(date);
}

export function BoardingParticipantRow({
  participant,
}: BoardingParticipantRowProps) {
  const status = STATUS_PRESENTATION[participant.status];
  const isProvider =
    participant.role === AdminBoardingParticipantRole.PROVIDER;

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
          <UserRound className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <BoardingPublicId
              publicId={participant.memberPublicId}
              copyable
              compact
            />

            <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]">
              {isProvider ? 'Provider' : 'Passenger'}
            </span>
          </div>

          {participant.bookingPublicId && (
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Booking:{' '}
              <BoardingPublicId
                publicId={participant.bookingPublicId}
                copyable
                compact
              />
            </p>
          )}

          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Expected: {formatDateTime(participant.expectedAt)}
          </p>

          {participant.boardedAt && (
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Boarded: {formatDateTime(participant.boardedAt)}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium',
            status.className,
          )}
        >
          <status.Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {status.label}
        </span>
      </div>
    </article>
  );
}
