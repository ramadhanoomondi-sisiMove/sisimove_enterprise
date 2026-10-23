
'use client';

/**
 * sisiMove — Journey Pricing Panel
 *
 * Displays the fare pricing configured for a journey.
 *
 * Responsibilities:
 * - Present the journey price and currency.
 * - Format monetary values for readability.
 * - Display the pricing record identifier when requested.
 * - Handle invalid or missing pricing values gracefully.
 *
 * This component is presentation-only. It does not calculate, charge,
 * or modify fares.
 */

import { useMemo } from 'react';
import {
  Banknote,
  CircleAlert,
  Coins,
  Fingerprint,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { Journey } from '@/features/admin/journeys/models/journey.model';

export interface JourneyPricingPanelProps {
  journey: Pick<Journey, 'pricing'>;
  className?: string;
  compact?: boolean;
  showPricingId?: boolean;
}

function formatAmount(amount: number, currency: string): string | null {
  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default function JourneyPricingPanel({
  journey,
  className,
  compact = false,
  showPricingId = true,
}: JourneyPricingPanelProps) {
  const { amount, currency, publicId } = journey.pricing;

  const normalizedCurrency = currency?.trim().toUpperCase() ?? '';

  const formattedAmount = useMemo(
    () =>
      normalizedCurrency
        ? formatAmount(amount, normalizedCurrency)
        : null,
    [amount, normalizedCurrency],
  );

  const pricingIsValid =
    Number.isFinite(amount) &&
    amount >= 0 &&
    normalizedCurrency.length === 3;

  return (
    <section
      aria-labelledby="journey-pricing-heading"
      className={cn('min-w-0 space-y-4', className)}
    >
      <header className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <Coins aria-hidden="true" className="size-5" />
        </span>

        <div className="min-w-0">
          <h2
            id="journey-pricing-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Journey pricing
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Fare amount configured for this journey
          </p>
        </div>
      </header>

      <div
        className={cn(
          'rounded-2xl border border-[var(--border)] bg-[var(--surface)]',
          compact ? 'p-4' : 'p-5',
        )}
      >
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
            <Banknote aria-hidden="true" className="size-5" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-[var(--foreground-muted)]">
              Journey fare
            </p>

            {pricingIsValid && formattedAmount ? (
              <p className="mt-1 break-words text-2xl font-semibold tabular-nums text-[var(--foreground)]">
                {formattedAmount}
              </p>
            ) : (
              <p className="mt-1 text-sm font-medium text-[var(--danger)]">
                Pricing unavailable
              </p>
            )}

            <p className="mt-2 text-xs text-[var(--foreground-muted)]">
              Currency: {normalizedCurrency || 'Not specified'}
            </p>
          </div>
        </div>

        {showPricingId && (
          <div className="mt-4 flex items-start gap-2 border-t border-[var(--border)] pt-3">
            <Fingerprint
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[var(--foreground-muted)]"
            />

            <div className="min-w-0">
              <p className="text-xs text-[var(--foreground-muted)]">
                Pricing public ID
              </p>

              <p className="mt-1 break-all font-mono text-xs text-[var(--foreground-secondary)]">
                {publicId?.trim() || 'Not available'}
              </p>
            </div>
          </div>
        )}
      </div>

      {!pricingIsValid && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning-soft)] p-4"
        >
          <CircleAlert
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-[var(--warning)]"
          />

          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              Pricing needs verification
            </p>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              The recorded amount or currency is invalid. Verify the pricing
              record before relying on this fare.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
