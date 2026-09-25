// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Pricing
// -----------------------------------------------------------------------------
//
// Presentation of the historical pricing snapshot captured when the booking
// was created.
//
// Responsibilities:
// - Present the price per seat.
// - Present the booked seat count.
// - Present the historical subtotal.
// - Present discounts and adjustments.
// - Present the backend-calculated booking total.
// - Present the booking currency.
//
// Non-responsibilities:
// - Recalculating monetary values.
// - Applying discounts.
// - Applying pricing adjustments.
// - Reading current Journey pricing.
// - Initiating payment.
// - Managing booking lifecycle.
//
// IMPORTANT:
//
// The backend JourneyBooking aggregate is authoritative for all monetary
// calculations and pricing invariants. This component must therefore render
// the supplied values exactly as provided by the API model.
// -----------------------------------------------------------------------------

import type { JourneyBookingPricing } from '@/features/journey-booking/models';
export interface JourneyBookingPricingProps {
  pricing: JourneyBookingPricing;
  className?: string;
}

export function JourneyBookingPricing({
  pricing,
  className,
}: JourneyBookingPricingProps) {
  return (
    <section
      aria-labelledby="journey-booking-pricing-title"
      className={[
        'flex',
        'flex-col',
        'gap-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
          Booking price
        </p>

        <h2
          id="journey-booking-pricing-title"
          className="mt-1 text-base font-semibold text-[var(--foreground)]"
        >
          Pricing
        </h2>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        <div className="divide-y divide-[var(--border-subtle)]">
          <PricingRow
            label="Price per seat"
            value={formatMoney(pricing.pricePerSeat, pricing.currency)}
          />

          <PricingRow
            label="Seats"
            value={String(pricing.seats)}
          />

          <PricingRow
            label="Subtotal"
            value={formatMoney(pricing.subtotal, pricing.currency)}
          />

          {pricing.discountAmount !== 0 && (
            <PricingRow
              label="Discount"
              value={formatSignedMoney(
                -pricing.discountAmount,
                pricing.currency,
              )}
              valueClassName="text-[var(--success)]"
            />
          )}

          {pricing.adjustmentAmount !== 0 && (
            <PricingRow
              label="Adjustment"
              value={formatSignedMoney(
                pricing.adjustmentAmount,
                pricing.currency,
              )}
            />
          )}

          <div className="flex items-center justify-between gap-4 bg-[var(--background-muted)] px-4 py-4">
            <span className="text-sm font-semibold text-[var(--foreground)]">
              Total
            </span>

            <span className="text-base font-semibold text-[var(--foreground)]">
              {formatMoney(pricing.totalAmount, pricing.currency)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs leading-5 text-[var(--foreground-muted)]">
        This is the pricing captured when the booking was created. It is not
        recalculated from the current Journey price.
      </p>
    </section>
  );
}

interface PricingRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function PricingRow({
  label,
  value,
  valueClassName,
}: PricingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-sm text-[var(--foreground-secondary)]">
        {label}
      </span>

      <span
        className={[
          'text-sm',
          'font-medium',
          'text-[var(--foreground)]',
          valueClassName ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Formats a monetary amount using the frontend's integer monetary convention.
 *
 * The API model stores the smallest currency unit. For currencies such as KES
 * this means the value is divided by 100 for display.
 *
 * No pricing calculation is performed here; this is display formatting only.
 */
function formatMoney(
  amount: number,
  currency: string,
): string {
  return formatCurrency(amount / 100, currency);
}

function formatSignedMoney(
  amount: number,
  currency: string,
): string {
  const absoluteValue = formatMoney(Math.abs(amount), currency);

  if (amount > 0) {
    return `+${absoluteValue}`;
  }

  if (amount < 0) {
    return `-${absoluteValue}`;
  }

  return formatMoney(0, currency);
}

function formatCurrency(
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