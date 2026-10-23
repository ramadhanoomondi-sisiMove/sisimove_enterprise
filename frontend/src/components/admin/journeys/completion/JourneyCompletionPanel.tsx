
'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileCheck2,
  XCircle,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { JourneyCompletion } from '@/features/admin/journeys/models/journey-completion.model';

import JourneyConfirmationsTable from './JourneyConfirmationsTable';
import { JourneyDisputesPanel } from './JourneyDisputesPanel';

interface JourneyCompletionPanelProps {
  completion: JourneyCompletion | null;
  className?: string;
  loading?: boolean;
  timezone?: string;
}

type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';

function normalizeStatus(status: string): string {
  return status.trim().toUpperCase().replace(/[\s-]+/g, '_');
}

function formatStatus(status: string): string {
  return (
    status
      .trim()
      .replace(/[_-]+/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (character) => character.toUpperCase()) ||
    'Unknown'
  );
}

function getStatusTone(status: string): StatusTone {
  const normalized = normalizeStatus(status);

  if (
    [
      'CONFIRMED',
      'COMPLETED',
      'RESOLVED',
      'APPROVED',
      'ACCEPTED',
      'SETTLED',
    ].includes(normalized)
  ) {
    return 'success';
  }

  if (
    [
      'PENDING',
      'REQUESTED',
      'IN_PROGRESS',
      'AWAITING_CONFIRMATIONS',
      'UNDER_REVIEW',
    ].includes(normalized)
  ) {
    return 'warning';
  }

  if (
    [
      'DISPUTED',
      'CANCELLED',
      'CANCELED',
      'REJECTED',
      'FAILED',
      'EXPIRED',
    ].includes(normalized)
  ) {
    return 'danger';
  }

  return 'neutral';
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

function StatusIcon({ status }: { status: string }) {
  const tone = getStatusTone(status);

  if (tone === 'success') {
    return <CheckCircle2 className="h-4 w-4" aria-hidden="true" />;
  }

  if (tone === 'warning') {
    return <Clock3 className="h-4 w-4" aria-hidden="true" />;
  }

  if (tone === 'danger') {
    return <XCircle className="h-4 w-4" aria-hidden="true" />;
  }

  return <FileCheck2 className="h-4 w-4" aria-hidden="true" />;
}

function StatusBadge({ status }: { status: string }) {
  const tone = getStatusTone(status);

  const toneClasses: Record<StatusTone, string> = {
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
      <StatusIcon status={status} />
      {formatStatus(status)}
    </span>
  );
}

function LifecycleItem({
  label,
  value,
  timezone,
}: {
  label: string;
  value: string | null;
  timezone?: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-3.5">
      <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
      <p className="mt-1.5 break-words text-sm font-medium text-[var(--foreground)]">
        {formatDate(value, timezone)}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-sm text-[var(--foreground-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
        {value}
      </p>
      <p className="mt-1 text-xs text-[var(--foreground-muted)]">
        {description}
      </p>
    </div>
  );
}

function CompletionSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading journey completion"
      className="space-y-5"
    >
      <div className="h-32 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--background-subtle)]" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--background-subtle)]"
          />
        ))}
      </div>

      <div className="h-48 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--background-subtle)]" />
    </div>
  );
}

