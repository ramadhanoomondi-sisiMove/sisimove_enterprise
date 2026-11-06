// =============================================================================
// sisiMove — Financial Payment Form
// =============================================================================
//
// Presentation component for initiating a wallet top-up.
//
// Amount boundary:
// - The member enters whole KES amounts only (major currency units).
// - The parent/container contract remains amountMinorUnits.
// - KES 100 entered here is emitted as 10000 minor units.
// - Decimal input is not accepted.
//
// The parent/container owns API calls, validation, payment-method loading,
// navigation, and payment lifecycle handling.
// =============================================================================

'use client';

import type { FormEvent } from 'react';

import { Button, Input } from '@/components/ui';

export interface PaymentMethodOption {
  /** Stable public identifier for the selected payment method. */
  id: string;

  /** Human-readable payment method label, e.g. M-PESA or Bank. */
  label: string;

  /** Optional masked account detail. */
  description?: string;

  /** Presentation metadata supplied by the parent. */
  isDefault?: boolean;
}

export interface PaymentFormProps {
  /**
   * Current amount in integer minor units, matching the container/API contract.
   * Example: 10000 represents KES 100.
   */
  amountMinorUnits: number;

  /** Current payment-method selection. */
  paymentMethodPublicId: string;

  /** Available payment methods supplied by the parent/container. */
  paymentMethods: PaymentMethodOption[];

  /** Currency displayed beside the amount field. */
  currency?: string;

  /** Optional field-level validation message. */
  amountError?: string;

  /** Optional payment-method validation message. */
  paymentMethodError?: string;

  /** Whether the payment operation is currently being submitted. */
  isSubmitting?: boolean;

  /** Whether the parent currently disables submission. */
  isSubmitDisabled?: boolean;

  /** Emits an integer amount in minor units. */
  onAmountChange: (amountMinorUnits: number) => void;

  /** Payment-method selection callback. */
  onPaymentMethodChange: (paymentMethodPublicId: string) => void;

  /** Form submission callback. */
  onSubmit: () => void;

  /** Optional cancellation action. */
  onCancel?: () => void;
}

/**
 * Convert the container's minor-unit amount into the whole-KES field value.
 * A non-whole-KES amount is not displayed because this form accepts integers.
 */
function formatAmountInput(amountMinorUnits: number): string {
  if (
    !Number.isSafeInteger(amountMinorUnits) ||
    amountMinorUnits <= 0 ||
    amountMinorUnits % 100 !== 0
  ) {
    return '';
  }

  return String(amountMinorUnits / 100);
}

/**
 * Convert a whole-KES input into integer minor units.
 * Empty or invalid input maps to zero; decimal input is never accepted.
 */
function parseAmountInput(value: string): number {
  if (value.length === 0) {
    return 0;
  }

  if (!/^\d+$/.test(value)) {
    return 0;
  }

  const wholeKes = Number(value);

  if (!Number.isSafeInteger(wholeKes) || wholeKes <= 0) {
    return 0;
  }

  const amountMinorUnits = wholeKes * 100;

  return Number.isSafeInteger(amountMinorUnits)
    ? amountMinorUnits
    : 0;
}

export function PaymentForm({
  amountMinorUnits,
  paymentMethodPublicId,
  paymentMethods,
  currency = 'KES',
  amountError,
  paymentMethodError,
  isSubmitting = false,
  isSubmitDisabled = false,
  onAmountChange,
  onPaymentMethodChange,
  onSubmit,
  onCancel,
}: PaymentFormProps) {
  function handleAmountChange(value: string) {
    // Accept only digits while allowing the field to be temporarily empty.
    // Reject invalid input rather than replacing the current value with zero.
    if (!/^\d*$/.test(value)) {
      return;
    }

    onAmountChange(parseAmountInput(value));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Amount */}
      <div className="space-y-2">
        <label
          htmlFor="wallet-top-up-amount"
          className="block text-sm font-semibold text-[var(--foreground)]"
        >
          Amount
        </label>

        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-[var(--foreground-muted)]"
          >
            {currency}
          </span>

          <Input
            id="wallet-top-up-amount"
            name="amount"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            value={formatAmountInput(amountMinorUnits)}
            onChange={(event) => handleAmountChange(event.target.value)}
            aria-invalid={Boolean(amountError)}
            aria-describedby={
              amountError ? 'wallet-top-up-amount-error' : undefined
            }
            disabled={isSubmitting}
            className="pl-16 text-base sm:text-lg"
          />
        </div>

        <p className="text-xs text-[var(--foreground-muted)]">
          Enter a whole amount in KES. Decimals are not accepted.
        </p>

        {amountError ? (
          <p
            id="wallet-top-up-amount-error"
            role="alert"
            className="text-sm text-[var(--danger)]"
          >
            {amountError}
          </p>
        ) : null}
      </div>

      {/* Payment method */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-[var(--foreground)]">
          Payment method
        </legend>

        <div className="space-y-2">
          {paymentMethods.map((method) => {
            const selected = paymentMethodPublicId === method.id;

            return (
              <label
                key={method.id}
                className={[
                  'flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)]',
                  'border bg-[var(--surface)] p-4 transition-colors',
                  selected
                    ? 'border-[var(--brand)] bg-[var(--brand-soft)]'
                    : 'border-[var(--border)]',
                  isSubmitting
                    ? 'cursor-not-allowed opacity-60'
                    : 'hover:border-[var(--border-strong)]',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={method.id}
                  checked={selected}
                  onChange={() => onPaymentMethodChange(method.id)}
                  disabled={isSubmitting}
                  className="size-4 accent-[var(--brand)]"
                />

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      {method.label}
                    </span>

                    {method.isDefault ? (
                      <span className="text-xs font-medium text-[var(--brand)]">
                        Default
                      </span>
                    ) : null}
                  </span>

                  {method.description ? (
                    <span className="mt-1 block text-sm text-[var(--foreground-muted)]">
                      {method.description}
                    </span>
                  ) : null}
                </span>
              </label>
            );
          })}
        </div>

        {paymentMethodError ? (
          <p role="alert" className="text-sm text-[var(--danger)]">
            {paymentMethodError}
          </p>
        ) : null}
      </fieldset>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="min-h-11 w-full sm:w-auto"
          >
            Cancel
          </Button>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting || isSubmitDisabled}
          className="min-h-11 w-full sm:w-auto"
        >
          {isSubmitting ? 'Processing…' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}

export default PaymentForm;