// -----------------------------------------------------------------------------
// Journey Completion — Confirmations Table
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

import {
  CheckCircle2,
  Clock3,
  UserRound,
  XCircle,
} from 'lucide-react';

// -----------------------------------------------------------------------------
// Models and Utilities
// -----------------------------------------------------------------------------

import type { JourneyCompletionConfirmation } from '@/features/admin/journeys/models/journey-completion.model';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyConfirmationsTableProps {
  confirmations: readonly JourneyCompletionConfirmation[];
  className?: string;
  loading?: boolean;
  timezone?: string;
}

interface ConfirmationRowProps {
  confirmation: JourneyCompletionConfirmation;
  timezone?: string;
}

type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

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

function formatDate(
  value: string | null | undefined,
  timezone?: string,
): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Invalid date';

  try {
    return new Intl.DateTimeFormat('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short',
      ...(timezone ? { timeZone: timezone } : {}),
    }).format(date);
  } catch {
    // Fall back to the runtime's local timezone if the supplied timezone
    // is invalid. A malformed timezone must not break the table.
    return new Intl.DateTimeFormat('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }
}

// -----------------------------------------------------------------------------
// Status Presentation
// -----------------------------------------------------------------------------

function getStatusTone(status: string): StatusTone {
  const normalized = normalizeStatus(status);

  if (
    ['CONFIRMED', 'COMPLETED', 'APPROVED', 'ACCEPTED'].includes(normalized)
  ) {
    return 'success';
  }

  if (
    ['PENDING', 'AWAITING', 'REQUESTED', 'IN_PROGRESS'].includes(normalized)
  ) {
    return 'warning';
  }

  if (
    [
      'WITHDRAWN',
      'REJECTED',
      'DECLINED',
      'CANCELLED',
      'CANCELED',
      'FAILED',
    ].includes(normalized)
  ) {
    return 'danger';
  }

  return 'neutral';
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

function ConfirmationStatusBadge({ status }: { status: string }) {
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
        <XCircle className="size-3.5 shrink-0" aria-hidden="true" />
      )}

      {tone === 'neutral' && (
        <UserRound className="size-3.5 shrink-0" aria-hidden="true" />
      )}

      {formatLabel(status)}
    </span>
  );
}

// -----------------------------------------------------------------------------
// Confirmation Row
// -----------------------------------------------------------------------------

function ConfirmationRow({
  confirmation,
  timezone,
}: ConfirmationRowProps) {
  return (
    <tr className="border-b border-[var(--border-subtle)] last:border-b-0">
      <td className="px-4 py-4 align-top">
        <p className="break-all font-mono text-sm font-medium text-[var(--foreground)]">
          {confirmation.memberPublicId}
        </p>

        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          Confirmation: {confirmation.publicId}
        </p>
      </td>

      <td className="px-4 py-4 align-top">
        <span className="text-sm text-[var(--foreground)]">
          {formatLabel(confirmation.role)}
        </span>
      </td>

      <td className="px-4 py-4 align-top">
        <ConfirmationStatusBadge status={confirmation.status} />
      </td>

      <td className="px-4 py-4 align-top">
        {confirmation.bookingPublicId ? (
          <span className="break-all font-mono text-xs text-[var(--foreground)]">
            {confirmation.bookingPublicId}
          </span>
        ) : (
          <span className="text-sm text-[var(--foreground-muted)]">—</span>
        )}
      </td>

      <td className="px-4 py-4 align-top">
        <p className="text-sm text-[var(--foreground)]">
          {formatDate(confirmation.confirmedAt, timezone)}
        </p>

        {confirmation.withdrawnAt && (
          <p className="mt-1 text-xs text-[var(--warning)]">
            Withdrawn: {formatDate(confirmation.withdrawnAt, timezone)}
          </p>
        )}
      </td>
    </tr>
  );
}

// -----------------------------------------------------------------------------
// Table
// -----------------------------------------------------------------------------

export default function JourneyConfirmationsTable({
  confirmations,
  className,
  loading = false,
  timezone,
}: JourneyConfirmationsTableProps) {
  if (loading) {
    return (
      <div
        className={cn(
          'overflow-hidden rounded-xl border border-[var(--border)]',
          className,
        )}
        aria-busy="true"
        aria-label="Loading completion confirmations"
      >
        <div className="animate-pulse">
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

  if (confirmations.length === 0) {
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
          No confirmations recorded
        </h3>

        <p className="mt-1 max-w-md text-sm text-[var(--foreground-muted)]">
          No completion confirmation records are available for this journey
          completion.
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
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-[var(--background-subtle)]">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                Member
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                Role
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                Status
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                Booking reference
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                Confirmation activity
              </th>
            </tr>
          </thead>

          <tbody className="bg-[var(--surface)]">
            {confirmations.map((confirmation) => (
              <ConfirmationRow
                key={confirmation.publicId}
                confirmation={confirmation}
                timezone={timezone}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--background-subtle)] px-4 py-3">
        <p className="text-xs text-[var(--foreground-muted)]">
          {confirmations.length} confirmation
          {confirmations.length === 1 ? '' : 's'}
        </p>
      </div>
    </div>
  );
}