export function JourneyCompletionPanel({
  completion,
  className,
  loading = false,
  timezone,
}: JourneyCompletionPanelProps) {
  if (loading) {
    return <CompletionSkeleton />;
  }

  if (!completion) {
    return (
      <section
        aria-label="Journey completion"
        className={cn(
          'rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-5 py-12 text-center',
          className,
        )}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-subtle)] text-[var(--foreground-muted)]">
          <FileCheck2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
          No completion record
        </h3>
        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
          A completion record has not been provided for this journey.
        </p>
      </section>
    );
  }

  const confirmationProgress =
    completion.requiredConfirmations > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (completion.confirmedCount / completion.requiredConfirmations) *
              100,
          ),
        )
      : 0;

  const remainingConfirmations = Math.max(
    0,
    completion.requiredConfirmations - completion.confirmedCount,
  );

  const disputeCount = completion.disputes.length;
  const openDisputeCount = completion.disputes.filter((dispute) => {
    const status = normalizeStatus(dispute.status);

    return [
      'OPEN',
      'PENDING',
      'UNDER_REVIEW',
      'IN_REVIEW',
      'INVESTIGATING',
    ].includes(status);
  }).length;

  return (
    <section
      aria-label="Journey completion"
      className={cn('space-y-6', className)}
    >
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-subtle)] p-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
              <FileCheck2 className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Journey completion
              </h2>
              <p className="mt-1 break-all text-xs text-[var(--foreground-muted)]">
                Completion ID: {completion.publicId}
              </p>
              <p className="mt-1 break-all text-xs text-[var(--foreground-muted)]">
                Journey: {completion.journeyPublicId}
              </p>
            </div>
          </div>

          <StatusBadge status={completion.status} />
        </div>

        <div className="space-y-5 p-5">
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-[var(--foreground)]">
                Confirmation progress
              </p>
              <p className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
                {completion.confirmedCount} of{' '}
                {completion.requiredConfirmations}
              </p>
            </div>

            <div
              className="h-2.5 overflow-hidden rounded-full bg-[var(--background-subtle)]"
              role="progressbar"
              aria-label="Completion confirmation progress"
              aria-valuemin={0}
              aria-valuemax={completion.requiredConfirmations}
              aria-valuenow={Math.min(
                completion.confirmedCount,
                completion.requiredConfirmations,
              )}
            >
              <div
                className={cn(
                  'h-full rounded-full transition-[width]',
                  openDisputeCount > 0
                    ? 'bg-[var(--warning)]'
                    : 'bg-[var(--brand)]',
                )}
                style={{ width: `${confirmationProgress}%` }}
              />
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--foreground-muted)]">
              <span>{Math.round(confirmationProgress)}% confirmed</span>
              <span>
                {remainingConfirmations === 0
                  ? 'Required confirmations reached'
                  : `${remainingConfirmations} confirmation${
                      remainingConfirmations === 1 ? '' : 's'
                    } remaining`}
              </span>
            </div>
          </div>

          {openDisputeCount > 0 ? (
            <div className="flex items-start gap-2.5 rounded-lg border border-[var(--warning)]/25 bg-[var(--warning-soft)]/40 p-3.5">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--warning)]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {openDisputeCount} dispute
                  {openDisputeCount === 1 ? '' : 's'} require attention
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--foreground-secondary)]">
                  Review the dispute records below before assessing the
                  completion outcome.
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <LifecycleItem
              label="Completion requested"
              value={completion.completionRequestedAt}
              timezone={timezone}
            />
            <LifecycleItem
              label="Confirmed"
              value={completion.confirmedAt}
              timezone={timezone}
            />
            <LifecycleItem
              label="Disputed"
              value={completion.disputedAt}
              timezone={timezone}
            />
            <LifecycleItem
              label="Cancelled"
              value={completion.cancelledAt}
              timezone={timezone}
            />
            <LifecycleItem
              label="Created"
              value={completion.createdAt}
              timezone={timezone}
            />
            <LifecycleItem
              label="Last updated"
              value={completion.updatedAt}
              timezone={timezone}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          label="Confirmations"
          value={completion.confirmations.length}
          description="Confirmation records"
        />
        <MetricCard
          label="Required"
          value={completion.requiredConfirmations}
          description="Confirmations needed"
        />
        <MetricCard
          label="Disputes"
          value={disputeCount}
          description={
            openDisputeCount > 0
              ? `${openDisputeCount} open or under review`
              : 'No open disputes detected'
          }
        />
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">
            Confirmation records
          </h3>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Review participant confirmation statuses and timestamps.
          </p>
        </div>

        <JourneyConfirmationsTable
          confirmations={completion.confirmations}
          timezone={timezone}
        />
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">
            Completion disputes
          </h3>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Review reported issues and their recorded resolution details.
          </p>
        </div>

        <JourneyDisputesPanel
          disputes={completion.disputes}
          timezone={timezone}
        />
      </div>
    </section>
  );
}

export default JourneyCompletionPanel;
