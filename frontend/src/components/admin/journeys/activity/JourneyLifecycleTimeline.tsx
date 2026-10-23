
'use client';

import {
  CalendarClock,
  CheckCircle2,
  CircleDot,
  Clock3,
  Play,
  XCircle,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { Journey } from '@/features/admin/journeys/models/journey.model';

interface JourneyLifecycleTimelineProps {
  journey: Journey;
  className?: string;
  timezone?: string;
}

type TimelineTone = 'success' | 'warning' | 'danger' | 'neutral';

interface TimelineEvent {
  id: string;
  label: string;
  description: string;
  timestamp: string;
  tone: TimelineTone;
}

function formatDate(
  value: string,
  timezone?: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

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

function formatStatus(status: string): string {
  return status
    .trim()
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getEvents(journey: Journey): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  const addEvent = (
    id: string,
    label: string,
    description: string,
    timestamp: string | null | undefined,
    tone: TimelineTone = 'neutral',
  ) => {
    if (!timestamp || Number.isNaN(new Date(timestamp).getTime())) {
      return;
    }

    events.push({
      id,
      label,
      description,
      timestamp,
      tone,
    });
  };

  addEvent(
    'created',
    'Journey created',
    'The journey record was created.',
    journey.createdAt,
  );

  addEvent(
    'published',
    'Journey published',
    'The journey was published.',
    journey.publishedAt,
    'success',
  );

  addEvent(
    'started',
    'Journey started',
    'The journey was marked as started.',
    journey.startedAt,
    'warning',
  );

  addEvent(
    'completion-requested',
    'Completion requested',
    'A completion request was recorded.',
    journey.completionRequestedAt,
    'warning',
  );

  addEvent(
    'completed',
    'Journey completed',
    'The journey was marked as completed.',
    journey.completedAt,
    'success',
  );

  addEvent(
    'cancelled',
    'Journey cancelled',
    'A cancellation timestamp was recorded.',
    journey.cancelledAt,
    'danger',
  );

  addEvent(
    'expired',
    'Journey expired',
    'The journey was marked as expired.',
    journey.expiredAt,
    'danger',
  );

  addEvent(
    'updated',
    'Journey record updated',
    'The journey record was last updated.',
    journey.updatedAt,
  );

  return events.sort(
    (left, right) =>
      new Date(left.timestamp).getTime() -
      new Date(right.timestamp).getTime(),
  );
}

function TimelineMarker({ tone }: { tone: TimelineTone }) {
  if (tone === 'success') {
    return (
      <CheckCircle2
        className="h-4 w-4"
        aria-hidden="true"
      />
    );
  }

  if (tone === 'warning') {
    return (
      <Play
        className="h-4 w-4"
        aria-hidden="true"
      />
    );
  }

  if (tone === 'danger') {
    return (
      <XCircle
        className="h-4 w-4"
        aria-hidden="true"
      />
    );
  }

  return (
    <CircleDot
      className="h-4 w-4"
      aria-hidden="true"
    />
  );
}

export function JourneyLifecycleTimeline({
  journey,
  className,
  timezone,
}: JourneyLifecycleTimelineProps) {
  const events = getEvents(journey);

  const markerClasses: Record<TimelineTone, string> = {
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
    <section
      aria-label="Journey lifecycle timeline"
      className={cn(
        'rounded-xl border border-[var(--border)] bg-[var(--surface)]',
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border-subtle)] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]">
            <CalendarClock
              className="h-5 w-5"
              aria-hidden="true"
            />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Lifecycle timeline
            </h2>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Recorded milestones in chronological order.
            </p>
          </div>
        </div>

        <span className="rounded-full border border-[var(--border)] bg-[var(--background-subtle)] px-2.5 py-1 text-xs text-[var(--foreground-secondary)]">
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      <div className="p-5">
        {events.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <Clock3
              className="h-8 w-8 text-[var(--foreground-muted)]"
              aria-hidden="true"
            />
            <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
              No lifecycle timestamps
            </h3>
            <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--foreground-muted)]">
              No valid lifecycle timestamps are available for this journey.
            </p>
          </div>
        ) : (
          <ol className="space-y-0">
            {events.map((event, index) => (
              <li
                key={event.id}
                className="relative flex gap-3 pb-6 last:pb-0"
              >
                {index < events.length - 1 ? (
                  <span
                    className="absolute bottom-0 left-5 top-10 w-px bg-[var(--border)]"
                    aria-hidden="true"
                  />
                ) : null}

                <div
                  className={cn(
                    'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border',
                    markerClasses[event.tone],
                  )}
                >
                  <TimelineMarker tone={event.tone} />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">
                      {event.label}
                    </h3>

                    <time
                      dateTime={event.timestamp}
                      className="text-xs tabular-nums text-[var(--foreground-muted)]"
                    >
                      {formatDate(event.timestamp, timezone)}
                    </time>
                  </div>

                  <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
                    {event.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="border-t border-[var(--border-subtle)] px-5 py-3">
        <p className="text-xs leading-5 text-[var(--foreground-muted)]">
          Current journey status:{' '}
          <span className="font-medium text-[var(--foreground-secondary)]">
            {formatStatus(journey.status)}
          </span>
          . Timeline entries reflect recorded timestamps, not independently
          verified events.
        </p>
      </div>
    </section>
  );
}

export default JourneyLifecycleTimeline;
