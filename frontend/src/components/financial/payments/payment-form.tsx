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
  const quickAmounts = ['100', '200', '500', '1000'];

  function handleAmountChange(value: string): void {
    if (!/^\d*$/.test(value)) {
      return;
    }

    onAmountChange(value);
  }

  const isPayBill =
    c2bPaymentDetails?.businessType === 'PAYBILL';

  const hasShortcode =
    Boolean(c2bPaymentDetails?.shortcode.trim());

  const hasInstructions =
    Boolean(c2bPaymentDetails?.instructions.length);

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

  const isStkPushSelected =
    topUpOption === 'DEFAULT_NUMBER';

  const isSelectedOptionReady =
    isStkPushSelected
      ? hasUsableDefaultMethod
      : isC2BReady;

  const numericAmount = Number(amount);
  const hasValidAmount =
    amount.trim().length > 0 &&
    Number.isSafeInteger(numericAmount) &&
    numericAmount > 0;

  const submitDisabled =
    isSubmitting ||
    isSubmitDisabled ||
    !hasValidAmount ||
    !isSelectedOptionReady;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (submitDisabled) {
      return;
    }

    onSubmit();
  }

  const selectedMethodLabel = isStkPushSelected
    ? 'M-PESA prompt'
    : 'SisiMove PayBill';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]"
          >
            KSh
          </span>
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Add money to your wallet
            </h2>
            <p className="text-sm text-[var(--foreground-secondary)]">
              Choose an amount and how you would like to pay.
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="wallet-top-up-amount"
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            How much would you like to add?
          </label>
          <span className="text-xs text-[var(--foreground-muted)]">
            {currency}
          </span>
        </div>

        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-semibold text-[var(--foreground-muted)]"
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
            placeholder="Enter amount"
            className="h-14 pl-16 text-xl font-semibold tracking-wide"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((quickAmount) => {
            const isSelected = amount === quickAmount;

            return (
              <Button
                key={quickAmount}
                type="button"
                size="sm"
                variant={isSelected ? 'secondary' : 'outline'}
                disabled={isSubmitting}
                aria-pressed={isSelected}
                onClick={() => onAmountChange(quickAmount)}
                className="min-w-[4.5rem]"
              >
                {Number(quickAmount).toLocaleString('en-KE')}
              </Button>
            );
          })}
        </div>

        <p
          id="wallet-top-up-amount-help"
          className="text-xs leading-5 text-[var(--foreground-muted)]"
        >
          Enter a whole amount in KES. You can choose one of the quick
          amounts or type your own amount.
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

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Choose how to pay
          </h3>
          <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
            Pick the option that is most convenient for you.
          </p>
        </div>

        <PaymentMethodSelector
          selectedOption={topUpOption}
          onChange={onTopUpOptionChange}
          defaultPaymentMethod={defaultPaymentMethod}
          error={paymentMethodError}
          disabled={isSubmitting}
        />
      </div>

      {topUpOption === 'DEFAULT_NUMBER' &&
      hasUsableDefaultMethod ? (
        <section
          aria-labelledby="wallet-top-up-default-number"
          className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background-subtle)] p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3
              id="wallet-top-up-default-number"
              className="text-sm font-semibold text-[var(--foreground)]"
            >
              Your M-PESA number
            </h3>
            <Badge variant="brand">Saved number</Badge>
          </div>

          <p className="text-xl font-semibold tracking-wide text-[var(--foreground)]">
            {defaultPaymentMethod?.phoneNumber}
          </p>

          <ol className="space-y-2 text-sm leading-5 text-[var(--foreground-secondary)]">
            <li className="flex gap-2">
              <span className="font-semibold text-[var(--brand)]">1.</span>
              Tap the button below to request payment.
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-[var(--brand)]">2.</span>
              Check your phone for the M-PESA prompt.
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-[var(--brand)]">3.</span>
              Confirm the amount and enter your M-PESA PIN in the
              M-PESA prompt.
            </li>
          </ol>

          <p className="rounded-lg bg-[var(--surface)] px-3 py-2 text-xs leading-5 text-[var(--foreground-muted)]">
            Your M-PESA PIN is entered in the M-PESA prompt, not in
            SisiMove. Never share your PIN with anyone.
          </p>
        </section>
      ) : null}

      {topUpOption === 'PAYBILL' ? (
        <section
          aria-labelledby="wallet-top-up-paybill"
          className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background-subtle)] p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3
              id="wallet-top-up-paybill"
              className="text-sm font-semibold text-[var(--foreground)]"
            >
              Pay using SisiMove PayBill
            </h3>
            <Badge variant="default">Manual payment</Badge>
          </div>

          {isC2BReady && c2bPaymentDetails ? (
            <>
              <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
                You will receive a unique payment reference after
                continuing. Use that reference when paying so your
                top-up can be matched to your wallet.
              </p>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                <p className="text-xs text-[var(--foreground-muted)]">
                  SisiMove PayBill number
                </p>
                <p className="mt-1 text-xl font-bold tracking-wide text-[var(--foreground)]">
                  {c2bPaymentDetails.shortcode}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  What happens next?
                </p>
                <ol className="space-y-2 text-sm leading-5 text-[var(--foreground-secondary)]">
                  <li className="flex gap-2">
                    <span className="font-semibold text-[var(--brand)]">1.</span>
                    Continue to create your payment.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-[var(--brand)]">2.</span>
                    Copy the unique account reference shown on the
                    next screen.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-[var(--brand)]">3.</span>
                    Pay through M-PESA using the displayed PayBill
                    number, amount and reference.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-[var(--brand)]">4.</span>
                    Return to SisiMove to check the payment status.
                  </li>
                </ol>
              </div>
            </>
          ) : (
            <p
              role="alert"
              className="text-sm leading-5 text-[var(--danger)]"
            >
              SisiMove PayBill details are temporarily unavailable.
              Please try again in a moment or choose the M-PESA prompt
              option.
            </p>
          )}
        </section>
      ) : null}

      <section
        aria-label="Payment summary"
        className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Your top-up summary
        </h3>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[var(--foreground-secondary)]">
            Amount to add
          </span>
          <span className="text-lg font-bold tabular-nums text-[var(--foreground)]">
            {currency} {hasValidAmount
              ? numericAmount.toLocaleString('en-KE')
              : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[var(--foreground-secondary)]">
            Payment method
          </span>
          <span className="text-sm font-medium text-[var(--foreground)]">
            {selectedMethodLabel}
          </span>
        </div>
        <p className="border-t border-[var(--border-subtle)] pt-3 text-xs leading-5 text-[var(--foreground-muted)]">
          Review the amount before continuing. Your wallet is updated
          only after the payment has been successfully confirmed.
        </p>
      </section>

      <div className="space-y-3">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="min-h-11 w-full sm:w-auto"
            >
              Go back
            </Button>
          ) : null}

          <Button
            type="submit"
            disabled={submitDisabled}
            loading={isSubmitting}
            className="min-h-12 w-full sm:w-auto"
          >
            {isSubmitting
              ? 'Preparing your payment…'
              : isStkPushSelected
                ? 'Continue to M-PESA'
                : 'Continue to PayBill'}
          </Button>
        </div>

        <p className="text-center text-xs leading-5 text-[var(--foreground-muted)]">
          You can review the payment details before completing your
          payment. Do not share your M-PESA PIN or confirmation message.
        </p>
      </div>
    </form>
  );
}
export default PaymentForm;