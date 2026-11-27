
import { cn } from '@/foundation/utils/cn';

import { JourneyCompletionDate } from '../shared/JourneyCompletionDate';

export interface JourneyCompletionLifecyclePanelProps {
  createdAt?: string | Date | null;
  completionRequestedAt?: string | Date | null;
  confirmedAt?: string | Date | null;
  disputedAt?: string | Date | null;
  cancelledAt?: string | Date | null;
  className?: string;
}

interface LifecycleEvent {
  id: string;
  label: string;
  description: string;
  date: string | Date;
}

export function JourneyCompletionLifecyclePanel({
  createdAt,
  completionRequestedAt,
  confirmedAt,
  disputedAt,
  cancelledAt,
  className,
}: JourneyCompletionLifecyclePanelProps) {
  const events: Array<{
    id: string;
    label: string;
    description: string;
    date?: string | Date | null;
  }> = [
    {
      id: 'created',
      label: 'Completion record created',
      description: 'The completion record was created.',
      date: createdAt,
    },
    {
      id: 'requested',
      label: 'Completion requested',
      description: 'A completion request was submitted.',
      date: completionRequestedAt,
    },
    {
      id: 'confirmed',
      label: 'Completion confirmed',
      description: 'The completion was confirmed.',
      date: confirmedAt,
    },
    {
      id: 'disputed',
      label: 'Dispute opened',
      description: 'A dispute was opened against the completion.',
      date: disputedAt,
    },
    {
      id: 'cancelled',
      label: 'Completion cancelled',
      description: 'The completion was cancelled.',
      date: cancelledAt,
    },
  ];

  const recordedEvents: LifecycleEvent[] = events
    .filter((event): event is typeof event & { date: string | Date } => {
      if (!event.date) return false;

      const timestamp = new Date(event.date).getTime();

      return Number.isFinite(timestamp);
    })
    .map((event) => ({
      ...event,
      date: event.date,
    }))
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

  return (
    <section
      aria-labelledby="journey-completion-lifecycle-heading"
      className={cn(
        'min-w-0 rounded-xl border border-[var(--border)]',
        'bg-[var(--surface)] p-5 shadow-sm',
        className,
      )}
    >
      <div>
        <h2
          id="journey-completion-lifecycle-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Completion lifecycle
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Chronological history of the completion record.
        </p>
      </div>

      <div className="mt-5 border-t border-[var(--border-subtle)] pt-5">
        {recordedEvents.length === 0 ? (
          <div
            className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--background-subtle)] px-4 py-6 text-center"
            role="status"
          >
            <p className="text-sm text-[var(--foreground-muted)]">
              No lifecycle events have been recorded.
            </p>
          </div>
        ) : (
          <ol className="space-y-0">
            {recordedEvents.map((event, index) => {
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
                        'mt-1 h-3 w-3 rounded-full ring-4 ring-[var(--surface)]',
                        isLast
                          ? 'bg-[var(--brand)]'
                          : 'bg-[var(--border-strong)]',
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
                        <h3 className="text-sm font-medium text-[var(--foreground)]">
                          {event.label}
                        </h3>

                        <p className="mt-1 text-sm leading-relaxed text-[var(--foreground-secondary)]">
                          {event.description}
                        </p>
                      </div>

                      <div className="shrink-0 text-sm">
                        <JourneyCompletionDate
                          value={event.date}
                          format="datetime"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}

export default JourneyCompletionLifecyclePanel;
