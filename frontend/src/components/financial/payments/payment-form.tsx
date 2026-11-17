
// =============================================================================
// sisiMove — Wallet Top-Up Form
// =============================================================================
//
// Customer-facing payment choices:
//
// 1. DEFAULT_NUMBER — STK Push to the saved default M-PESA number.
// 2. PAYBILL_TILL   — Customer-initiated C2B payment.
//
// Backend mapping:
//
// DEFAULT_NUMBER -> STK_PUSH using the saved methodId.
// PAYBILL_TILL   -> Display instructions from the C2B instructions endpoint.
//
// Responsibilities:
//
// - Collect the top-up amount.
// - Display the supported payment choices.
// - Display the saved default M-PESA number.
// - Display backend-provided C2B payment instructions.
// - Notify the parent when an STK Push form is submitted.
//
// This component does NOT:
//
// - call payment APIs;
// - convert KES into minor units;
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
} from './PaymentMethodSelector';

// =============================================================================
// Types
// =============================================================================

export type TopUpPaymentMethod = TopUpOption;

export type C2BBusinessType = 'PAYBILL' | 'BUY_GOODS';

/**
 * Matches the actual backend C2B payment-instructions response.
 *
 * paymentMethod identifies the payment channel as C2B.
 * businessType identifies whether the configured payment destination
 * is PayBill or Buy Goods.
 */
export interface C2BPaymentDetails {
  provider: 'MPESA';
  paymentMethod: 'C2B';
  businessType: C2BBusinessType;
  shortcode: string;
  accountReference?: string;
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

  /**
   * Saved default M-PESA method.
   *
   * Its public ID is used by the parent when creating an STK_PUSH payment.
   */
  defaultPaymentMethod?: DefaultPaymentMethodOption | null;

  /** C2B payment instructions supplied by the parent. */
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
   * Parent-owned STK Push submission callback.
   *
   * C2B instructions are displayed directly and do not invoke this callback.
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
  // C2B Configuration
  // ---------------------------------------------------------------------------

  const isPayBill =
    c2bPaymentDetails?.businessType === 'PAYBILL';

  const isBuyGoods =
    c2bPaymentDetails?.businessType === 'BUY_GOODS';

  const hasShortcode =
    Boolean(c2bPaymentDetails?.shortcode.trim());

  const hasPayBillReference =
    Boolean(c2bPaymentDetails?.accountReference?.trim());

  const hasInstructions =
    Boolean(c2bPaymentDetails?.instructions.length);

  // PayBill requires the customer-specific account reference.
  // Buy Goods does not return an account reference.
  const isC2BReady =
    Boolean(c2bPaymentDetails) &&
    c2bPaymentDetails?.provider === 'MPESA' &&
    c2bPaymentDetails?.paymentMethod === 'C2B' &&
    hasShortcode &&
    hasInstructions &&
    (
      (isPayBill && hasPayBillReference) ||
      isBuyGoods
    );

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

    // C2B is an external customer-initiated payment.
    // It must not invoke the FinancialPayment creation callback here.
    if (!isStkPushSelected || submitDisabled) {
      return;
    }

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
      {/* PayBill / Buy Goods — C2B Instructions                               */}
      {/* ------------------------------------------------------------------- */}

      {topUpOption === 'PAYBILL_TILL' ? (
        <section
          aria-labelledby="wallet-top-up-payment-instructions"
          className="space-y-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background-subtle)] p-4"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3
                id="wallet-top-up-payment-instructions"
                className="text-sm font-semibold text-[var(--foreground)]"
              >
                M-PESA payment instructions
              </h3>

              <Badge variant="default">
                {isPayBill
                  ? 'PayBill'
                  : isBuyGoods
                    ? 'Buy Goods'
                    : 'C2B'}
              </Badge>
            </div>

            <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
              Follow the payment instructions below to add money to your
              sisiMove wallet.
            </p>
          </div>

          {isC2BReady && c2bPaymentDetails ? (
            <>
              {/* Business Number ------------------------------------------- */}

              <div>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {isPayBill ? 'PayBill number' : 'Till number'}
                </p>

                <p className="mt-1 text-xl font-bold tracking-wide text-[var(--foreground)]">
                  {c2bPaymentDetails.shortcode}
                </p>
              </div>

              {/* PayBill Account Reference ------------------------------- */}

              {isPayBill ? (
                <div>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    Account number
                  </p>

                  <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
                    {c2bPaymentDetails.accountReference}
                  </p>
                </div>
              ) : null}

              {/* Amount --------------------------------------------------- */}

              <div>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Amount to pay
                </p>

                <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
                  {c2bPaymentDetails.currency} {amount || '0'}
                </p>
              </div>

              {/* Backend-provided instructions --------------------------- */}

              <div>
                <p className="mb-2 text-sm font-semibold text-[var(--foreground)]">
                  Steps
                </p>

                <ol className="list-decimal space-y-2 pl-5 text-sm leading-5 text-[var(--foreground-secondary)]">
                  {c2bPaymentDetails.instructions.map(
                    (instruction, index) => (
                      <li key={`${index}-${instruction}`}>
                        {instruction}
                      </li>
                    ),
                  )}
                </ol>
              </div>

              {/* Buy Goods reconciliation note -------------------------- */}

              {isBuyGoods ? (
                <div
                  role="note"
                  className="rounded-[var(--radius-md)] border border-[var(--border)] p-3"
                >
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    Important
                  </p>

                  <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
                    Till payments may require additional reconciliation
                    before they can be matched to your wallet. Your wallet
                    balance updates only after sisiMove confirms and processes
                    the payment.
                  </p>
                </div>
              ) : null}
            </>
          ) : (
            <p
              role="alert"
              className="text-sm text-[var(--foreground-muted)]"
            >
              C2B payment instructions are unavailable or incomplete.
              Please try again later or choose the default M-PESA number.
            </p>
          )}

          <p className="text-xs leading-5 text-[var(--foreground-muted)]">
            Complete the payment in M-PESA. Your wallet balance updates
            only after sisiMove receives, confirms, and processes the payment.
          </p>
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

        {isStkPushSelected ? (
          <Button
            type="submit"
            disabled={submitDisabled}
            className="min-h-11 w-full sm:w-auto"
          >
            {isSubmitting
              ? 'Processing…'
              : 'Request payment'}
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export default PaymentForm;
