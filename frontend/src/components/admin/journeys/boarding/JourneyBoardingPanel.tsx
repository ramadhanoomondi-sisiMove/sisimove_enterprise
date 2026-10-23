
import {
  Activity,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Users,
  XCircle,
} from 'lucide-react';

import type { JourneyBoarding } from '@/features/admin/journeys/models/journey-boarding.model';
import { cn } from '@/foundation/utils/cn';

import JourneyBoardingTimeline from './JourneyBoardingTimeline';
import JourneyParticipantsTable from './JourneyParticipantsTable';

interface JourneyBoardingPanelProps {
  boarding: JourneyBoarding | null;
  className?: string;
  loading?: boolean;
  timezone?: string;
}

type BoardingStatusTone = 'success' | 'warning' | 'danger' | 'neutral';

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
  if (!value) return 'Not recorded';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Invalid date';

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

function getBoardingStatusTone(status: string): BoardingStatusTone {
  const normalized = normalizeStatus(status);

  if (
    ['COMPLETED', 'COMPLETE', 'STARTED', 'IN_PROGRESS', 'BOARDED'].includes(
      normalized,
    )
  ) {
    return 'success';
  }

  if (
    ['PENDING', 'SCHEDULED', 'NOT_STARTED', 'BOARDING', 'OPEN'].includes(
      normalized,
    )
  ) {
    return 'warning';
  }

  if (
    ['CANCELLED', 'CANCELED', 'FAILED', 'EXPIRED'].includes(normalized)
  ) {
    return 'danger';
  }

  return 'neutral';
}

function getStatusClasses(tone: BoardingStatusTone): string {
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

function BoardingStatusBadge({ status }: { status: string }) {
  const tone = getBoardingStatusTone(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold',
        getStatusClasses(tone),
      )}
    >
      {tone === 'success' && (
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
      )}

      {tone === 'warning' && (
        <Clock3 className="size-3.5" aria-hidden="true" />
      )}

      {tone === 'danger' && (
        <XCircle className="size-3.5" aria-hidden="true" />
      )}

      {tone === 'neutral' && (
        <Activity className="size-3.5" aria-hidden="true" />
      )}

      {formatLabel(status)}
    </span>
  );
}

function BoardingMetric({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </div>

      <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[var(--foreground-muted)]">
        {description}
      </p>
    </div>
  );
}

function BoardingPanelSkeleton({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        'space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5',
        className,
      )}
      aria-busy="true"
      aria-label="Loading journey boarding"
    >
      <div className="animate-pulse space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="h-5 w-44 rounded bg-[var(--background-subtle)]" />
          <div className="h-7 w-24 rounded-full bg-[var(--background-subtle)]" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-24 rounded-xl bg-[var(--background-subtle)]"
            />
          ))}
        </div>

        <div className="h-36 rounded-xl bg-[var(--background-subtle)]" />
        <div className="h-48 rounded-xl bg-[var(--background-subtle)]" />
      </div>
    </section>
  );
}

export default function JourneyBoardingPanel({
  boarding,
  className,
  loading = false,
  timezone,
}: JourneyBoardingPanelProps) {
  if (loading) {
    return <BoardingPanelSkeleton className={className} />;
  }

  if (!boarding) {
    return (
      <section
        className={cn(
          'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6',
          className,
        )}
        aria-labelledby="journey-boarding-empty-title"
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[var(--background-subtle)] text-[var(--foreground-muted)]">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </div>

          <h2
            id="journey-boarding-empty-title"
            className="mt-4 text-base font-semibold text-[var(--foreground)]"
          >
            No boarding record
          </h2>

          <p className="mt-1 max-w-md text-sm text-[var(--foreground-muted)]">
            No boarding record is available for this journey. Boarding
            information will appear here when a record is provided by the
            backend.
          </p>
        </div>
      </section>
    );
  }

  const participants = boarding.participants ?? [];
  const events = boarding.events ?? [];

  const boardedCount = participants.filter(
    (participant) => Boolean(participant.boardedAt),
  ).length;

  const noShowCount = participants.filter(
    (participant) => Boolean(participant.noShowAt),
  ).length;

  const outstandingCount = participants.filter(
    (participant) =>
      !participant.boardedAt &&
      !participant.noShowAt &&
      !participant.withdrawnAt &&
      !participant.removedAt,
  ).length;

  const progressPercentage =
    participants.length > 0
      ? Math.round((boardedCount / participants.length) * 100)
      : 0;

  return (
    <section
      className={cn(
        'space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5',
        className,
      )}
      aria-labelledby="journey-boarding-panel-title"
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h2
              id="journey-boarding-panel-title"
              className="text-base font-semibold text-[var(--foreground)]"
            >
              Journey boarding
            </h2>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Monitor participant boarding, lifecycle milestones, and recorded
              events.
            </p>

            <p className="mt-2 break-all font-mono text-xs text-[var(--foreground-muted)]">
              Boarding ID: {boarding.publicId}
            </p>
          </div>
        </div>

        <BoardingStatusBadge status={boarding.status} />
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <BoardingMetric
          label="Participants"
          value={participants.length}
          description="Participants in this boarding record"
          icon={Users}
        />

        <BoardingMetric
          label="Boarded"
          value={boardedCount}
          description="Participants with a boarding timestamp"
          icon={CheckCircle2}
        />

        <BoardingMetric
          label="No-shows"
          value={noShowCount}
          description="Participants recorded as absent"
          icon={XCircle}
        />

        <BoardingMetric
          label="Outstanding"
          value={outstandingCount}
          description="No final participant outcome recorded"
          icon={Clock3}
        />
      </div>

      <div className="rounded-xl border border-[var(--border)] p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Boarding progress
            </h3>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Based on participants with a recorded boarding timestamp.
            </p>
          </div>

          <span className="text-sm font-semibold text-[var(--foreground)]">
            {progressPercentage}%
          </span>
        </div>

        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--background-subtle)]"
          role="progressbar"
          aria-label="Boarding progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
        >
          <div
            className="h-full rounded-full bg-[var(--brand)] transition-[width]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <Clock3 className="size-4" aria-hidden="true" />
            Boarding started
          </div>

          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
            {formatDate(boarding.boardingStartedAt, timezone)}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <Activity className="size-4" aria-hidden="true" />
            Journey started
          </div>

          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
            {formatDate(boarding.journeyStartedAt, timezone)}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] p-4 sm:col-span-2 xl:col-span-1">
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <XCircle className="size-4" aria-hidden="true" />
            Boarding cancelled
          </div>

          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
            {formatDate(boarding.cancelledAt, timezone)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Participants
          </h3>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Individual boarding status and recorded outcomes.
          </p>
        </div>

        <JourneyParticipantsTable participants={participants} />
      </div>

      <JourneyBoardingTimeline
        boarding={boarding}
        timezone={timezone}
      />

      <footer className="flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--foreground-muted)] sm:flex-row sm:items-center sm:justify-between">
        <span>
          {events.length} recorded event{events.length === 1 ? '' : 's'}
        </span>

        <span>
          Last updated: {formatDate(boarding.updatedAt, timezone)}
        </span>
      </footer>
    </section>
  );
}
