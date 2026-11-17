
// =============================================================================
// sisiMove — Payment Method Selector
// =============================================================================
//
// Presentation component for selecting how a member wants to top up a wallet.
//
// Supported top-up options:
//
// 1. DEFAULT_NUMBER — STK Push to the saved default M-PESA number.
// 2. PAYBILL_TILL   — Customer-initiated C2B payment.
//
// Backend alignment:
//
// STK_PUSH requires an existing saved FinancialPaymentMethod.
// The current backend does not accept a new phone number for STK Push.
//
// C2B uses the separate M-PESA payment-instructions endpoint.
//
// Responsibilities:
// - Display the two supported top-up options.
// - Show the saved default M-PESA number when available.
// - Identify the default payment method.
// - Allow the parent to control the selected option.
// - Surface field-level validation or application errors.
//
// This component intentionally does NOT:
// - fetch payment methods;
// - collect or validate phone numbers;
// - create financial payments;
// - call M-PESA APIs;
// - manage payment processing.
//
// The parent/container owns selection state and payment orchestration.
//
// =============================================================================

'use client';

import { useId } from 'react';
import { Badge } from '@/components/ui';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export type TopUpOption =
  | 'DEFAULT_NUMBER'
  | 'PAYBILL_TILL';

export interface DefaultPaymentMethodOption {
  /**
   * Stable public identifier of the saved default payment method.
   *
   * Passed to the backend as methodId for STK Push.
   */
  id: string;

  /**
   * Human-readable payment method name.
   */
  label: string;

  /**
   * Registered M-PESA phone number.
   */
  phoneNumber: string;

  /**
   * Optional supporting information.
   */
  description?: string;

  /**
   * Whether the saved method is active and usable.
   */
  isActive: boolean;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PaymentMethodSelectorProps {
  /**
   * Currently selected top-up option.
   */
  selectedOption: TopUpOption;

  /**
   * Called when the member selects another top-up option.
   */
  onChange: (option: TopUpOption) => void;

  /**
   * The member's saved default M-PESA payment method.
   *
   * If unavailable, the default-number option remains visible but disabled.
   */
  defaultPaymentMethod?: DefaultPaymentMethodOption | null;

  /**
   * Optional field-level validation or application error.
   */
  error?: string;

  /**
   * Prevents interaction while the payment flow is submitting.
   */
  disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodSelector({
  selectedOption,
  onChange,
  defaultPaymentMethod,
  error,
  disabled = false,
}: PaymentMethodSelectorProps) {
  const generatedId = useId();
  const groupId = `payment-method-selector-${generatedId}`;

  const hasUsableDefaultMethod =
    Boolean(defaultPaymentMethod?.id) &&
    defaultPaymentMethod?.isActive === true;

  const options: {
    id: TopUpOption;
    label: string;
    description: string;
    disabled?: boolean;
  }[] = [
    {
      id: 'DEFAULT_NUMBER',
      label: 'Use my default M-PESA number',
      description: hasUsableDefaultMethod
        ? defaultPaymentMethod!.phoneNumber
        : 'No active default M-PESA number is available.',
      disabled: !hasUsableDefaultMethod,
    },
    {
      id: 'PAYBILL_TILL',
      label: 'Pay using PayBill / Buy Goods',
      description:
        'Pay manually using the business payment instructions.',
    },
  ];

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
        Choose how you want to add money to your sisiMove wallet.
      </p>

      {/* ------------------------------------------------------------------- */}
      {/* Top-up options                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-4 space-y-2">
        {options.map((option) => {
          const inputId = `${groupId}-${option.id}`;
          const isSelected = selectedOption === option.id;

          const optionDisabled =
            disabled || option.disabled === true;

          return (
            <label
              key={option.id}
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
              {/* Radio ------------------------------------------------------ */}

              <input
                id={inputId}
                name={groupId}
                type="radio"
                value={option.id}
                checked={isSelected}
                disabled={optionDisabled}
                onChange={() => onChange(option.id)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]"
              />

              {/* Option information --------------------------------------- */}

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {option.label}
                  </span>

                  {option.id === 'DEFAULT_NUMBER' &&
                  hasUsableDefaultMethod ? (
                    <Badge variant="brand">Default</Badge>
                  ) : null}

                  {option.id === 'PAYBILL_TILL' ? (
                    <Badge variant="default">Manual payment</Badge>                  ) : null}
                </span>

                <span className="mt-1 block text-xs text-[var(--foreground-muted)]">
                  {option.description}
                </span>

                {option.id === 'DEFAULT_NUMBER' &&
                !hasUsableDefaultMethod ? (
                  <span className="mt-1 block text-xs text-[var(--foreground-secondary)]">
                    Add or activate a default M-PESA payment method to use
                    STK Push.
                  </span>
                ) : null}

                {option.id === 'PAYBILL_TILL' ? (
                  <span className="mt-1 block text-xs text-[var(--foreground-secondary)]">
                    Payment instructions will be displayed before you pay.
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

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
