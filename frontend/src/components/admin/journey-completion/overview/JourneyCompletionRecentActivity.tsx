
import type {
  AdminJourneyCompletionActivityItem,
} from '@/features/admin/journey-completion/hooks';
import { JourneyCompletionDate } from '../shared';

export interface JourneyCompletionRecentActivityProps {
  activity: AdminJourneyCompletionActivityItem[];
  limit?: number;
  className?: string;
  emptyMessage?: string;
}

export function JourneyCompletionRecentActivity({
  activity,
  limit = 6,
  className,
  emptyMessage = 'No completion activity is available yet.',
}: JourneyCompletionRecentActivityProps) {
  const recentItems = activity.slice(0, Math.max(0, limit));

  return (
    <section
      className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 ${className ?? ''}`}
      aria-labelledby="journey-completion-activity-heading"
    >
      <div className="mb-4">
        <h3
          id="journey-completion-activity-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Recent activity
        </h3>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Latest recorded completion confirmations and dispute events.
        </p>
      </div>

      {recentItems.length === 0 ? (
        <p className="rounded-lg bg-[var(--background-subtle)] px-4 py-6 text-center text-sm text-[var(--foreground-muted)]">
          {emptyMessage}
        </p>
      ) : (
        <ol className="divide-y divide-[var(--border)]">
          {recentItems.map((item) => (
            <li key={item.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
              <span
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--brand)]"
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {item.title}
                </p>

                {item.description ? (
                  <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                    {item.description}
                  </p>
                ) : null}

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--foreground-muted)]">
                  <JourneyCompletionDate
                    value={item.occurredAt}
                    format="datetime"
                  />

                  {item.relatedPublicId ? (
                    <span className="font-mono">
                      Ref: {item.relatedPublicId}
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
