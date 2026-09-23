'use client';

// -----------------------------------------------------------------------------
// sisiMove — Payment Method Selector
// -----------------------------------------------------------------------------
//
// Presentation component for selecting the payment method used for a wallet
// top-up.
//
// Responsibilities:
// - Render available payment methods.
// - Show the currently selected method.
// - Identify the default payment method.
// - Surface a field-level selection error.
// - Notify the parent when selection changes.
//
// Architecture:
//
//     Payment Container / Page
//              │
//              ▼
//     PaymentMethodSelector
//              │
//              ├── Badge
//              └── controlled selection
//
// This component intentionally does NOT:
// - fetch payment methods;
// - create payment methods;
// - set a default payment method;
// - call payment APIs;
// - navigate;
// - own application state.
//
// The parent/container owns the selected payment method and application
// orchestration.
//
// -----------------------------------------------------------------------------

import { Badge } from '@/components/ui';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export interface PaymentMethodSelectorOption {
  /**
   * Stable public identifier of the payment method.
   *
   * This must be the identifier used by the application/API boundary.
   */
  id: string;

  /**
   * Human-readable payment method name.
   *
   * Examples:
   * - M-PESA
   * - Visa •••• 4242
   */
  label: string;

  /**
   * Optional supporting information.
   *
   * Examples:
   * - Safaricom M-PESA
   * - Ending in 4242
   */
  description?: string;

  /**
   * Whether this payment method is currently the member's default method.
   */
  isDefault?: boolean;

  /**
   * Optional disabled state.
   *
   * Useful when a payment method exists but cannot currently be selected.
   */
  isDisabled?: boolean;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PaymentMethodSelectorProps {
  /**
   * Available payment methods.
   */
  paymentMethods: PaymentMethodSelectorOption[];

  /**
   * Currently selected payment method public ID.
   */
  selectedPaymentMethodId: string;

  /**
   * Called when the member selects another payment method.
   */
  onChange: (paymentMethodPublicId: string) => void;

  /**
   * Optional field-level validation or application error.
   */
  error?: string;

  /**
   * Prevents interaction while the surrounding payment flow is submitting.
   */
  disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodSelector({
  paymentMethods,
  selectedPaymentMethodId,
  onChange,
  error,
  disabled = false,
}: PaymentMethodSelectorProps) {
  const groupId = 'payment-method-selector';

  return (
    <fieldset
      disabled={disabled}
      aria-describedby={error ? `${groupId}-error` : undefined}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Heading                                                             */}
      {/* ------------------------------------------------------------------- */}
      <legend className="text-sm font-semibold text-[var(--foreground)]">
        Payment method
      </legend>

      <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
        Choose how you want to add money to your wallet.
      </p>

      {/* ------------------------------------------------------------------- */}
      {/* Payment methods                                                     */}
      {/* ------------------------------------------------------------------- */}
      {paymentMethods.length > 0 ? (
        <div className="mt-4 space-y-2">
          {paymentMethods.map((paymentMethod) => {
            const inputId = `${groupId}-${paymentMethod.id}`;
            const isSelected =
              selectedPaymentMethodId === paymentMethod.id;

            const optionDisabled =
              disabled || paymentMethod.isDisabled === true;

            return (
              <label
                key={paymentMethod.id}
                htmlFor={inputId}
                className={[
                  'flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)]',
                  'border p-3 transition-colors',
                  isSelected
                    ? 'border-[var(--brand)] bg-[var(--brand-soft)]'
                    : 'border-[var(--border)] bg-[var(--surface)]',
                  optionDisabled
                    ? 'cursor-not-allowed opacity-60'
                    : 'hover:border-[var(--border-strong)]',
                ].join(' ')}
              >
                {/* Radio ---------------------------------------------------- */}
                <input
                  id={inputId}
                  name={groupId}
                  type="radio"
                  value={paymentMethod.id}
                  checked={isSelected}
                  disabled={optionDisabled}
                  onChange={() => onChange(paymentMethod.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]"
                />

                {/* Method information ------------------------------------- */}
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {paymentMethod.label}
                    </span>

                    {paymentMethod.isDefault ? (
                      <Badge variant="brand">Default</Badge>
                    ) : null}
                  </span>

                  {paymentMethod.description ? (
                    <span className="mt-1 block text-xs text-[var(--foreground-muted)]">
                      {paymentMethod.description}
                    </span>
                  ) : null}
                </span>
              </label>
            );
          })}
        </div>
      ) : (
        /* --------------------------------------------------------------- */
        /* No methods                                                      */
        /* --------------------------------------------------------------- */
        <div className="mt-4 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--background-subtle)] p-4">
          <p className="text-sm font-medium text-[var(--foreground)]">
            No payment methods available
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Add a payment method to continue with your top-up.
          </p>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Validation / application error                                      */}
      {/* ------------------------------------------------------------------- */}
      {error ? (
        <p
          id={`${groupId}-error`}
          role="alert"
          className="mt-2 text-sm text-[var(--danger)]"
        >
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}