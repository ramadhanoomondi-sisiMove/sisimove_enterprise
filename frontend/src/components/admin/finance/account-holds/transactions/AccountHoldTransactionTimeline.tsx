import type { AdminAccountHold } from '@/features/admin/finance/account-holds/models';
import { cn } from '@/foundation/utils/cn';
import { AccountHoldStatusBadge } from '../shared/AccountHoldStatusBadge';

export interface AccountHoldTransactionTimelineProps {
  hold: AdminAccountHold;
  className?: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string | Date;
  transactionPublicId?: string;
}

function formatDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi',
  }).format(date);
}

function getTimestamp(value: string | Date): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

function getTimelineEvents(hold: AdminAccountHold): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: 'created',
      title: 'Hold created',
      description: 'The account hold was recorded.',
      timestamp: hold.createdAt,
      transactionPublicId: hold.holdTransactionPublicId,
    },
  ];

  if (hold.releasedAt) {
    events.push({
      id: 'released',
      title: 'Hold released',
      description: 'A release timestamp is recorded for this hold.',
      timestamp: hold.releasedAt,
      transactionPublicId: hold.releaseTransactionPublicId,
    });
  }

  if (hold.capturedAt) {
    events.push({
      id: 'captured',
      title: 'Hold captured',
      description: 'A capture timestamp is recorded for this hold.',
      timestamp: hold.capturedAt,
      transactionPublicId: hold.captureTransactionPublicId,
    });
  }

  if (hold.cancelledAt) {
    events.push({
      id: 'cancelled',
      title: 'Hold cancelled',
      description: 'A cancellation timestamp is recorded for this hold.',
      timestamp: hold.cancelledAt,
      transactionPublicId: hold.releaseTransactionPublicId,
    });
  }

  return events.sort(
    (a, b) => getTimestamp(a.timestamp) - getTimestamp(b.timestamp),
  );
}

export function AccountHoldTransactionTimeline({
  hold,
  className,
}: AccountHoldTransactionTimelineProps) {
  const events = getTimelineEvents(hold);

  return (
    <section
      aria-labelledby="account-hold-timeline-title"
      className={cn('surface space-y-5 p-5', className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="account-hold-timeline-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Hold timeline
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Recorded lifecycle events, ordered by time.
          </p>
        </div>

        <AccountHoldStatusBadge status={hold.status} />
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-[var(--foreground-muted)]">
          No lifecycle events are available.
        </p>
      ) : (
        <ol className="space-y-0">
          {events.map((event, index) => (
            <li key={event.id} className="relative flex gap-3 pb-6 last:pb-0">
              {index < events.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-[7px] top-4 w-px bg-[var(--border)]"
                />
              ) : null}

              <span
                aria-hidden="true"
                className="relative mt-1 size-4 shrink-0 rounded-full border-2 border-[var(--brand)] bg-[var(--surface)]"
              />

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    {event.title}
                  </h3>

                  <time
                    className="text-xs text-[var(--foreground-muted)]"
                    dateTime={new Date(event.timestamp).toISOString()}
                  >
                    {formatDate(event.timestamp)}
                  </time>
                </div>

                <p className="text-sm text-[var(--foreground-secondary)]">
                  {event.description}
                </p>

                {event.transactionPublicId ? (
                  <p className="break-all text-xs text-[var(--foreground-muted)]">
                    Transaction ID: {event.transactionPublicId}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}