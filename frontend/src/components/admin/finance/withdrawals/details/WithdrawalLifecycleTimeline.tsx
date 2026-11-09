import { Badge, Card } from '@/components/ui';
import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';
import { WithdrawalDate } from '../shared/WithdrawalDate';

export interface WithdrawalLifecycleTimelineProps {
  withdrawal: AdminWithdrawal;
  className?: string;
}

interface TimelineEvent {
  key: string;
  title: string;
  description: string;
  timestamp: string;
  variant: 'success' | 'warning' | 'danger' | 'default' | 'brand';
}

export function WithdrawalLifecycleTimeline({
  withdrawal,
  className,
}: WithdrawalLifecycleTimelineProps) {
  const events: TimelineEvent[] = [
    {
      key: 'requested',
      title: 'Withdrawal requested',
      description: 'The withdrawal request was created.',
      timestamp: withdrawal.requestedAt,
      variant: 'brand',
    },
  ];

  if (withdrawal.completedAt) {
    events.push({
      key: 'completed',
      title: 'Withdrawal completed',
      description: 'The withdrawal was marked as completed.',
      timestamp: withdrawal.completedAt,
      variant: 'success',
    });
  }

  if (withdrawal.failedAt) {
    events.push({
      key: 'failed',
      title: 'Withdrawal failed',
      description: 'The withdrawal was marked as failed.',
      timestamp: withdrawal.failedAt,
      variant: 'danger',
    });
  }

  if (withdrawal.cancelledAt) {
    events.push({
      key: 'cancelled',
      title: 'Withdrawal cancelled',
      description: 'The withdrawal was cancelled.',
      timestamp: withdrawal.cancelledAt,
      variant: 'warning',
    });
  }

  events.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <Card className={className}>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Lifecycle timeline
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Recorded withdrawal lifecycle events.
        </p>
      </div>

      <ol className="space-y-5">
        {events.map((event, index) => (
          <li key={event.key} className="relative flex gap-3">
            <div className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--brand)]"
              />
              {index < events.length - 1 && (
                <span
                  aria-hidden="true"
                  className="mt-2 min-h-8 w-px flex-1 bg-[var(--border)]"
                />
              )}
            </div>

            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {event.title}
                </p>
                <Badge variant={event.variant} size="sm">
                  Recorded
                </Badge>
              </div>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                {event.description}
              </p>

              <p className="mt-2 text-xs text-[var(--foreground-muted)]">
                <WithdrawalDate value={event.timestamp} includeTime />
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export default WithdrawalLifecycleTimeline;