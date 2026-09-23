// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing Form
// -----------------------------------------------------------------------------
//
// Pricing form for Journey creation.
//
// Architectural rules:
// - JourneyPricing is a child entity of Journey.
// - There is no pricing catalogue.
// - The provider declares the passenger contribution for this Journey.
// - The provider does not select an existing pricing definition.
// - `amount` and `currency` are Journey pricing data.
// - The backend remains authoritative and must validate the submitted pricing.
//
// sisiMove pricing represents the passenger contribution toward the shared
// travel cost. It is not presented as provider profit.
//
// Responsibilities:
// - Capture the passenger contribution amount.
// - Capture the currency.
// - Display the resulting contribution clearly.
// - Delegate submission to the parent.
//
// Non-responsibilities:
// - No API calls.
// - No pricing catalogue fetching.
// - No router usage.
// - No persistence.
// - No pricing mutation.
// - No commission calculation.
// - No payment processing.
// - No backend business-rule enforcement.
//
// Backend write operation:
//
// POST /journeys/:journeyPublicId/pricing
//
// Request:
//
// {
//   amount: number,
//   currency: string
// }
//
// -----------------------------------------------------------------------------

'use client';

import {
  useState,
  type FormEvent,
} from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// =============================================================================
// Types
// =============================================================================

export interface JourneyPricingFormValue {
  /**
   * Passenger contribution amount.
   *
   * The backend owns the authoritative monetary representation.
   */
  amount: number;

  /**
   * ISO currency code.
   *
   * The backend remains authoritative over supported currencies.
   */
  currency: string;
}

export interface JourneyPricingFormProps {
  /**
   * Existing Journey pricing, useful when editing or resuming a draft.
   */
  defaultValue?: JourneyPricingFormValue;

  /**
   * Called after the provider submits valid pricing data.
   */
  onSubmit: (
    value: JourneyPricingFormValue,
  ) => void | Promise<void>;

  /**
   * Indicates that the parent is persisting the pricing.
   */
  isLoading?: boolean;

  /**
   * Optional error supplied by the parent/application layer.
   */
  error?: string | null;
}

// =============================================================================
// Constants
// =============================================================================

const DEFAULT_CURRENCY = 'KES';

// =============================================================================
// Helpers
// =============================================================================

function formatAmount(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

// =============================================================================
// Component
// =============================================================================

export function JourneyPricingForm({
  defaultValue,
  onSubmit,
  isLoading = false,
  error = null,
}: JourneyPricingFormProps) {
  // ---------------------------------------------------------------------------
  // Local form state
  // ---------------------------------------------------------------------------
  //
  // Keep the amount as a string while editing so that an empty input can be
  // represented naturally. Convert to a number only at submission time.
  //
  const [amount, setAmount] = useState(
    defaultValue?.amount?.toString() ?? '',
  );

  const [currency, setCurrency] = useState(
    defaultValue?.currency ?? DEFAULT_CURRENCY,
  );

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const parsedAmount = Number(amount);

  const hasValidAmount =
    amount.trim() !== '' &&
    Number.isInteger(parsedAmount) &&
    parsedAmount > 0;

  const normalizedCurrency = currency.trim().toUpperCase();

  const hasValidCurrency =
    normalizedCurrency.length === 3;

  const canSubmit =
    hasValidAmount &&
    hasValidCurrency &&
    !isLoading;

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    await onSubmit({
      amount: parsedAmount,
      currency: normalizedCurrency,
    });
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Passenger contribution                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <div>
          <label
            htmlFor="journey-pricing-amount"
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            Passenger contribution
          </label>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            How much should each passenger contribute toward the
            shared cost of this journey?
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-3">
          <input
            id="journey-pricing-amount"
            name="amount"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
            }}
            disabled={isLoading}
            placeholder="e.g. 1500"
            aria-describedby="journey-pricing-amount-help"
            className="block w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-muted)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <input
            id="journey-pricing-currency"
            name="currency"
            type="text"
            value={currency}
            onChange={(event) => {
              setCurrency(
                event.target.value.toUpperCase(),
              );
            }}
            disabled={isLoading}
            maxLength={3}
            autoCapitalize="characters"
            autoComplete="off"
            aria-label="Currency"
            className="w-20 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-center text-sm font-medium uppercase text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-muted)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <p
          id="journey-pricing-amount-help"
          className="text-xs text-[var(--foreground-muted)]"
        >
          Enter the contribution amount and its three-letter
          currency code.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Pricing summary                                                     */}
      {/* ------------------------------------------------------------------ */}

      {hasValidAmount && hasValidCurrency ? (
        <Card className="p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Passenger contribution
          </p>

          <p className="mt-1 text-xl font-semibold text-[var(--foreground)]">
            {formatAmount(
              parsedAmount,
              normalizedCurrency,
            )}
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Each passenger contributes this amount toward the
            shared cost of the journey.
          </p>
        </Card>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Parent/application error                                             */}
      {/* ------------------------------------------------------------------ */}

      {error ? (
        <p
          role="alert"
          className="rounded-lg bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
        >
          {error}
        </p>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Form action                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex justify-end border-t border-[var(--border-subtle)] pt-4">
        <Button
          type="submit"
          disabled={!canSubmit}
        >
          {isLoading
            ? 'Saving…'
            : 'Continue'}
        </Button>
      </div>
    </form>
  );
}
