
import {
  CheckCircle2,
  Clock3,
  UserRound,
  UserX,
} from 'lucide-react';

import type { JourneyBoardingParticipant } from '@/features/admin/journeys/models/journey-boarding.model';
import { cn } from '@/foundation/utils/cn';

interface JourneyParticipantsTableProps {
  participants: readonly JourneyBoardingParticipant[];
  className?: string;
  loading?: boolean;
}

type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';

function normalizeStatus(status: string): string {
  return status.trim().toUpperCase().replace(/[\s-]+/g, '_');
}

function formatLabel(value: string | null | undefined): string {
  if (!value?.trim()) return 'Unknown';

  return value
    .trim()
    .toLowerCase()
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function getStatusTone(status: string): StatusTone {
  switch (normalizeStatus(status)) {
    case 'BOARDED':
    case 'CONFIRMED':
    case 'COMPLETED':
    case 'PRESENT':
      return 'success';

    case 'EXPECTED':
    case 'PENDING':
    case 'WAITING':
    case 'BOARDING':
      return 'warning';

    case 'NO_SHOW':
    case 'WITHDRAWN':
    case 'REMOVED':
    case 'CANCELLED':
    case 'CANCELED':
      return 'danger';

    default:
      return 'neutral';
  }
}

function getStatusClasses(tone: StatusTone): string {
  switch (tone) {
    case 'success':
      return 'border-[var(--success)]/20 bg-[var(--success-soft)] text-[var(--success)]';

    case 'warning':
      return 'border-[var(--warning)]/20 bg-[var(--warning-soft)] text-[var(--warning)]';

    case 'danger':
      return 'border-[var(--danger)]/20 bg-[var(--danger-soft)] text-[var(--danger)]';

    default:
      return 'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)]';
  }
}

function ParticipantStatusBadge({ status }: { status: string }) {
  const tone = getStatusTone(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        getStatusClasses(tone),
      )}
    >
      {tone === 'success' && (
        <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
      )}

      {tone === 'warning' && (
        <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />
      )}

      {tone === 'danger' && (
        <UserX className="size-3.5 shrink-0" aria-hidden="true" />
      )}

      {tone === 'neutral' && (
        <UserRound className="size-3.5 shrink-0" aria-hidden="true" />
      )}

      {formatLabel(status)}
    </span>
  );
}

function ParticipantRow({
  participant,
}: {
  participant: JourneyBoardingParticipant;
}) {
  const outcome = participant.boardedAt
    ? 'Boarded'
    : participant.noShowAt
      ? 'No show'
      : participant.withdrawnAt
        ? 'Withdrawn'
        : participant.removedAt
          ? 'Removed'
          : 'Not recorded';

  return (
    <tr className="border-b border-[var(--border-subtle)] last:border-b-0">
      <td className="px-4 py-4 align-top">
        <p className="break-all font-mono text-sm font-medium text-[var(--foreground)]">
          {participant.memberPublicId}
        </p>

        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          Participant: {participant.publicId}
        </p>
      </td>

      <td className="px-4 py-4 align-top">
        <span className="text-sm text-[var(--foreground)]">
          {formatLabel(participant.role)}
        </span>
      </td>

      <td className="px-4 py-4 align-top">
        <ParticipantStatusBadge status={participant.status} />
      </td>

      <td className="px-4 py-4 align-top">
        <p className="text-sm text-[var(--foreground)]">
          {formatDate(participant.expectedAt)}
        </p>

        {participant.bookingPublicId && (
          <p className="mt-1 break-all font-mono text-xs text-[var(--foreground-muted)]">
            Booking: {participant.bookingPublicId}
          </p>
        )}
      </td>

      <td className="px-4 py-4 align-top">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {outcome}
        </p>

        {participant.boardedAt && (
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            {formatDate(participant.boardedAt)}
          </p>
        )}

        {!participant.boardedAt && participant.noShowAt && (
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Recorded: {formatDate(participant.noShowAt)}
          </p>
        )}

        {!participant.boardedAt &&
          !participant.noShowAt &&
          participant.withdrawnAt && (
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Recorded: {formatDate(participant.withdrawnAt)}
            </p>
          )}

        {!participant.boardedAt &&
          !participant.noShowAt &&
          !participant.withdrawnAt &&
          participant.removedAt && (
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Recorded: {formatDate(participant.removedAt)}
            </p>
          )}
      </td>
    </tr>
  );
}

export default function JourneyParticipantsTable({
  participants,
  className,
  loading = false,
}: JourneyParticipantsTableProps) {
  if (loading) {
    return (
      <div
        className={cn(
          'overflow-hidden rounded-xl border border-[var(--border)]',
          className,
        )}
        aria-busy="true"
        aria-label="Loading boarding participants"
      >
        <div className="animate-pulse space-y-0">
          <div className="h-11 bg-[var(--background-subtle)]" />

          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-16 border-t border-[var(--border-subtle)] bg-[var(--surface)]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-strong)] px-5 py-10 text-center',
          className,
        )}
      >
        <div className="flex size-11 items-center justify-center rounded-full bg-[var(--background-subtle)] text-[var(--foreground-muted)]">
          <UserRound className="size-5" aria-hidden="true" />
        </div>

        <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
          No boarding participants
        </h3>

        <p className="mt-1 max-w-md text-sm text-[var(--foreground-muted)]">
          There are no participant records associated with this boarding
          record.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-[var(--border)]',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead className="bg-[var(--background-subtle)]">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                Participant
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                Role
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                Status
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                Expected
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                Outcome
              </th>
            </tr>
          </thead>

          <tbody className="bg-[var(--surface)]">
            {participants.map((participant) => (
              <ParticipantRow
                key={participant.publicId}
                participant={participant}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--background-subtle)] px-4 py-3">
        <p className="text-xs text-[var(--foreground-muted)]">
          {participants.length} participant
          {participants.length === 1 ? '' : 's'}
        </p>
      </div>
    </div>
  );
}
