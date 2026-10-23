
import {
  AlertCircle,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

import type { JourneyBooking } from '@/features/admin/journeys/models/journey-booking.model';
import { cn } from '@/foundation/utils/cn';

interface JourneyPaymentsPanelProps {
  bookings: readonly JourneyBooking[];
  className?: string;
  loading?: boolean;
}

type PaymentStatusTone = 'success' | 'warning' | 'danger' | 'neutral';

function normalizeStatus(status: string): string {
  return status.trim().toUpperCase().replace(/[\s-]+/g, '_');
}

function getPaymentStatusTone(status: string): PaymentStatusTone {
  const normalized = normalizeStatus(status);

  if (
    [
      'CAPTURED',
      'PAID',
      'COMPLETED',
      'SUCCESS',
      'SUCCEEDED',
      'REFUNDED',
    ].includes(normalized)
  ) {
    return 'success';
  }

  if (
    ['PENDING', 'PROCESSING', 'AUTHORIZED', 'REQUIRES_ACTION'].includes(
      normalized,
    )
  ) {
    return 'warning';
  }

  if (
    ['FAILED', 'DECLINED', 'CANCELLED', 'CANCELED', 'EXPIRED'].includes(
      normalized,
    )
  ) {
    return 'danger';
  }

  return 'neutral';
}

function getPaymentStatusClasses(tone: PaymentStatusTone): string {
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

function formatMoney(
  amount: number | null | undefined,
  currency: string | null | undefined,
): string {
  if (amount == null || !Number.isFinite(amount)) return '—';

  const normalizedCurrency = currency?.trim().toUpperCase() || 'KES';

  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: normalizedCurrency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${normalizedCurrency} ${amount.toLocaleString('en-KE', {
      maximumFractionDigits: 2,
    })}`;
  }
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
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

function PaymentMetric({
  label,
  value,
  icon: Icon,
  description,
}: {
  label: string;
  value: string;
  icon: typeof CircleDollarSign;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </div>

      <p className="mt-2 break-words text-xl font-semibold text-[var(--foreground)]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[var(--foreground-muted)]">
        {description}
      </p>
    </div>
  );
}

/**
 * Use static JSX branches for status icons.
 * This avoids dynamically creating/selecting a component type during render.
 */
function PaymentStatusBadge({ status }: { status: string }) {
  const tone = getPaymentStatusTone(status);

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        getPaymentStatusClasses(tone),
      )}
    >
      {tone === 'success' && (
        <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
      )}

      {tone === 'warning' && (
        <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />
      )}

      {tone === 'danger' && (
        <XCircle className="size-3.5 shrink-0" aria-hidden="true" />
      )}

      {tone === 'neutral' && (
        <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
      )}

      <span className="break-words">{formatLabel(status)}</span>
    </span>
  );
}

function PaymentEvent({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="text-sm text-[var(--foreground-muted)]">{label}</span>

      <span className="text-sm font-medium text-[var(--foreground)] sm:text-right">
        {formatDate(value)}
      </span>
    </div>
  );
}

export default function JourneyPaymentsPanel({
  bookings,
  className,
  loading = false,
}: JourneyPaymentsPanelProps) {
  const paymentRecords = bookings.flatMap((booking) => {
    if (!booking.payment) return [];

    return [
      {
        booking,
        payment: booking.payment,
      },
    ];
  });

  const totalPayments = paymentRecords.length;

  const capturedPayments = paymentRecords.filter((record) =>
    [
      'CAPTURED',
      'PAID',
      'COMPLETED',
      'SUCCESS',
      'SUCCEEDED',
    ].includes(normalizeStatus(record.payment.status)),
  );

  const pendingPayments = paymentRecords.filter((record) =>
    ['PENDING', 'PROCESSING', 'AUTHORIZED', 'REQUIRES_ACTION'].includes(
      normalizeStatus(record.payment.status),
    ),
  );

  const failedPayments = paymentRecords.filter((record) =>
    ['FAILED', 'DECLINED'].includes(normalizeStatus(record.payment.status)),
  );

  const capturedTotal = capturedPayments.reduce(
    (sum, record) => sum + record.payment.amount,
    0,
  );

  const capturedCurrency =
    capturedPayments[0]?.payment.currency ||
    paymentRecords[0]?.payment.currency ||
    'KES';

  if (loading) {
    return (
      <section
        className={cn(
          'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5',
          className,
        )}
        aria-busy="true"
        aria-label="Journey payments"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-44 rounded bg-[var(--background-subtle)]" />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-24 rounded-xl bg-[var(--background-subtle)]"
              />
            ))}
          </div>

          <div className="h-32 rounded-xl bg-[var(--background-subtle)]" />
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        'space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5',
        className,
      )}
      aria-labelledby="journey-payments-title"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
            <CreditCard className="size-5" aria-hidden="true" />
          </div>

          <div>
            <h2
              id="journey-payments-title"
              className="text-base font-semibold text-[var(--foreground)]"
            >
              Payments
            </h2>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Payment status and financial events across journey bookings.
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--foreground-secondary)]">
          <CircleDollarSign className="size-3.5" aria-hidden="true" />
          {totalPayments} payment{totalPayments === 1 ? '' : 's'}
        </span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <PaymentMetric
          label="Captured payments"
          value={String(capturedPayments.length)}
          icon={ShieldCheck}
          description="Payments marked as captured or paid"
        />

        <PaymentMetric
          label="Captured amount"
          value={formatMoney(capturedTotal, capturedCurrency)}
          icon={CircleDollarSign}
          description="Sum of captured payment records"
        />

        <PaymentMetric
          label="Pending payments"
          value={String(pendingPayments.length)}
          icon={Clock3}
          description="Awaiting completion or confirmation"
        />

        <PaymentMetric
          label="Failed payments"
          value={String(failedPayments.length)}
          icon={AlertCircle}
          description="Payments marked failed or declined"
        />
      </div>

      {paymentRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-strong)] px-5 py-10 text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-[var(--background-subtle)] text-[var(--foreground-muted)]">
            <CreditCard className="size-5" aria-hidden="true" />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
            No payment records
          </h3>

          <p className="mt-1 max-w-md text-sm text-[var(--foreground-muted)]">
            None of the supplied bookings currently contains payment details.
            This does not necessarily mean no payment activity occurred.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Payment activity
          </h3>

          {paymentRecords.map(({ booking, payment }) => (
            <article
              key={booking.publicId}
              className="rounded-xl border border-[var(--border)] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs text-[var(--foreground-muted)]">
                    Booking reference
                  </p>

                  <p className="mt-1 break-all font-mono text-sm font-semibold text-[var(--foreground)]">
                    {booking.publicId}
                  </p>

                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                    Passenger: {booking.passengerPublicId}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <PaymentStatusBadge status={payment.status} />

                  <p className="text-lg font-semibold text-[var(--foreground)]">
                    {formatMoney(payment.amount, payment.currency)}
                  </p>
                </div>
              </div>

              <div className="my-4 border-t border-[var(--border-subtle)]" />

              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <dt className="text-xs text-[var(--foreground-muted)]">
                    Transaction reference
                  </dt>

                  <dd className="mt-1 break-all font-mono text-sm text-[var(--foreground)]">
                    {payment.transactionPublicId || 'Not available'}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-[var(--foreground-muted)]">
                    Payment amount
                  </dt>

                  <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
                    {formatMoney(payment.amount, payment.currency)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 space-y-3 rounded-lg bg-[var(--background-subtle)] p-3">
                <PaymentEvent
                  label="Authorized"
                  value={payment.authorizedAt}
                />

                <PaymentEvent
                  label="Captured"
                  value={payment.capturedAt}
                />

                <PaymentEvent
                  label="Failed"
                  value={payment.failedAt}
                />

                <PaymentEvent
                  label="Refunded"
                  value={payment.refundedAt}
                />
              </div>

              {payment.failureReason && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-[var(--danger)]/20 bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]">
                  <AlertCircle
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />

                  <div className="min-w-0">
                    <p className="font-semibold">Payment failure reason</p>
                    <p className="mt-1 break-words">
                      {payment.failureReason}
                    </p>
                  </div>
                </div>
              )}

              {payment.refundedAt && (
                <div className="mt-3 flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                  <RotateCcw className="size-4" aria-hidden="true" />

                  <span>
                    Refund event recorded on {formatDate(payment.refundedAt)}.
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
