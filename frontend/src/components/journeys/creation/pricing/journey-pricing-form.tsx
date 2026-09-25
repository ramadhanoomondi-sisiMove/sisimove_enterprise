// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing Form
// -----------------------------------------------------------------------------
//
// Presentation-only form for configuring Journey pricing.
//
// Responsibilities:
// - Collect the Journey price amount.
// - Collect the Journey currency.
// - Keep editable values local to the form.
// - Emit changed values through onChange.
// - Emit the complete pricing configuration through onSubmit.
//
// This component does NOT:
// - Call the Journey API.
// - Create a JourneyPricing entity.
// - Generate pricing identifiers.
// - Calculate commission.
// - Calculate provider income.
// - Convert currencies.
// - Format monetary values for settlement.
// - Decide financial/business rules.
// - Validate Journey lifecycle rules.
// - Own navigation.
//
// The route/workflow owner is responsible for persistence through the Journey
// pricing mutation.
// -----------------------------------------------------------------------------

'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import { Input } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyPricingFormInitialValue {
  /**
   * Existing Journey price amount.
   */
  amount?: number;

  /**
   * Existing Journey currency code.
   */
  currency?: string;
}

export interface JourneyPricingFormSubmitValue {
  /**
   * Journey price amount.
   *
   * The value is passed to the backend without frontend-side commission
   * calculation or monetary transformation.
   */
  amount: number;

  /**
   * Currency code for the Journey price.
   */
  currency: string;
}

export interface JourneyPricingFormProps {
  /**
   * Existing Journey pricing used to initialise the form.
   */
  initialValue?: JourneyPricingFormInitialValue;

  /**
   * Disables the form while persistence is in progress.
   */
  disabled?: boolean;

  /**
   * Called whenever the user changes a pricing value.
   */
  onChange?: (
    value: Partial<JourneyPricingFormSubmitValue>,
  ) => void;

  /**
   * Called when the complete form is submitted.
   */
  onSubmit?: (
    value: JourneyPricingFormSubmitValue,
  ) => void | Promise<void>;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function toAmountInputValue(
  value?: number,
): string {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return '';
  }

  return String(value);
}

function parseAmount(
  value: string,
): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);

  if (
    !Number.isFinite(parsed) ||
    parsed <= 0
  ) {
    return null;
  }

  return parsed;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyPricingForm({
  initialValue,
  disabled = false,
  onChange,
  onSubmit,
}: JourneyPricingFormProps) {
  const [amount, setAmount] =
    useState(() =>
      toAmountInputValue(
        initialValue?.amount,
      ),
    );

  const [currency, setCurrency] =
    useState(
      () =>
        initialValue?.currency ??
        'KES',
    );

  function handleAmountChange(
    value: string,
  ) {
    setAmount(value);

    const parsed =
      parseAmount(value);

    if (parsed === null) {
      onChange?.({
        amount: undefined,
      });

      return;
    }

    onChange?.({
      amount: parsed,
    });
  }

  function handleCurrencyChange(
    value: string,
  ) {
    setCurrency(value);

    onChange?.({
      currency: value,
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const parsedAmount =
      parseAmount(amount);

    const normalizedCurrency =
      currency.trim().toUpperCase();

    if (
      parsedAmount === null ||
      !normalizedCurrency
    ) {
      return;
    }

    await onSubmit?.({
      amount: parsedAmount,
      currency: normalizedCurrency,
    });
  }

  const hasValidAmount =
    parseAmount(amount) !== null;

  const hasValidCurrency =
    currency.trim().length > 0;

  return (
    <form
      id="journey-pricing-form"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Input
        id="journey-pricing-amount"
        label="Passenger contribution"
        helperText="Enter the amount each passenger will contribute toward this Journey."
        type="number"
        name="amount"
        min={0.01}
        step="0.01"
        inputMode="decimal"
        value={amount}
        onChange={(event) =>
          handleAmountChange(
            event.target.value,
          )
        }
        disabled={disabled}
        required
      />

      <Input
        id="journey-pricing-currency"
        label="Currency"
        helperText="Enter the three-letter currency code used for this Journey price."
        type="text"
        name="currency"
        value={currency}
        onChange={(event) =>
          handleCurrencyChange(
            event.target.value,
          )
        }
        disabled={disabled}
        required
        maxLength={3}
        minLength={3}
        placeholder="KES"
        autoComplete="off"
        spellCheck={false}
        className="uppercase"
      />

      <button
        type="submit"
        disabled={
          disabled ||
          !hasValidAmount ||
          !hasValidCurrency
        }
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      >
        Save pricing
      </button>
    </form>
  );
}