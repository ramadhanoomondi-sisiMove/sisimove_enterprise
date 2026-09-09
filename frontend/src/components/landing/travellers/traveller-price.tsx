// -----------------------------------------------------------------------------
// sisiMove — Traveller Price
// -----------------------------------------------------------------------------
//
// Presentation component for a public journey or demand price.
//
// Responsibilities:
// - Render a server-authoritative public price.
// - Format integer minor-unit amounts using the foundation currency formatter.
// - Provide optional presentation labels and suffixes.
//
// This component does not:
// - calculate prices;
// - calculate commissions;
// - calculate booking fees;
// - apply discounts;
// - perform Commercial logic;
// - access Financial or Wallet data;
// - determine whether a price is valid for a corridor.
//
// Public pricing is supplied by the Journey/Journey Demand projection.
// Commercial and Financial information must never be passed into this
// presentation component.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  formatCurrencyMinorUnits,
} from '../../../foundation/formatters';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TravellerPriceSize =
  | 'sm'
  | 'md'
  | 'lg';

export interface TravellerPriceProps {
  /**
   * Public price amount in integer minor units.
   *
   * Example:
   * KES 1,500.00 is represented according to the currency's
   * minor-unit convention, rather than as the display amount.
   */
  readonly amount: number | null | undefined;

  /**
   * ISO 4217 currency code.
   *
   * Example: KES.
   */
  readonly currency?: string;

  /**
   * Optional custom label displayed before the amount.
   *
   * Example: "From".
   */
  readonly label?: ReactNode;

  /**
   * Optional content displayed after the formatted amount.
   *
   * Example: "/ seat".
   */
  readonly suffix?: ReactNode;

  /**
   * Optional presentation-only content displayed before the price.
   */
  readonly leadingContent?: ReactNode;

  /**
   * Presentation size.
   */
  readonly size?: TravellerPriceSize;

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeAmount(
  amount: number | null | undefined,
): number | null {
  if (
    amount === null ||
    amount === undefined ||
    !Number.isFinite(amount) ||
    amount < 0
  ) {
    return null;
  }

  return Math.trunc(amount);
}

function normalizeCurrency(
  currency: string | undefined,
): string {
  const normalized =
    currency?.trim().toUpperCase();

  return normalized || 'KES';
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerPrice({
  amount,
  currency = 'KES',
  label,
  suffix = '/ seat',
  leadingContent,
  size = 'md',
  className,
}: TravellerPriceProps) {
  const normalizedAmount =
    normalizeAmount(amount);

  if (normalizedAmount === null) {
    return null;
  }

  const normalizedCurrency =
    normalizeCurrency(currency);

  const formattedAmount =
    formatCurrencyMinorUnits(
      normalizedAmount,
      normalizedCurrency,
    );

  const textSize =
    size === 'sm'
      ? 'text-sm'
      : size === 'lg'
        ? 'text-xl'
        : 'text-base';

  const secondaryTextSize =
    size === 'lg'
      ? 'text-sm'
      : 'text-xs';

  return (
    <div
      className={cn(
        'inline-flex',
        'min-w-0',
        'items-baseline',
        'gap-1.5',
        className,
      )}
    >
      {leadingContent && (
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex',
            'shrink-0',
            'items-center',
            'self-center',
            'text-[var(--foreground-muted)]',
          )}
        >
          {leadingContent}
        </span>
      )}

      {label && (
        <span
          className={cn(
            'shrink-0',
            'text-[var(--foreground-muted)]',
            secondaryTextSize,
          )}
        >
          {label}
        </span>
      )}

      <span
        className={cn(
          'font-semibold',
          'tabular-nums',
          'text-[var(--foreground)]',
          textSize,
        )}
      >
        {formattedAmount}
      </span>

      {suffix && (
        <span
          className={cn(
            'shrink-0',
            'text-[var(--foreground-muted)]',
            secondaryTextSize,
          )}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}