// =============================================================================
// sisiMove — Payment Method Selector
// =============================================================================
//
// Presentation component for selecting how a member wants to top up a wallet.
//
// Supported options:
//
// 1. DEFAULT_NUMBER — STK Push to the saved default M-PESA number.
// 2. PAYBILL         — Customer-initiated C2B payment to the SisiMove PayBill.
//
// The parent/container owns selection state and payment orchestration.
//
// =============================================================================

'use client';

import { useId } from 'react';
import { Badge } from '@/components/ui';

export type TopUpOption = 'DEFAULT_NUMBER' | 'PAYBILL';

export interface DefaultPaymentMethodOption {
  id: string;
  label: string;
  phoneNumber: string;
  description?: string;
  isActive: boolean;
}

export interface PaymentMethodSelectorProps {
  selectedOption: TopUpOption;
  onChange: (option: TopUpOption) => void;
  defaultPaymentMethod?: DefaultPaymentMethodOption | null;
  error?: string;
  disabled?: boolean;
}

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
      id: 'PAYBILL',
      label: 'Pay using SisiMove PayBill',
      description:
        'Receive a unique account reference for this top-up.',
    },
  ];

  return (
    <fieldset
      disabled={disabled}
      aria-describedby={error ? `${groupId}-error` : undefined}
    >
      <legend className="text-sm font-semibold text-[var(--foreground)]">
        Payment method
      </legend>

      <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
        Choose how you want to add money to your sisiMove wallet.
      </p>

      <div className="mt-4 space-y-2">
        {options.map((option) => {
          const inputId = `${groupId}-${option.id}`;
          const isSelected = selectedOption === option.id;
          const optionDisabled = disabled || option.disabled === true;

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

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {option.label}
                  </span>

                  {option.id === 'DEFAULT_NUMBER' &&
                  hasUsableDefaultMethod ? (
                    <Badge variant="brand">Default</Badge>
                  ) : null}

                  {option.id === 'PAYBILL' ? (
                    <Badge variant="default">Manual payment</Badge>
                  ) : null}
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

                {option.id === 'PAYBILL' ? (
                  <span className="mt-1 block text-xs text-[var(--foreground-secondary)]">
                    sisiMove will generate a unique account reference for
                    your payment.
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

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
