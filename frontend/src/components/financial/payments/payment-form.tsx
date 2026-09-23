// -----------------------------------------------------------------------------
// sisiMove — Financial Payment Form
// -----------------------------------------------------------------------------
//
// Presentation component for initiating a wallet top-up.
//
// Financial boundary:
//
//     PaymentPageContainer
//             │
//             ├── Financial Payment hooks
//             ├── Financial Payment Method hooks
//             │
//             ↓
//       PaymentForm
//             │
//             ├── amount input
//             ├── payment method selection
//             └── submit action
//
// This component intentionally does NOT:
// - call the Financial Payment API;
// - use React Query hooks;
// - load payment methods;
// - create a payment;
// - perform navigation;
// - decide payment authorization;
// - contain payment-domain business rules.
//
// The parent/container owns those concerns and supplies the form with the
// current values and available options.
//
// Existing global primitives are reused rather than recreated:
// - Input
// - Button
//
// Currency amounts remain integer minor units at the feature/domain boundary.
// The form receives and emits minor-unit values rather than introducing a
// second monetary representation.
// -----------------------------------------------------------------------------

'use client';

import type { FormEvent } from 'react';

import { Button, Input } from '@/components/ui';

export interface PaymentMethodOption {
  /**
   * Stable public identifier for the selected payment method.
   *
   * This is intentionally opaque to the presentation component.
   */
  id: string;

  /**
   * Human-readable payment method label.
   *
   * Example:
   *     M-PESA
   *     Bank
   */
  label: string;

  /**
   * Optional masked account detail.
   *
   * Example:
   *     •••• 1234
   *     +254 7XX XXX XXX
   */
  description?: string;

  /**
   * Whether this method is currently the member's default method.
   *
   * The form does not use this to make business decisions. It is purely
   * presentation metadata supplied by the parent.
   */
  isDefault?: boolean;
}

export interface PaymentFormProps {
  /**
   * Current amount in integer minor units.
   *
   * For KES:
   *
   *     1,000.00 KES → 100000
   */
  amountMinorUnits: number;

  /**
   * Current payment-method selection.
   */
  paymentMethodPublicId: string;

  /**
   * Available payment methods supplied by the parent/container.
   */
  paymentMethods: PaymentMethodOption[];

  /**
   * Currency displayed beside the amount field.
   *
   * The actual backend currency remains part of the financial feature
   * contract. This prop controls presentation only.
   */
  currency?: string;

  /**
   * Optional field-level validation message.
   */
  amountError?: string;

  /**
   * Optional payment-method validation message.
   */
  paymentMethodError?: string;

  /**
   * Whether the payment operation is currently being submitted.
   */
  isSubmitting?: boolean;

  /**
   * Whether the form may currently be submitted.
   *
   * The parent owns domain/business validation. The form only consumes the
   * resulting state.
   */
  isSubmitDisabled?: boolean;

  /**
   * Amount change callback.
   *
   * The parent/container remains responsible for converting the input into
   * the feature's integer minor-unit representation.
   */
  onAmountChange: (amountMinorUnits: number) => void;

  /**
   * Payment-method selection callback.
   */
  onPaymentMethodChange: (paymentMethodPublicId: string) => void;

  /**
   * Form submission callback.
   */
  onSubmit: () => void;

  /**
   * Optional cancellation action.
   *
   * The form does not know where cancellation navigates.
   */
  onCancel?: () => void;
}

/**
 * Convert an integer minor-unit amount into a user-editable decimal string.
 *
 * This helper deliberately stays local to the form because it is an input
 * representation concern, not a replacement for the application's canonical
 * currency formatter.
 */
function formatAmountInput(amountMinorUnits: number): string {
  if (!Number.isFinite(amountMinorUnits)) {
    return '';
  }

  return (amountMinorUnits / 100).toFixed(2);
}

/**
 * Parse the user's decimal input into integer minor units.
 *
 * Invalid input is represented as zero here. Actual validation remains the
 * responsibility of the feature schema/container.
 */
function parseAmountInput(value: string): number {
  const normalized = value.replace(/,/g, '').trim();

  if (!normalized) {
    return 0;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.round(parsed * 100);
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
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      {/* ---------------------------------------------------------------------
          Amount
         --------------------------------------------------------------------- */}
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
            inputMode="decimal"
            autoComplete="off"
            value={formatAmountInput(amountMinorUnits)}
            onChange={(event) => {
              onAmountChange(parseAmountInput(event.target.value));
            }}
            aria-invalid={Boolean(amountError)}
            aria-describedby={
              amountError
                ? 'wallet-top-up-amount-error'
                : undefined
            }
            disabled={isSubmitting}
            className="pl-16 text-base sm:text-lg"
          />
        </div>

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

      {/* ---------------------------------------------------------------------
          Payment method
         --------------------------------------------------------------------- */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-[var(--foreground)]">
          Payment method
        </legend>

        <div className="space-y-2">
          {paymentMethods.map((method) => {
            const selected =
              paymentMethodPublicId === method.id;

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
                  onChange={() => {
                    onPaymentMethodChange(method.id);
                  }}
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
          <p
            role="alert"
            className="text-sm text-[var(--danger)]"
          >
            {paymentMethodError}
          </p>
        ) : null}
      </fieldset>

      {/* ---------------------------------------------------------------------
          Actions
         --------------------------------------------------------------------- */}
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