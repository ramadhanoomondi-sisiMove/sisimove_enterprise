
import { Calculator, Info } from 'lucide-react';

import { BookingSectionHeader } from '@/components/admin/bookings/layout';
import { cn } from '@/foundation/utils/cn';

import { BookingPriceBreakdown } from './BookingPriceBreakdown';

interface BookingPricingData {
  pricePerSeat: number;
  seats: number;
  subtotal: number;
  discountAmount: number;
  adjustmentAmount: number;
  totalAmount: number;
  currency: string;
}

interface BookingPricingPanelProps {
  pricing: BookingPricingData | null | undefined;
  className?: string;
}

export function BookingPricingPanel({
  pricing,
  className,
}: BookingPricingPanelProps) {
  return (
    <section
      className={cn(
        'min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6',
        className,
      )}
    >
      <BookingSectionHeader
        title="Pricing breakdown"
        description="The amounts recorded when this booking was priced."
      />

      {pricing ? (
        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--foreground-secondary)]">
                <Calculator
                  className="size-4"
                  aria-hidden="true"
                />
                Price per seat
              </div>
              <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                {pricing.pricePerSeat.toLocaleString('en-KE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                <span className="text-xs font-medium text-[var(--foreground-secondary)]">
                  {pricing.currency}
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4">
              <div className="text-xs font-medium text-[var(--foreground-secondary)]">
                Seats priced
              </div>
              <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                {pricing.seats}
              </p>
            </div>
          </div>

          <BookingPriceBreakdown
            currency={pricing.currency}
            total={pricing.totalAmount}
            items={[
              { label: 'Subtotal', amount: pricing.subtotal },
              { label: 'Discount', amount: pricing.discountAmount },
              { label: 'Adjustment', amount: pricing.adjustmentAmount },
            ]}
          />
        </div>
      ) : (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--background-subtle)] p-5">
          <Info
            className="mt-0.5 size-5 shrink-0 text-[var(--foreground-muted)]"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              No pricing information
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
              Pricing details have not been recorded for this booking.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export type { BookingPricingPanelProps };
