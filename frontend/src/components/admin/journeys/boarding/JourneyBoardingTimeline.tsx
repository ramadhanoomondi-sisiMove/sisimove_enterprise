
import {
  Activity,
  CheckCircle2,
  Clock3,
  XCircle,
} from 'lucide-react';

import type {
  JourneyBoarding,
  JourneyBoardingEvent,
} from '@/features/admin/journeys/models/journey-boarding.model';
import { cn } from '@/foundation/utils/cn';

interface JourneyBoardingTimelineProps {
  boarding: JourneyBoarding;
  className?: string;
  loading?: boolean;
  timezone?: string;
}

type TimelineTone = 'success' | 'warning' | 'danger' | 'neutral';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  tone: TimelineTone;
  kind: 'lifecycle' | 'participant' | 'event';
}

function normalizeStatus(value: string): string {
  return value.trim().toUpperCase().replace(/[\s-]+/g, '_');
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
    return new Intl.DateTimeFormat('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }
}

function getEventTone(type: string): TimelineTone {
  const normalized = normalizeStatus(type);

  if (
    normalized.includes('BOARD') ||
    normalized.includes('START') ||
    normalized.includes('COMPLETE') ||
    normalized.includes('CONFIRM')
  ) {
    return 'success';
  }

  if (
    normalized.includes('CANCEL') ||
    normalized.includes('FAIL') ||
    normalized.includes('NO_SHOW') ||
    normalized.includes('REMOVE')
  ) {
    return 'danger';
  }

  if (
    normalized.includes('PENDING') ||
    normalized.includes('WAIT') ||
    normalized.includes('EXPECT')
  ) {
    return 'warning';
  }

  return 'neutral';
}

function getToneClasses(tone: TimelineTone): string {
  switch (tone) {
    case 'success':
      return 'bg-[var(--success-soft)] text-[var(--success)]';

    case 'warning':
      return 'bg-[var(--warning-soft)] text-[var(--warning)]';

    case 'danger':
      return 'bg-[var(--danger-soft)] text-[var(--danger)]';

    default:
      return 'bg-[var(--background-subtle)] text-[var(--foreground-muted)]';
  }
}

function getEventDescription(event: JourneyBoardingEvent): string {
  const details: string[] = [];

  if (event.memberPublicId) {
    details.push(`Member: ${event.memberPublicId}`);
  }

  if (event.bookingPublicId) {
    details.push(`Booking: ${event.bookingPublicId}`);
  }

  if (event.actorPublicId) {
    details.push(`Recorded by: ${event.actorPublicId}`);
  }

  return details.join(' · ');
}

function buildTimelineItems(boarding: JourneyBoarding): TimelineItem[] {
  const items: TimelineItem[] = [];

  if (boarding.createdAt) {
    items.push({
      id: `boarding-created-${boarding.publicId}`,
      title: 'Boarding record created',
      description: `Boarding reference: ${boarding.publicId}`,
      timestamp: boarding.createdAt,
      tone: 'neutral',
      kind: 'lifecycle',
    });
  }

  if (boarding.boardingStartedAt) {
    items.push({
      id: `boarding-started-${boarding.publicId}`,
      title: 'Boarding started',
      description: 'The boarding start time was recorded.',
      timestamp: boarding.boardingStartedAt,
      tone: 'success',
      kind: 'lifecycle',
    });
  }

  if (boarding.journeyStartedAt) {
    items.push({
      id: `journey-started-${boarding.publicId}`,
      title: 'Journey started',
      description: 'The journey start time was recorded.',
      timestamp: boarding.journeyStartedAt,
      tone: 'success',
      kind: 'lifecycle',
    });
  }

  if (boarding.cancelledAt) {
    items.push({
      id: `boarding-cancelled-${boarding.publicId}`,
      title: 'Boarding cancelled',
      description: 'A cancellation timestamp is recorded.',
      timestamp: boarding.cancelledAt,
      tone: 'danger',
      kind: 'lifecycle',
    });
  }

  for (const participant of boarding.participants ?? []) {
    if (participant.boardedAt) {
      items.push({
        id: `participant-boarded-${participant.publicId}`,
        title: 'Participant boarded',
        description: `Member: ${participant.memberPublicId}`,
        timestamp: participant.boardedAt,
        tone: 'success',
        kind: 'participant',
      });
    }

    if (participant.noShowAt) {
      items.push({
        id: `participant-no-show-${participant.publicId}`,
        title: 'Participant marked as no-show',
        description: `Member: ${participant.memberPublicId}`,
        timestamp: participant.noShowAt,
        tone: 'danger',
        kind: 'participant',
      });
    }

    if (participant.withdrawnAt) {
      items.push({
        id: `participant-withdrawn-${participant.publicId}`,
        title: 'Participant withdrawn',
        description: `Member: ${participant.memberPublicId}`,
        timestamp: participant.withdrawnAt,
        tone: 'warning',
        kind: 'participant',
      });
    }

    if (participant.removedAt) {
      items.push({
        id: `participant-removed-${participant.publicId}`,
        title: 'Participant removed',
        description: `Member: ${participant.memberPublicId}`,
        timestamp: participant.removedAt,
        tone: 'danger',
        kind: 'participant',
      });
    }
  }

  for (const event of boarding.events ?? []) {
    items.push({
      id: `event-${event.publicId}`,
      title: formatLabel(event.type),
      description: getEventDescription(event) || undefined,
      timestamp: event.occurredAt,
      tone: getEventTone(event.type),
      kind: 'event',
    });
  }

  return items.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

function TimelineMarker({ tone }: { tone: TimelineTone }) {
  return (
    <span
      className={cn(
        'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ring-4 ring-[var(--surface)]',
        getToneClasses(tone),
      )}
      aria-hidden="true"
    >
      {tone === 'success' && (
        <CheckCircle2 className="size-4" />
      )}

      {tone === 'warning' && (
        <Clock3 className="size-4" />
      )}

      {tone === 'danger' && (
        <XCircle className="size-4" />
      )}

      {tone === 'neutral' && (
        <Activity className="size-4" />
      )}
    </span>
  );
}

function getKindLabel(kind: TimelineItem['kind']): string {
  switch (kind) {
    case 'lifecycle':
      return 'Lifecycle';

    case 'participant':
      return 'Participant';

    case 'event':
      return 'Recorded event';
  }
}

export default function JourneyBoardingTimeline({
  boarding,
  className,
  loading = false,
  timezone,
}: JourneyBoardingTimelineProps) {
  if (loading) {
    return (
      <section
        className={cn(
          'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5',
          className,
        )}
        aria-busy="true"
        aria-label="Loading boarding timeline"
      >
        <div className="animate-pulse space-y-5">
          <div className="h-5 w-48 rounded bg-[var(--background-subtle)]" />

          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex gap-3">
              <div className="size-9 shrink-0 rounded-full bg-[var(--background-subtle)]" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-40 rounded bg-[var(--background-subtle)]" />
                <div className="h-3 w-56 max-w-full rounded bg-[var(--background-subtle)]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const timelineItems = buildTimelineItems(boarding);

  return (
    <section
      className={cn(
        'space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5',
        className,
      )}
      aria-labelledby="journey-boarding-timeline-title"
    >
      <header className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <Clock3 className="size-5" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <h2
            id="journey-boarding-timeline-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Boarding timeline
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Chronological record of boarding milestones and participant events.
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--foreground-muted)]">
          {timelineItems.length} event{timelineItems.length === 1 ? '' : 's'}
        </span>
      </header>

      {timelineItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-strong)] px-5 py-9 text-center">
          <Clock3
            className="mx-auto size-6 text-[var(--foreground-muted)]"
            aria-hidden="true"
          />

          <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
            No timeline activity
          </h3>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            No lifecycle timestamps or boarding events have been recorded.
          </p>
        </div>
      ) : (
        <ol className="relative space-y-0">
          {timelineItems.map((item, index) => (
            <li
              key={item.id}
              className="relative flex gap-3 pb-6 last:pb-0"
            >
              {index < timelineItems.length - 1 && (
                <span
                  className="absolute bottom-0 left-[17px] top-9 w-px bg-[var(--border)]"
                  aria-hidden="true"
                />
              )}

              <TimelineMarker tone={item.tone} />

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="mt-1 break-words text-sm text-[var(--foreground-muted)]">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <time
                    dateTime={item.timestamp}
                    className="shrink-0 text-xs text-[var(--foreground-muted)] sm:text-right"
                  >
                    {formatDate(item.timestamp, timezone)}
                  </time>
                </div>

                <span className="mt-2 inline-flex rounded-md bg-[var(--background-subtle)] px-2 py-1 text-xs text-[var(--foreground-muted)]">
                  {getKindLabel(item.kind)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
