// =============================================================================
// sisiMove — Wallet Top-Up Form
// =============================================================================
//
// Customer-facing payment choices:
//
// 1. DEFAULT_NUMBER — STK Push to the saved default M-PESA number.
// 2. PAYBILL         — Customer-initiated C2B payment to SisiMove PayBill.
//
// Backend mapping:
//
// DEFAULT_NUMBER -> STK_PUSH using the saved methodId.
// PAYBILL        -> Create a C2B FinancialPayment and open the PayBill screen.
//
// Responsibilities:
//
// - Collect the top-up amount.
// - Display the supported payment choices.
// - Display the saved default M-PESA number.
// - Indicate that a unique PayBill reference will be generated.
// - Notify the parent to create the selected FinancialPayment.
//
// This component does NOT:
//
// - call payment APIs;
// - convert KES into minor units;
// - generate payment references;
// - initiate STK Push or C2B requests;
// - confirm payments;
// - credit wallet balances.
//
// The parent/container owns API calls, validation, payment lifecycle,
// navigation, and financial state.
//
// Amount boundary:
//
// - Whole KES amounts only.
// - Amount remains a string.
// - No multiplication or minor-unit conversion occurs.
//
// =============================================================================

'use client';

import type { FormEvent } from 'react';

import { Badge, Button, Input } from '@/components/ui';

import {
  PaymentMethodSelector,
  type DefaultPaymentMethodOption,
  type TopUpOption,
} from './payment-method-selector';

// =============================================================================
// Types
// =============================================================================

export type TopUpPaymentMethod = TopUpOption;

export type C2BBusinessType = 'PAYBILL';

/**
 * Matches the actual backend C2B payment-instructions response.
 *
 * paymentMethod identifies the payment channel as C2B.
 * businessType identifies the configured payment destination.
 */
export interface C2BPaymentDetails {
  provider: 'MPESA';
  paymentMethod: 'C2B';
  businessType: C2BBusinessType;
  shortcode: string;
  currency: string;
  instructions: readonly string[];
}

// =============================================================================
// Props
// =============================================================================

export interface PaymentFormProps {
  /** Amount in whole KES, preserved as a string. */
  amount: string;

  /** Selected top-up option. */
  topUpOption: TopUpOption;

  /** Saved default M-PESA method. */
  defaultPaymentMethod?: DefaultPaymentMethodOption | null;

  /** C2B payment configuration supplied by the parent. */
  c2bPaymentDetails?: C2BPaymentDetails | null;

  /** Currency displayed beside the amount. */
  currency?: string;

  /** Validation messages. */
  amountError?: string;
  paymentMethodError?: string;

  /** Submission state. */
  isSubmitting?: boolean;
  isSubmitDisabled?: boolean;

  /** Controlled field callbacks. */
  onAmountChange: (amount: string) => void;
  onTopUpOptionChange: (option: TopUpOption) => void;

  /**
   * Parent-owned payment creation callback.
   *
   * The parent creates an STK_PUSH or C2B FinancialPayment depending on
   * the selected option. C2B reference generation remains a backend
   * responsibility.
   */
  onSubmit: () => void;

  /** Optional cancellation action. */
  onCancel?: () => void;
}

// =============================================================================
// Component
// =============================================================================

