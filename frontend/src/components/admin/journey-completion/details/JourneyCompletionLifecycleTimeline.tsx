
import { cn } from '@/foundation/utils/cn';

import { JourneyCompletionDate } from '../shared/JourneyCompletionDate';

export interface JourneyCompletionLifecycleEvent {
  id: string;
  title: string;
  description?: string | null;
  timestamp?: string | Date | null;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export interface JourneyCompletionLifecycleTimelineProps {
  events: JourneyCompletionLifecycleEvent[];
  className?: string;
  emptyMessage?: string;
}

const EVENT_MARKER_STYLES = {
  default: 'bg-[var(--border-strong)]',
  success: 'bg-[var(--success)]',
  warning: 'bg-[var(--warning)]',
  danger: 'bg-[var(--danger)]',
} as const;

export function JourneyCompletionLifecycleTimeline({
  events,
  className,
  emptyMessage = 'No lifecycle events have been recorded.',
}: JourneyCompletionLifecycleTimelineProps) {
  const recordedEvents = events
    .flatMap((event) => {
      if (!event.timestamp) return [];

      const timestamp = new Date(event.timestamp).getTime();

      if (!Number.isFinite(timestamp)) return [];

      return [{ ...event, timestamp }];
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  if (recordedEvents.length === 0) {
    return (
      <div
        className={cn(
          'rounded-lg border border-dashed border-[var(--border)]',
          'bg-[var(--background-subtle)] px-4 py-6 text-center',
          className,
        )}
        role="status"
      >
        <p className="text-sm text-[var(--foreground-muted)]">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <ol
      className={cn('space-y-0', className)}
      aria-label="Journey completion lifecycle"
    >
      {recordedEvents.map((event, index) => {
        const variant = event.variant ?? 'default';
        const isLast = index === recordedEvents.length - 1;

        return (
          <li
            key={event.id}
            className="relative flex gap-3"
          >
            <div
              className="flex shrink-0 flex-col items-center"
              aria-hidden="true"
            >
              <span
                className={cn(
                  'mt-1 h-3 w-3 shrink-0 rounded-full',
                  'ring-4 ring-[var(--surface)]',
                  EVENT_MARKER_STYLES[variant],
                )}
              />

              {!isLast && (
                <span className="mt-1 min-h-8 w-px flex-1 bg-[var(--border)]" />
              )}
            </div>

            <div
              className={cn(
                'min-w-0 flex-1',
                !isLast && 'pb-5',
              )}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="break-words text-sm font-medium text-[var(--foreground)]">
                    {event.title}
                  </h3>

                  {event.description?.trim() && (
                    <p className="mt-1 break-words text-sm leading-relaxed text-[var(--foreground-secondary)]">
                      {event.description}
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-sm">
                  <JourneyCompletionDate
                    value={event.timestamp}
                    format="datetime"
                  />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default JourneyCompletionLifecycleTimeline;
