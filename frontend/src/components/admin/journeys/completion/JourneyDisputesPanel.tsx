
'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileWarning,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { JourneyCompletionDispute } from '@/features/admin/journeys/models/journey-completion.model';

interface JourneyDisputesPanelProps {
  disputes: readonly JourneyCompletionDispute[];
  className?: string;
  loading?: boolean;
  timezone?: string;
}

type DisputeTone = 'success' | 'warning' | 'danger' | 'neutral';

function normalizeStatus(status: string): string {
  return status.trim().toUpperCase().replace(/[\s-]+/g, '_');
}

function getDisputeTone(status: string): DisputeTone {
  const normalized = normalizeStatus(status);

  if (
    ['RESOLVED', 'CLOSED', 'ACCEPTED', 'WITHDRAWN'].includes(normalized)
  ) {
    return 'success';
  }

  if (
    ['OPEN', 'PENDING', 'UNDER_REVIEW', 'IN_REVIEW', 'INVESTIGATING'].includes(
      normalized,
    )
  ) {
    return 'warning';
  }

  if (
    ['REJECTED', 'FAILED', 'ESCALATED', 'UNRESOLVED'].includes(normalized)
  ) {
    return 'danger';
  }

  return 'neutral';
}

function formatStatus(status: string): string {
  return status
    .trim()
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase()) || 'Unknown';
}

function formatDate(
  value: string | null | undefined,
  timezone?: string,
): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  try {
    return new Intl.DateTimeFormat('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short',
      ...(timezone ? { timeZone: timezone } : {}),
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }
}

function getStatusIcon(status: string) {
  const normalized = normalizeStatus(status);

  if (['RESOLVED', 'CLOSED', 'ACCEPTED'].includes(normalized)) {
    return <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />;
  }

  if (['REJECTED', 'FAILED', 'UNRESOLVED'].includes(normalized)) {
    return <XCircle className="h-3.5 w-3.5" aria-hidden="true" />;
  }

  if (
    ['OPEN', 'PENDING', 'UNDER_REVIEW', 'IN_REVIEW', 'INVESTIGATING'].includes(
      normalized,
    )
  ) {
    return <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />;
  }

  return <FileWarning className="h-3.5 w-3.5" aria-hidden="true" />;
}

function StatusBadge({ status }: { status: string }) {
  const tone = getDisputeTone(status);

  const toneClasses: Record<DisputeTone, string> = {
    success:
      'border-[var(--success)]/25 bg-[var(--success-soft)] text-[var(--success)]',
    warning:
      'border-[var(--warning)]/25 bg-[var(--warning-soft)] text-[var(--warning)]',
    danger:
      'border-[var(--danger)]/25 bg-[var(--danger-soft)] text-[var(--danger)]',
    neutral:
      'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        toneClasses[tone],
      )}
    >
      {getStatusIcon(status)}
      {formatStatus(status)}
    </span>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm text-[var(--foreground)]">
        {value || '—'}
      </p>
    </div>
  );
}

function DisputeCard({
  dispute,
  timezone,
}: {
  dispute: JourneyCompletionDispute;
  timezone?: string;
}) {
  const tone = getDisputeTone(dispute.status);

  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border-subtle)] p-4 sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
              tone === 'danger' &&
                'bg-[var(--danger-soft)] text-[var(--danger)]',
              tone === 'warning' &&
                'bg-[var(--warning-soft)] text-[var(--warning)]',
              tone === 'success' &&
                'bg-[var(--success-soft)] text-[var(--success)]',
              tone === 'neutral' &&
                'bg-[var(--background-subtle)] text-[var(--foreground-secondary)]',
            )}
          >
            {tone === 'danger' ? (
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            ) : tone === 'success' ? (
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            ) : (
              <FileWarning className="h-5 w-5" aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0">
            <p className="break-all text-sm font-semibold text-[var(--foreground)]">
              {dispute.publicId}
            </p>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Raised by{' '}
              <span className="break-all text-[var(--foreground-secondary)]">
                {dispute.raisedByPublicId}
              </span>
            </p>
          </div>
        </div>

        <StatusBadge status={dispute.status} />
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Dispute reason
          </p>
          <p className="mt-1.5 text-sm font-medium text-[var(--foreground)]">
            {formatStatus(dispute.reason)}
          </p>

          {dispute.description ? (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--foreground-secondary)]">
              {dispute.description}
            </p>
          ) : (
            <p className="mt-2 text-sm italic text-[var(--foreground-muted)]">
              No additional description provided.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Detail
            label="Opened"
            value={formatDate(dispute.openedAt, timezone)}
          />
          <Detail
            label="Last updated"
            value={formatDate(dispute.updatedAt, timezone)}
          />
          <Detail
            label="Resolved by"
            value={dispute.resolvedByPublicId ?? 'Not assigned'}
          />
          <Detail
            label="Resolved at"
            value={formatDate(dispute.resolvedAt, timezone)}
          />
          <Detail
            label="Rejected at"
            value={formatDate(dispute.rejectedAt, timezone)}
          />
          <Detail
            label="Withdrawn at"
            value={formatDate(dispute.withdrawnAt, timezone)}
          />
        </div>

        {dispute.resolutionSummary ? (
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
              Resolution summary
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]">
              {dispute.resolutionSummary}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function JourneyDisputesPanel({
  disputes,
  className,
  loading = false,
  timezone,
}: JourneyDisputesPanelProps) {
  const sortedDisputes = [...disputes].sort(
    (left, right) =>
      new Date(right.openedAt).getTime() -
      new Date(left.openedAt).getTime(),
  );

  const openCount = disputes.filter((dispute) => {
    const status = normalizeStatus(dispute.status);

    return [
      'OPEN',
      'PENDING',
      'UNDER_REVIEW',
      'IN_REVIEW',
      'INVESTIGATING',
    ].includes(status);
  }).length;

  const resolvedCount = disputes.filter((dispute) => {
    const status = normalizeStatus(dispute.status);

    return ['RESOLVED', 'CLOSED', 'ACCEPTED'].includes(status);
  }).length;

  if (loading) {
    return (
      <section
        aria-label="Journey disputes"
        aria-busy="true"
        className={cn('space-y-4', className)}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--background-subtle)]"
            />
          ))}
        </div>

        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-56 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--background-subtle)]"
          />
        ))}
      </section>
    );
  }

  return (
    <section
      aria-label="Journey disputes"
      className={cn('space-y-5', className)}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--foreground-muted)]">
            Total disputes
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
            {disputes.length}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--warning)]/20 bg-[var(--warning-soft)]/40 p-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Open / under review
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--warning)]">
            {openCount}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--success)]/20 bg-[var(--success-soft)]/40 p-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Resolved / closed
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--success)]">
            {resolvedCount}
          </p>
        </div>
      </div>

      {sortedDisputes.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-5 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-subtle)] text-[var(--foreground-muted)]">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
            No completion disputes
          </h3>
          <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--foreground-muted)]">
            There are no completion disputes recorded for this journey.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDisputes.map((dispute) => (
            <DisputeCard
              key={dispute.publicId}
              dispute={dispute}
              timezone={timezone}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default JourneyDisputesPanel;