export function PaymentForm({
  amount,
  topUpOption,
  defaultPaymentMethod,
  c2bPaymentDetails,
  currency = 'KES',
  amountError,
  paymentMethodError,
  isSubmitting = false,
  isSubmitDisabled = false,
  onAmountChange,
  onTopUpOptionChange,
  onSubmit,
  onCancel,
}: PaymentFormProps) {
  // ---------------------------------------------------------------------------
  // Amount Change
  // ---------------------------------------------------------------------------

  function handleAmountChange(value: string): void {
    // Accept digits only and allow the field to be temporarily empty.
    // Do not convert the amount to a number or minor currency units.

    if (!/^\d*$/.test(value)) {
      return;
    }

    onAmountChange(value);
  }

  // ---------------------------------------------------------------------------
  // Payment Configuration
  // ---------------------------------------------------------------------------

  const isPayBill =
    c2bPaymentDetails?.businessType === 'PAYBILL';

  const hasShortcode =
    Boolean(c2bPaymentDetails?.shortcode.trim());

  const hasInstructions =
    Boolean(c2bPaymentDetails?.instructions.length);

  // The backend generates the payment-specific account reference
  // after the parent creates the C2B FinancialPayment.
  const isC2BReady =
    Boolean(c2bPaymentDetails) &&
    c2bPaymentDetails?.provider === 'MPESA' &&
    c2bPaymentDetails?.paymentMethod === 'C2B' &&
    isPayBill &&
    hasShortcode &&
    hasInstructions;

  const hasUsableDefaultMethod =
    Boolean(defaultPaymentMethod?.id) &&
    defaultPaymentMethod?.isActive === true;

  // ---------------------------------------------------------------------------
  // Submission Guards
  // ---------------------------------------------------------------------------

  const isStkPushSelected =
    topUpOption === 'DEFAULT_NUMBER';

  const isSelectedOptionReady =
    isStkPushSelected
      ? hasUsableDefaultMethod
      : isC2BReady;

  const submitDisabled =
    isSubmitting ||
    isSubmitDisabled ||
    !isSelectedOptionReady;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (submitDisabled) {
      return;
    }

    // The parent creates the appropriate FinancialPayment:
    // STK_PUSH for the saved number, or C2B for SisiMove PayBill.
    onSubmit();
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Amount                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="space-y-2">
        <label
          htmlFor="wallet-top-up-amount"
          className="block text-sm font-semibold text-[var(--foreground)]"
        >
          Amount to add
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
            value={amount}
            onChange={(event) =>
              handleAmountChange(event.target.value)
            }
            aria-invalid={Boolean(amountError)}
            aria-describedby={
              amountError
                ? 'wallet-top-up-amount-error'
                : 'wallet-top-up-amount-help'
            }
            disabled={isSubmitting}
            className="pl-16 text-base sm:text-lg"
          />
        </div>

        <p
          id="wallet-top-up-amount-help"
          className="text-xs text-[var(--foreground-muted)]"
        >
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

      {/* ------------------------------------------------------------------- */}
      {/* Payment Method Selector                                             */}
      {/* ------------------------------------------------------------------- */}

      <PaymentMethodSelector
        selectedOption={topUpOption}
        onChange={onTopUpOptionChange}
        defaultPaymentMethod={defaultPaymentMethod}
        error={paymentMethodError}
        disabled={isSubmitting}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Default Number — STK Push                                           */}
      {/* ------------------------------------------------------------------- */}

      {topUpOption === 'DEFAULT_NUMBER' &&
      hasUsableDefaultMethod ? (
        <section
          aria-labelledby="wallet-top-up-default-number"
          className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background-subtle)] p-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h3
              id="wallet-top-up-default-number"
              className="text-sm font-semibold text-[var(--foreground)]"
            >
              Payment request destination
            </h3>

            <Badge variant="brand">
              Default
            </Badge>
          </div>

          <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
            {defaultPaymentMethod?.phoneNumber}
          </p>

          <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
            sisiMove will send the M-PESA payment request to your saved
            default number. Enter your M-PESA PIN on your phone to approve it.
          </p>
        </section>
      ) : null}

      {/* ------------------------------------------------------------------- */}
      {/* SisiMove PayBill — Preparation                                      */}
      {/* ------------------------------------------------------------------- */}

      {topUpOption === 'PAYBILL' ? (
        <section
          aria-labelledby="wallet-top-up-paybill"
          className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background-subtle)] p-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h3
              id="wallet-top-up-paybill"
              className="text-sm font-semibold text-[var(--foreground)]"
            >
              SisiMove PayBill
            </h3>

            <Badge variant="default">
              Manual payment
            </Badge>
          </div>

          {isC2BReady && c2bPaymentDetails ? (
            <>
              <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
                Continue to generate a unique account reference for this
                top-up. You will then see the PayBill number, reference,
                payment amount and instructions on the next screen.
              </p>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                <p className="text-xs text-[var(--foreground-muted)]">
                  Configured PayBill number
                </p>

                <p className="mt-1 text-lg font-bold tracking-wide text-[var(--foreground)]">
                  {c2bPaymentDetails.shortcode}
                </p>
              </div>
            </>
          ) : (
            <p
              role="alert"
              className="text-sm text-[var(--danger)]"
            >
              SisiMove PayBill configuration is unavailable or incomplete.
              Please retry loading the payment instructions.
            </p>
          )}
        </section>
      ) : null}

      {/* ------------------------------------------------------------------- */}
      {/* Actions                                                             */}
      {/* ------------------------------------------------------------------- */}

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
          disabled={submitDisabled}
          className="min-h-11 w-full sm:w-auto"
        >
          {isSubmitting
            ? 'Creating payment…'
            : isStkPushSelected
              ? 'Request payment'
              : 'Continue to PayBill'}
        </Button>
      </div>
    </form>
  );
}

export default PaymentForm;