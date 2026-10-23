
'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileClock,
  Landmark,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { JourneySettlement } from '@/features/admin/journeys/models/journey-settlement.model';

interface JourneySettlementPanelProps {
  settlement: JourneySettlement | null;
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
      'COMPLETED',
      'SETTLED',
      'PAID',
      'SUCCESS',
      'SUCCEEDED',
      'RELEASED',
    ].includes(normalized)
  ) {
    return 'success';
  }

  if (
    [
      'PENDING',
      'SUBMITTED',
      'PROCESSING',
      'ON_HOLD',
      'HELD',
      'QUEUED',
      'IN_PROGRESS',
    ].includes(normalized)
  ) {
    return 'warning';
  }

  if (
    [
      'FAILED',
      'REJECTED',
      'CANCELLED',
      'CANCELED',
      'ERROR',
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

  return <FileClock className="h-4 w-4" aria-hidden="true" />;
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

function Detail({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
      <p
        className={cn(
          'mt-1.5 break-words text-sm text-[var(--foreground)]',
          mono && 'font-mono text-xs',
        )}
      >
        {value || '—'}
      </p>
    </div>
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
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-3.5">
      <p className="text-xs text-[var(--foreground-muted)]">{label}</p>
      <p className="mt-1.5 break-words text-sm font-medium text-[var(--foreground)]">
        {formatDate(value, timezone)}
      </p>
    </div>
  );
}

function SettlementSkeleton() {
  return (
    <section
      aria-label="Journey settlement"
      aria-busy="true"
      className="space-y-5"
    >
      <div className="h-36 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--background-subtle)]" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="h-20 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--background-subtle)]"
          />
        ))}
      </div>
    </section>
  );
}

export function JourneySettlementPanel({
  settlement,
  className,
  loading = false,
  timezone,
}: JourneySettlementPanelProps) {
  if (loading) {
    return <SettlementSkeleton />;
  }

  if (!settlement) {
    return (
      <section
        aria-label="Journey settlement"
        className={cn(
          'rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-5 py-12 text-center',
          className,
        )}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-subtle)] text-[var(--foreground-muted)]">
          <Landmark className="h-6 w-6" aria-hidden="true" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
          No settlement record
        </h3>

        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
          A settlement record has not been provided for this journey
          completion.
        </p>
      </section>
    );
  }

  const tone = getStatusTone(settlement.status);
  const isFailed = tone === 'danger';
  const isCompleted = tone === 'success';
  const isHeld =
    normalizeStatus(settlement.status) === 'HELD' ||
    normalizeStatus(settlement.status) === 'ON_HOLD';

  return (
    <section
      aria-label="Journey settlement"
      className={cn('space-y-5', className)}
    >
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-subtle)] p-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
              <Landmark className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Settlement overview
              </h2>
              <p className="mt-1 break-all font-mono text-xs text-[var(--foreground-muted)]">
                {settlement.publicId}
              </p>
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                Record version {settlement.version}
              </p>
            </div>
          </div>

          <StatusBadge status={settlement.status} />
        </div>

        <div className="space-y-5 p-5">
          {isFailed ? (
            <div className="flex items-start gap-2.5 rounded-lg border border-[var(--danger)]/25 bg-[var(--danger-soft)]/40 p-3.5">
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--danger)]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Settlement requires investigation
                </p>
                <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
                  {settlement.failureReason ||
                    'The record indicates a failure, but no failure reason was provided.'}
                </p>
              </div>
            </div>
          ) : null}

          {isHeld ? (
            <div className="flex items-start gap-2.5 rounded-lg border border-[var(--warning)]/25 bg-[var(--warning-soft)]/40 p-3.5">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--warning)]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Settlement is on hold
                </p>
                <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
                  Review the settlement record and its related financial
                  transaction before taking further action.
                </p>
              </div>
            </div>
          ) : null}

          {isCompleted ? (
            <div className="flex items-start gap-2.5 rounded-lg border border-[var(--success)]/25 bg-[var(--success-soft)]/40 p-3.5">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Settlement marked successful
                </p>
                <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
                  The settlement record is in a successful state. Verify the
                  linked financial transaction when reconciliation is required.
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Detail
              label="Journey public ID"
              value={settlement.journeyPublicId}
              mono
            />
            <Detail
              label="Provider public ID"
              value={settlement.providerPublicId}
              mono
            />
            <Detail
              label="Completion public ID"
              value={settlement.completionId}
              mono
            />
            <Detail
              label="Financial transaction"
              value={settlement.financialTransactionPublicId ?? 'Not linked'}
              mono
            />
            <Detail
              label="Failure reason"
              value={settlement.failureReason ?? 'None recorded'}
            />
            <Detail
              label="Record version"
              value={String(settlement.version)}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3">
          <h3 className="text-base font-semibold text-[var(--foreground)]">
            Settlement lifecycle
          </h3>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Recorded timestamps for each settlement stage.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <LifecycleItem
            label="Submitted"
            value={settlement.submittedAt}
            timezone={timezone}
          />
          <LifecycleItem
            label="Processing started"
            value={settlement.processingAt}
            timezone={timezone}
          />
          <LifecycleItem
            label="Completed"
            value={settlement.completedAt}
            timezone={timezone}
          />
          <LifecycleItem
            label="Failed"
            value={settlement.failedAt}
            timezone={timezone}
          />
          <LifecycleItem
            label="Placed on hold"
            value={settlement.heldAt}
            timezone={timezone}
          />
          <LifecycleItem
            label="Cancelled"
            value={settlement.cancelledAt}
            timezone={timezone}
          />
          <LifecycleItem
            label="Created"
            value={settlement.createdAt}
            timezone={timezone}
          />
          <LifecycleItem
            label="Last updated"
            value={settlement.updatedAt}
            timezone={timezone}
          />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
            <CreditCard className="h-4 w-4" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Reconciliation reference
            </h3>
            <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
              Use the settlement, completion, journey, and financial transaction
              references to trace this record through the backend and financial
              ledger. This panel is read-only and does not initiate or retry a
              settlement.
            </p>

            {settlement.financialTransactionPublicId ? (
              <p className="mt-3 break-all font-mono text-xs text-[var(--foreground-secondary)]">
                Transaction: {settlement.financialTransactionPublicId}
              </p>
            ) : (
              <p className="mt-3 text-xs text-[var(--foreground-muted)]">
                No financial transaction reference is linked to this record.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default JourneySettlementPanel;
