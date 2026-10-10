// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Detail Payment
// -----------------------------------------------------------------------------
//
// Presentation of the payment state associated with a Journey Booking.
//
// Responsibilities:
// - Present the payment lifecycle status.
// - Present the payment amount and currency.
// - Present the transaction reference when available.
// - Present relevant payment timestamps.
// - Present a server-provided failure reason when available.
//
// Non-responsibilities:
// - Initiating payment.
// - Authorizing, capturing, failing, or refunding payments.
// - Inferring payment success from booking status.
// - Recalculating the payment amount.
// - Managing payment methods.
//
// IMPORTANT:
//
// Payment status is server-authoritative. The frontend must never transition
// payment state locally.
//
// Also note that JourneyBookingDetailPayment.amount represents the amount
// associated with the payment transaction. It should not be assumed to equal
// JourneyBookingDetailPricing.totalAmount because additional commercial
// amounts may be applicable to the passenger payment.
// -----------------------------------------------------------------------------

import { Badge, type BadgeVariant } from '@/components/ui';

import type { JourneyBookingDetailPayment } from '@/features/journey-booking/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBookingPaymentProps {
  payment: JourneyBookingDetailPayment;
  className?: string;
}

// -----------------------------------------------------------------------------
// Payment Status
// -----------------------------------------------------------------------------

const PAYMENT_STATUS_LABELS: Record<
  JourneyBookingDetailPayment['status'],
  string
> = {
  PENDING: 'Pending',
  AUTHORIZED: 'Authorized',
  CAPTURED: 'Paid',
  FAILED: 'Failed',
  PARTIALLY_REFUNDED: 'Partially refunded',
  REFUNDED: 'Refunded',
};

const PAYMENT_STATUS_VARIANTS: Record<
  JourneyBookingDetailPayment['status'],
  BadgeVariant
> = {
  PENDING: 'warning',
  AUTHORIZED: 'brand',
  CAPTURED: 'success',
  FAILED: 'danger',
  PARTIALLY_REFUNDED: 'warning',
  REFUNDED: 'default',
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBookingPayment({
  payment,
  className,
}: JourneyBookingPaymentProps) {
  return (
    <section
      aria-labelledby="journey-booking-payment-title"
      className={[
        'flex',
        'flex-col',
        'gap-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* -------------------------------------------------------------------
          Section heading
          ------------------------------------------------------------------- */}

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
          Payment
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h2
            id="journey-booking-payment-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Payment status
          </h2>

          <Badge
            variant={PAYMENT_STATUS_VARIANTS[payment.status]}
            size="sm"
            aria-label={`Payment status: ${PAYMENT_STATUS_LABELS[payment.status]}`}
          >
            {PAYMENT_STATUS_LABELS[payment.status]}
          </Badge>
        </div>
      </div>

      {/* -------------------------------------------------------------------
          Payment details
          ------------------------------------------------------------------- */}

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        <div className="divide-y divide-[var(--border-subtle)]">
          <PaymentRow
            label="Amount"
            value={formatMoney(
              payment.amount,
              payment.currency,
            )}
            emphasized
          />

          <PaymentRow
            label="Currency"
            value={payment.currency}
          />

          {payment.transactionPublicId && (
            <PaymentRow
              label="Transaction"
              value={payment.transactionPublicId}
              mono
            />
          )}

          {payment.authorizedAt && (
            <PaymentRow
              label="Authorized"
              value={formatDateTime(payment.authorizedAt)}
            />
          )}

          {payment.capturedAt && (
            <PaymentRow
              label="Captured"
              value={formatDateTime(payment.capturedAt)}
            />
          )}

          {payment.failedAt && (
            <PaymentRow
              label="Failed"
              value={formatDateTime(payment.failedAt)}
            />
          )}

          {payment.refundedAt && (
            <PaymentRow
              label="Refunded"
              value={formatDateTime(payment.refundedAt)}
            />
          )}

          {payment.failureReason && (
            <div className="bg-[var(--danger-soft)] px-4 py-3">
              <p className="text-xs font-medium text-[var(--danger)]">
                Payment issue
              </p>

              <p className="mt-1 break-words text-sm text-[var(--foreground)]">
                {payment.failureReason}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Payment Row
// -----------------------------------------------------------------------------

interface PaymentRowProps {
  label: string;
  value: string;
  emphasized?: boolean;
  mono?: boolean;
}

function PaymentRow({
  label,
  value,
  emphasized = false,
  mono = false,
}: PaymentRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-sm text-[var(--foreground-secondary)]">
        {label}
      </span>

      <span
        className={[
          'min-w-0',
          'max-w-[65%]',
          'truncate',
          emphasized
            ? 'text-base font-semibold'
            : 'text-sm font-medium',
          'text-[var(--foreground)]',
          mono ? 'font-mono text-xs' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

/**
 * Formats the monetary amount supplied by the API for display.
 *
 * The API model already provides the monetary amount in the currency's
 * normal major unit. No payment or pricing calculation is performed here;
 * this is display formatting only.
 */
function formatMoney(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}