
import {
  CheckCircle2,
  Circle,
  Clock3,
  XCircle,
} from 'lucide-react';

import type { AdminBooking } from '@/features/admin/bookings';
import { cn } from '@/foundation/utils/cn';

type BookingPayment = NonNullable<AdminBooking['payment']>;

interface BookingPaymentTimelineProps {
  payment: BookingPayment;
  className?: string;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return 'Not available';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function BookingPaymentTimeline({
  payment,
  className,
}: BookingPaymentTimelineProps) {
  const events = [
    {
      label: 'Payment authorized',
      description: 'Authorization was recorded for this payment.',
      date: payment.authorizedAt,
      icon: Clock3,
      tone: 'text-[var(--brand)] bg-[var(--brand-soft)]',
    },
    {
      label: 'Payment captured',
      description: 'A payment capture timestamp was recorded.',
      date: payment.capturedAt,
      icon: CheckCircle2,
      tone: 'text-[var(--success)] bg-[var(--success-soft)]',
    },
    {
      label: 'Payment failed',
      description: payment.failureReason || 'A payment failure was recorded.',
      date: payment.failedAt,
      icon: XCircle,
      tone: 'text-[var(--danger)] bg-[var(--danger-soft)]',
    },
    {
      label: 'Payment refunded',
      description: 'A refund timestamp was recorded.',
      date: payment.refundedAt,
      icon: CheckCircle2,
      tone: 'text-[var(--warning)] bg-[var(--warning-soft)]',
    },
  ]
    .filter(
      (event): event is typeof event & { date: string } =>
        typeof event.date === 'string' &&
        event.date.trim().length > 0 &&
        !Number.isNaN(new Date(event.date).getTime()),
    )
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

  return (
    <section className={cn('min-w-0', className)}>
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Payment timeline
        </h3>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Recorded payment events in chronological order.
        </p>
      </div>

      {events.length > 0 ? (
        <ol className="relative space-y-5">
          {events.map((event, index) => {
            const Icon = event.icon;
            const isLast = index === events.length - 1;

            return (
              <li
                key={`${event.label}-${event.date}`}
                className="relative flex gap-3"
              >
                {!isLast && (
                  <span
                    className="absolute bottom-0 left-5 top-11 w-px -translate-x-1/2 bg-[var(--border)]"
                    aria-hidden="true"
                  />
                )}

                <div
                  className={cn(
                    'relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full',
                    event.tone,
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <h4 className="text-sm font-semibold text-[var(--foreground)]">
                      {event.label}
                    </h4>

                    <time
                      dateTime={event.date}
                      className="shrink-0 text-xs text-[var(--foreground-secondary)]"
                    >
                      {formatDate(event.date)}
                    </time>
                  </div>

                  <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
                    {event.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="flex items-start gap-3 rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--background-subtle)] p-5">
          <Circle
            className="mt-0.5 size-5 shrink-0 text-[var(--foreground-muted)]"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              No payment events recorded
            </p>
            <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
              No valid authorization, capture, failure, or refund timestamps
              are available for this payment.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export type { BookingPaymentTimelineProps };
