
'use client';

/**
 * sisiMove — Journey Timeline
 *
 * Displays the important scheduled and lifecycle timestamps for a journey.
 *
 * Responsibilities:
 * - Show scheduled departure and arrival.
 * - Display available journey lifecycle timestamps.
 * - Format dates consistently and handle invalid or missing values.
 * - Provide a clear visual timeline for admin inspection.
 *
 * This component is presentation-only. It does not modify journey state.
 */

import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Flag,
  PlayCircle,
  XCircle,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { Journey } from '@/features/admin/journeys/models/journey.model';

export interface JourneyTimelineProps {
  journey: Journey;
  className?: string;
  timezone?: string;
}

interface TimelineEvent {
  id: string;
  label: string;
  value: string | null;
  icon: typeof CalendarClock;
  kind: 'scheduled' | 'active' | 'success' | 'cancelled' | 'neutral';
}

function formatDateTime(
  value: string | null | undefined,
  timezone: string,
): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(date);
  }
}

function getEventStyles(kind: TimelineEvent['kind']) {
  switch (kind) {
    case 'success':
      return {
        icon: 'bg-[var(--success-soft)] text-[var(--success)]',
        line: 'bg-[var(--success)]/30',
      };

    case 'cancelled':
      return {
        icon: 'bg-[var(--danger-soft)] text-[var(--danger)]',
        line: 'bg-[var(--border)]',
      };

    case 'active':
      return {
        icon: 'bg-[var(--brand-soft)] text-[var(--brand)]',
        line: 'bg-[var(--brand)]/30',
      };

    case 'scheduled':
      return {
        icon: 'bg-[var(--background-subtle)] text-[var(--foreground-secondary)]',
        line: 'bg-[var(--border)]',
      };

    default:
      return {
        icon: 'bg-[var(--background-subtle)] text-[var(--foreground-muted)]',
        line: 'bg-[var(--border)]',
      };
  }
}

export default function JourneyTimeline({
  journey,
  className,
  timezone,
}: JourneyTimelineProps) {
  const journeyTimezone =
    timezone || journey.schedule.timezone || 'UTC';

  const events: TimelineEvent[] = [
    {
      id: 'departure',
      label: 'Scheduled departure',
      value: journey.schedule.departureAt,
      icon: CalendarClock,
      kind: 'scheduled',
    },
    {
      id: 'published',
      label: 'Published',
      value: journey.publishedAt,
      icon: Flag,
      kind: 'neutral',
    },
    {
      id: 'started',
      label: 'Journey started',
      value: journey.startedAt,
      icon: PlayCircle,
      kind: 'active',
    },
    {
      id: 'arrival',
      label: 'Scheduled arrival',
      value: journey.schedule.arrivalAt,
      icon: Clock3,
      kind: 'scheduled',
    },
    {
      id: 'completion-requested',
      label: 'Completion requested',
      value: journey.completionRequestedAt,
      icon: Clock3,
      kind: 'neutral',
    },
    {
      id: 'completed',
      label: 'Completed',
      value: journey.completedAt,
      icon: CheckCircle2,
      kind: 'success',
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      value: journey.cancelledAt,
      icon: XCircle,
      kind: 'cancelled',
    },
    {
      id: 'expired',
      label: 'Expired',
      value: journey.expiredAt,
      icon: Clock3,
      kind: 'neutral',
    },
  ];

  const availableEvents = events.filter((event) => event.value);

  return (
    <section
      aria-labelledby="journey-timeline-heading"
      className={cn('min-w-0 space-y-4', className)}
    >
      <header>
        <h3
          id="journey-timeline-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Journey timeline
        </h3>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Scheduled times and recorded lifecycle events.
        </p>
      </header>

      {availableEvents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--background-subtle)] px-5 py-8 text-center">
          <CalendarClock
            aria-hidden="true"
            className="mx-auto size-6 text-[var(--foreground-muted)]"
          />

          <p className="mt-3 text-sm font-medium text-[var(--foreground)]">
            No timeline events available
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Schedule and lifecycle timestamps have not been recorded.
          </p>
        </div>
      ) : (
        <ol className="space-y-0">
          {availableEvents.map((event, index) => {
            const Icon = event.icon;
            const styles = getEventStyles(event.kind);
            const formattedDate = formatDateTime(
              event.value,
              journeyTimezone,
            );

            return (
              <li
                key={event.id}
                className="relative flex gap-3 pb-5 last:pb-0"
              >
                {index < availableEvents.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute bottom-0 left-4 top-9 w-px',
                      styles.line,
                    )}
                  />
                )}

                <span
                  className={cn(
                    'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full',
                    styles.icon,
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </span>

                <div className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {event.label}
                  </p>

                  {formattedDate ? (
                    <>
                      <time
                        dateTime={event.value ?? undefined}
                        className="mt-1 block text-sm text-[var(--foreground-secondary)]"
                      >
                        {formattedDate}
                      </time>

                      <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                        Timezone: {journeyTimezone}
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-sm text-[var(--danger)]">
                      Timestamp is invalid.
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
