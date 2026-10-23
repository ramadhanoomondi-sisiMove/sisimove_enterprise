
import { CreditCard, FileText, Receipt } from 'lucide-react';

import { BookingSectionHeader } from '@/components/admin/bookings/layout';
import type { AdminBooking } from '@/features/admin/bookings';
import { cn } from '@/foundation/utils/cn';

import { BookingPaymentTimeline } from './BookingPaymentTimeline';

type BookingPayment = NonNullable<AdminBooking['payment']>;

interface BookingPaymentPanelProps {
  payment: BookingPayment | null | undefined;
  className?: string;
}

function formatMoney(
  amount: number | undefined,
  currency: string | undefined,
): string {
  if (amount == null || !Number.isFinite(amount)) {
    return 'Not available';
  }

  if (!currency) {
    return amount.toLocaleString('en-KE');
  }

  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString('en-KE')}`;
  }
}

function formatDate(value: string | null | undefined): string {
  if (!value) return 'Not available';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Not available';

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function PaymentStatus({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  const tone =
    normalized === 'CAPTURED'
      ? 'border-[var(--success)]/20 bg-[var(--success-soft)] text-[var(--success)]'
      : normalized === 'FAILED'
        ? 'border-[var(--danger)]/20 bg-[var(--danger-soft)] text-[var(--danger)]'
        : normalized === 'REFUNDED' ||
            normalized === 'PARTIALLY_REFUNDED'
          ? 'border-[var(--warning)]/20 bg-[var(--warning-soft)] text-[var(--warning)]'
          : 'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold',
        tone,
      )}
    >
      <span className="mr-2 size-1.5 rounded-full bg-current" />
      {status.replaceAll('_', ' ')}
    </span>
  );
}

export function BookingPaymentPanel({
  payment,
  className,
}: BookingPaymentPanelProps) {
  return (
    <section
      className={cn(
        'min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6',
        className,
      )}
    >
      <BookingSectionHeader
        title="Payment information"
        description="Payment status, transaction reference, and recorded payment events."
      />

      {payment ? (
        <div className="mt-5 space-y-6">
          <div className="flex flex-col gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <CreditCard
                  className="size-5 text-[var(--foreground-secondary)]"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Payment status
                </p>
                <p className="mt-1 break-all text-xs text-[var(--foreground-secondary)]">
                  {payment.transactionPublicId ??
                    'No transaction reference available'}
                </p>
              </div>
            </div>

            <PaymentStatus status={payment.status} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
              <p className="flex items-center gap-2 text-xs font-medium text-[var(--foreground-secondary)]">
                <Receipt className="size-4" aria-hidden="true" />
                Payment amount
              </p>
              <p className="mt-2 break-words text-lg font-semibold text-[var(--foreground)]">
                {formatMoney(payment.amount, payment.currency)}
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
              <p className="flex items-center gap-2 text-xs font-medium text-[var(--foreground-secondary)]">
                <FileText className="size-4" aria-hidden="true" />
                Transaction reference
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-[var(--foreground)]">
                {payment.transactionPublicId ?? 'Not available'}
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
              <p className="text-xs font-medium text-[var(--foreground-secondary)]">
                Last recorded payment event
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                {formatDate(
                  [
                    payment.authorizedAt,
                    payment.capturedAt,
                    payment.failedAt,
                    payment.refundedAt,
                  ]
                    .filter(
                      (value): value is string =>
                        typeof value === 'string' &&
                        value.trim().length > 0 &&
                        !Number.isNaN(new Date(value).getTime()),
                    )
                    .sort(
                      (a, b) =>
                        new Date(b).getTime() - new Date(a).getTime(),
                    )[0],
                )}
              </p>
            </div>
          </div>

          {payment.failureReason && (
            <div className="rounded-xl border border-[var(--danger)]/20 bg-[var(--danger-soft)] p-4">
              <p className="text-sm font-semibold text-[var(--danger)]">
                Recorded failure reason
              </p>
              <p className="mt-1 break-words text-sm leading-6 text-[var(--foreground)]">
                {payment.failureReason}
              </p>
            </div>
          )}

          <div className="border-t border-[var(--border-subtle)] pt-6">
            <BookingPaymentTimeline payment={payment} />
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--background-subtle)] p-5">
          <div className="flex items-start gap-3">
            <CreditCard
              className="mt-0.5 size-5 shrink-0 text-[var(--foreground-muted)]"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                No payment information
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
                No payment record is available for this booking.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export type { BookingPaymentPanelProps };
