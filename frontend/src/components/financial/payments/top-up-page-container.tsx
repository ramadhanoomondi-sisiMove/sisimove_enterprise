
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { AUTHENTICATED_ROUTES } from '@/foundation/routing/authenticated-routes';

import { useMyFinancialAccount } from '@/features/financial-account';
import { useDefaultPaymentMethod } from '@/features/financial-payment-methods';

import {
  createPaymentSchema,
  useCreatePayment,
  useFinancialPayment,
} from '@/features/financial-payments';

import { useC2BPaymentInstructions } from '@/features/mpesa';

import {
  PaymentForm,
  PaymentProcessing,
  PaymentResult,
  type PaymentResultStatus,
} from '@/components/financial/payments';

import {
  PayBillPayment,
  type PayBillPaymentStatus,
} from '@/components/financial/payments/paybill-payment';

import { Button } from '@/components/ui';

// =============================================================================
// Constants
// =============================================================================

const DEFAULT_CURRENCY = 'KES';
const PAYMENT_STATUS_POLL_INTERVAL_MS = 3_000;

// =============================================================================
// Types
// =============================================================================

type FinancialPaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED';

type TerminalPaymentStatus =
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED';

type TopUpOption = 'DEFAULT_NUMBER' | 'PAYBILL';

interface PaymentResultCopy {
  readonly title: string;
  readonly message: string;
}

// =============================================================================
// Helpers
// =============================================================================

function isPaymentInProgress(
  status: FinancialPaymentStatus,
): boolean {
  return status === 'PENDING' || status === 'PROCESSING';
}

/**
 * Narrow the FinancialPayment status to terminal statuses.
 *
 * This prevents PENDING and PROCESSING payments from being
 * passed into terminal-result presentation logic.
 */
function isTerminalPaymentStatus(
  status: FinancialPaymentStatus,
): status is TerminalPaymentStatus {
  return (
    status === 'SUCCEEDED' ||
    status === 'FAILED' ||
    status === 'CANCELLED' ||
    status === 'EXPIRED'
  );
}

function mapPaymentResultStatus(
  status: TerminalPaymentStatus,
): PaymentResultStatus {
  return status === 'SUCCEEDED' ? 'success' : 'failed';
}

/**
 * Translate the FinancialPayment API status into the presentation
 * vocabulary used by PayBillPayment.
 *
 * SUCCEEDED is presented as COMPLETED.
 * This does not change the underlying domain status.
 */
function mapPayBillPaymentStatus(
  status: FinancialPaymentStatus,
): PayBillPaymentStatus {
  switch (status) {
    case 'SUCCEEDED':
      return 'COMPLETED';

    case 'PENDING':
      return 'PENDING';

    case 'PROCESSING':
      return 'PROCESSING';

    case 'FAILED':
      return 'FAILED';

    case 'CANCELLED':
      return 'CANCELLED';

    case 'EXPIRED':
      return 'EXPIRED';

    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}

function getPaymentResultCopy(
  status: TerminalPaymentStatus,
): PaymentResultCopy {
  switch (status) {
    case 'SUCCEEDED':
      return {
        title: 'Top-up successful',
        message: 'Your payment was completed successfully.',
      };

    case 'CANCELLED':
      return {
        title: 'Top-up cancelled',
        message: 'This payment was cancelled before it completed.',
      };

    case 'EXPIRED':
      return {
        title: 'Top-up expired',
        message:
          'This payment is no longer active. You can start a new top-up if needed.',
      };

    case 'FAILED':
      return {
        title: 'Top-up failed',
        message: 'The payment could not be completed. Please try again.',
      };

    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}

// =============================================================================
// Component
// =============================================================================

export function TopUpPageContainer() {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  const {
    data: financialAccount,
    isLoading: isAccountLoading,
    isError: isAccountError,
    error: accountError,
    refetch: refetchAccount,
  } = useMyFinancialAccount();

  // ===========================================================================
  // Default Payment Method
  // ===========================================================================

  const {
    data: defaultPaymentMethod,
    isError: isDefaultPaymentMethodError,
    refetch: refetchDefaultPaymentMethod,
  } = useDefaultPaymentMethod();

  // ===========================================================================
  // C2B Payment Instructions
  // ===========================================================================

  const {
    data: c2bPaymentInstructions,
    isLoading: isC2BInstructionsLoading,
    isError: isC2BInstructionsError,
    error: c2bPaymentInstructionsError,
    refetch: refetchC2BPaymentInstructions,
  } = useC2BPaymentInstructions();

  // ===========================================================================
  // Create Financial Payment
  // ===========================================================================

  const createPaymentMutation = useCreatePayment();

  // ===========================================================================
  // Form State
  // ===========================================================================

  // Amount remains a string in whole KES.
  // The backend converts it into minor units.
  const [amount, setAmount] = useState<string>('');

  const [topUpOption, setTopUpOption] =
    useState<TopUpOption>('DEFAULT_NUMBER');

  const [amountError, setAmountError] =
    useState<string | undefined>();

  const [paymentMethodError, setPaymentMethodError] =
    useState<string | undefined>();

  const [formError, setFormError] =
    useState<string | undefined>();

  // ===========================================================================
  // Payment Observation State
  // ===========================================================================

  const [paymentPublicId, setPaymentPublicId] =
    useState<string | undefined>();

  // ===========================================================================
  // Financial Payment Lifecycle
  // ===========================================================================

  const {
    data: payment,
    isLoading: isPaymentLoading,
    isFetching: isPaymentFetching,
    isError: isPaymentError,
    error: paymentError,
    refetch: refetchPayment,
  } = useFinancialPayment(paymentPublicId);

  // Derive the primitive status for the polling effect.
  // This avoids depending on the complete payment object.
  const paymentStatus = payment?.status;

  // ===========================================================================
  // Default Payment Method Presentation
  // ===========================================================================

  const defaultPaymentMethodOption = defaultPaymentMethod
    ? {
        id: defaultPaymentMethod.publicId,
        label:
          defaultPaymentMethod.displayName?.trim() ||
          defaultPaymentMethod.provider,
        phoneNumber: defaultPaymentMethod.phoneNumber,
        description: defaultPaymentMethod.provider,
        isActive: defaultPaymentMethod.isActive,
      }
    : null;

  // ===========================================================================
  // C2B Payment Details Presentation
  // ===========================================================================

  const c2bPaymentDetails =
    c2bPaymentInstructions?.businessType === 'PAYBILL'
      ? {
          provider: c2bPaymentInstructions.provider,
          paymentMethod: 'C2B' as const,
          businessType: 'PAYBILL' as const,
          shortcode: c2bPaymentInstructions.shortcode,
          currency: c2bPaymentInstructions.currency,
          instructions: [c2bPaymentInstructions.instructions],
        }
      : null;

  // ===========================================================================
  // Payment Status Polling
  // ===========================================================================

  useEffect(() => {
    if (
      paymentPublicId === undefined ||
      paymentStatus === undefined ||
      !isPaymentInProgress(paymentStatus)
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refetchPayment();
    }, PAYMENT_STATUS_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    paymentPublicId,
    paymentStatus,
    refetchPayment,
  ]);

  // ===========================================================================
  // Financial Payment Submission
  // ===========================================================================

  const handleSubmit = () => {
    setAmountError(undefined);
    setPaymentMethodError(undefined);
    setFormError(undefined);

    // -------------------------------------------------------------------------
    // Financial Account
    // -------------------------------------------------------------------------

    if (!financialAccount?.publicId) {
      setFormError(
        'Your wallet account could not be loaded. Please try again.',
      );
      return;
    }

    // -------------------------------------------------------------------------
    // Saved Default Payment Method (STK Push only)
    // -------------------------------------------------------------------------

    if (
      topUpOption === 'DEFAULT_NUMBER' &&
      (!defaultPaymentMethod?.publicId ||
        !defaultPaymentMethod.isActive)
    ) {
      setPaymentMethodError(
        'An active default M-PESA payment method is required for STK Push.',
      );
      return;
    }

    // -------------------------------------------------------------------------
    // PayBill Configuration
    // -------------------------------------------------------------------------

    if (
      topUpOption === 'PAYBILL' &&
      (
        c2bPaymentInstructions?.businessType !== 'PAYBILL' ||
        !c2bPaymentInstructions.shortcode
      )
    ) {
      setFormError(
        'SisiMove PayBill instructions are unavailable. Please retry loading them.',
      );
      return;
    }

    // -------------------------------------------------------------------------
    // Amount
    // -------------------------------------------------------------------------

    if (
      !/^\d+$/.test(amount) ||
      !Number.isSafeInteger(Number(amount) * 100) ||
      Number(amount) <= 0
    ) {
      setAmountError('Enter a valid top-up amount.');
      return;
    }

    // -------------------------------------------------------------------------
    // Correlation Identifier
    // -------------------------------------------------------------------------

    const correlationId = crypto.randomUUID();

    // -------------------------------------------------------------------------
    // Validate CreatePaymentRequest
    // -------------------------------------------------------------------------

    const parsed = createPaymentSchema.safeParse({
      channel: topUpOption === 'DEFAULT_NUMBER' ? 'STK_PUSH' : 'C2B',

      // Send whole KES. Do not multiply by 100 here.
      amount,

      currency: DEFAULT_CURRENCY,
      correlationId,

      ...(topUpOption === 'DEFAULT_NUMBER' &&
      defaultPaymentMethod?.publicId
        ? { methodPublicId: defaultPaymentMethod.publicId }
        : {}),
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      setAmountError(fieldErrors.amount?.[0]);
      setPaymentMethodError(fieldErrors.methodPublicId?.[0]);

      setFormError(
        fieldErrors.channel?.[0] ??
          fieldErrors.currency?.[0] ??
          fieldErrors.correlationId?.[0],
      );

      return;
    }

    // -------------------------------------------------------------------------
    // Create FinancialPayment (STK Push or C2B PayBill)
    // -------------------------------------------------------------------------

    createPaymentMutation.mutate(
      {
        accountPublicId: financialAccount.publicId,
        request: parsed.data,
      },
      {
        onSuccess: (createdPayment) => {
          // The backend creates the payment and generates the C2B reference.
          // Retrieve the persisted payment using its public identifier.
          setPaymentPublicId(createdPayment.publicId);
        },

        onError: (error) => {
          setFormError(
            error.message ||
              'Unable to start the top-up. Please try again.',
          );
        },
      },
    );
  };

  // ===========================================================================
  // Reset
  // ===========================================================================

  const handleReset = () => {
    setPaymentPublicId(undefined);
    setAmount('');
    setTopUpOption('DEFAULT_NUMBER');
    setAmountError(undefined);
    setPaymentMethodError(undefined);
    setFormError(undefined);

    createPaymentMutation.reset();
  };

  // ===========================================================================
  // Initial Financial Account Loading
  // ===========================================================================

  if (isAccountLoading) {
    return (
      <main className="min-h-screen bg-[var(--background-brand)]">
        <div className="page-container">
          <section className="section">
            <div className="mx-auto max-w-2xl">
              <div className="surface p-6">
                <div
                  className="space-y-4"
                  aria-busy="true"
                  aria-label="Loading wallet top-up"
                >
                  <div className="h-6 w-40 animate-pulse rounded bg-[var(--background-muted)]" />
                  <div className="h-4 w-72 animate-pulse rounded bg-[var(--background-muted)]" />
                  <div className="h-12 w-full animate-pulse rounded bg-[var(--background-muted)]" />
                  <div className="h-12 w-full animate-pulse rounded bg-[var(--background-muted)]" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // ===========================================================================
  // Financial Account Error
  // ===========================================================================

  if (isAccountError || !financialAccount?.publicId) {
    return (
      <main className="min-h-screen bg-[var(--background-brand)]">
        <div className="page-container">
          <section className="section">
            <div className="mx-auto max-w-2xl">
              <div className="surface p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--danger)]">
                      Unable to load wallet
                    </p>

                    <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                      {accountError?.message ??
                        'Your financial account could not be loaded.'}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void refetchAccount();
                    }}
                  >
                    Try again
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // ===========================================================================
  // Payment Lifecycle Surface — STK Push and C2B PayBill
  // ===========================================================================

  if (paymentPublicId !== undefined) {
    // -------------------------------------------------------------------------
    // Payment Retrieval Error
    // -------------------------------------------------------------------------

    if (isPaymentError) {
      return (
        <main className="min-h-screen bg-[var(--background-brand)]">
          <div className="page-container">
            <section className="section">
              <div className="mx-auto max-w-2xl">
                <div className="surface p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--danger)]">
                        Unable to retrieve payment status
                      </p>

                      <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                        {paymentError?.message ??
                          'The payment status could not be retrieved.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          void refetchPayment();
                        }}
                      >
                        Try again
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                      >
                        Back to top up
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      );
    }

    // -------------------------------------------------------------------------
    // Payment Status Loading
    // -------------------------------------------------------------------------

    if (isPaymentLoading || payment === undefined) {
      return (
        <main className="min-h-screen bg-[var(--background-brand)]">
          <div className="page-container">
            <section className="section">
              <div className="mx-auto max-w-2xl">
                <PaymentProcessing
                  title={
                    topUpOption === 'PAYBILL'
                      ? 'Preparing your PayBill payment'
                      : 'Checking payment status'
                  }
                  message={
                    topUpOption === 'PAYBILL'
                      ? 'Your payment has been created. We are retrieving its unique account reference.'
                      : "We're retrieving the latest status of your top-up."
                  }
                />
              </div>
            </section>
          </div>
        </main>
      );
    }

    // -------------------------------------------------------------------------
    // Active PayBill Payment
    // -------------------------------------------------------------------------

    if (
      topUpOption === 'PAYBILL' &&
      isPaymentInProgress(payment.status)
    ) {
      // The payment-specific reference must come from the persisted
      // FinancialPayment returned by the backend.
      // Never generate or invent a reference in the frontend.

      if (!payment.c2bReference) {
        return (
          <main className="min-h-screen bg-[var(--background-brand)]">
            <div className="page-container">
              <section className="section">
                <div className="mx-auto max-w-2xl">
                  <PaymentProcessing
                    title="Preparing your PayBill reference"
                    message="Your payment exists, but its unique account reference has not appeared yet. Refresh the payment before making the M-PESA payment."
                  />

                  <div className="mt-4 flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPaymentFetching}
                      onClick={() => {
                        void refetchPayment();
                      }}
                    >
                      {isPaymentFetching
                        ? 'Checking status…'
                        : 'Check payment status'}
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </main>
        );
      }

      // Do not display an incomplete or empty PayBill destination.
      if (
        !c2bPaymentDetails?.shortcode ||
        !c2bPaymentDetails.instructions.length
      ) {
        return (
          <main className="min-h-screen bg-[var(--background-brand)]">
            <div className="page-container">
              <section className="section">
                <div className="mx-auto max-w-2xl">
                  <div className="surface space-y-4 p-6">
                    <div>
                      <p className="text-sm font-semibold text-[var(--danger)]">
                        PayBill instructions unavailable
                      </p>

                      <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                        Your payment and unique reference have been created,
                        but the PayBill destination could not be loaded.
                        Please retrieve the instructions before making
                        your payment.
                      </p>
                    </div>

                    {isC2BInstructionsError ? (
                      <p className="text-sm text-[var(--danger)]">
                        {c2bPaymentInstructionsError?.message ??
                          'Unable to load PayBill instructions.'}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isC2BInstructionsLoading}
                        onClick={() => {
                          void refetchC2BPaymentInstructions();
                        }}
                      >
                        {isC2BInstructionsLoading
                          ? 'Loading instructions…'
                          : 'Retry PayBill instructions'}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isPaymentFetching}
                        onClick={() => {
                          void refetchPayment();
                        }}
                      >
                        Check payment status
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                    >
                      Back to top up
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </main>
        );
      }

      return (
        <main className="min-h-screen bg-[var(--background-brand)]">
          <div className="page-container">
            <section className="section">
              <div className="mx-auto max-w-2xl">
                <PayBillPayment
                  paymentPublicId={payment.publicId}
                  paybillNumber={c2bPaymentDetails.shortcode}
                  c2bReference={payment.c2bReference}
                  amount={payment.amount}
                  currency={payment.currency}
                  status={mapPayBillPaymentStatus(payment.status)}
                  instructions={c2bPaymentDetails.instructions}
                  onCheckStatus={async () => {
                    await refetchPayment();
                  }}
                  isCheckingStatus={isPaymentFetching}
                  onBack={handleReset}
                />
              </div>
            </section>
          </div>
        </main>
      );
    }

    // -------------------------------------------------------------------------
    // Active STK Push Payment
    // -------------------------------------------------------------------------

    if (
      topUpOption === 'DEFAULT_NUMBER' &&
      isPaymentInProgress(payment.status)
    ) {
      return (
        <main className="min-h-screen bg-[var(--background-brand)]">
          <div className="page-container">
            <section className="section">
              <div className="mx-auto max-w-2xl">
                <PaymentProcessing
                  title={
                    payment.status === 'PENDING'
                      ? 'Top-up pending'
                      : 'Top-up processing'
                  }
                  message={
                    payment.status === 'PENDING'
                      ? 'Your payment has been created and is waiting to proceed.'
                      : 'Your payment is currently being processed.'
                  }
                />

                <div className="mt-4 flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                  >
                    Return to top up
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </main>
      );
    }

    // -------------------------------------------------------------------------
    // Terminal Payment
    // -------------------------------------------------------------------------

    // Narrow the status before using terminal-result presentation.
    if (!isTerminalPaymentStatus(payment.status)) {
      return (
        <main className="min-h-screen bg-[var(--background-brand)]">
          <div className="page-container">
            <section className="section">
              <div className="mx-auto max-w-2xl">
                <PaymentProcessing
                  title="Checking payment status"
                  message="We're retrieving the latest status of your top-up."
                />
              </div>
            </section>
          </div>
        </main>
      );
    }

    const resultCopy = getPaymentResultCopy(payment.status);

    return (
      <main className="min-h-screen bg-[var(--background-brand)]">
        <div className="page-container">
          <section className="section">
            <div className="mx-auto max-w-2xl">
              <PaymentResult
                status={mapPaymentResultStatus(payment.status)}
                title={resultCopy.title}
                message={resultCopy.message}
                paymentReference={
                  payment.c2bReference ?? payment.publicId
                }
                actions={
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleReset}
                  >
                    Start another top-up
                  </Button>
                }
              />
            </div>
          </section>
        </div>
      </main>
    );
  }

  // ===========================================================================
  // Top-Up Form
  // ===========================================================================

  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container">
        <section className="section">
          <div className="mx-auto max-w-2xl space-y-5">
            {/* Page Heading */}

            <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">
                  WALLET
                </p>

                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                  Top up
                </h1>

                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  Add funds to your sisiMove wallet.
                </p>
              </div>

              <Link
                href={AUTHENTICATED_ROUTES.WALLET_PAYMENT_METHODS}
                className="text-sm font-semibold text-[var(--brand)] transition hover:text-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
              >
                Manage Payment Methods →
              </Link>
            </header>

            {/* Top-Up Form */}

            <PaymentForm
              amount={amount}
              topUpOption={topUpOption}
              defaultPaymentMethod={defaultPaymentMethodOption}
              c2bPaymentDetails={c2bPaymentDetails}
              currency={DEFAULT_CURRENCY}
              amountError={amountError}
              paymentMethodError={paymentMethodError}
              isSubmitting={createPaymentMutation.isPending}
              isSubmitDisabled={createPaymentMutation.isPending}
              onAmountChange={(nextAmount) => {
                setAmount(nextAmount);
                setAmountError(undefined);
                setFormError(undefined);
              }}
              onTopUpOptionChange={(nextOption) => {
                setTopUpOption(nextOption);
                setPaymentMethodError(undefined);
                setFormError(undefined);
              }}
              onSubmit={handleSubmit}
              onCancel={handleReset}
            />

            {/* C2B Instructions Loading */}

            {topUpOption === 'PAYBILL' &&
            isC2BInstructionsLoading ? (
              <p
                className="text-sm text-[var(--foreground-muted)]"
                aria-live="polite"
              >
                Loading SisiMove PayBill instructions…
              </p>
            ) : null}

            {/* C2B Instructions Error */}

            {topUpOption === 'PAYBILL' &&
            isC2BInstructionsError ? (
              <div
                role="alert"
                className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
              >
                {c2bPaymentInstructionsError?.message ??
                  'Unable to load SisiMove PayBill instructions.'}

                <div className="mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void refetchC2BPaymentInstructions();
                    }}
                  >
                    Retry instructions
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Default Payment Method Error */}

            {isDefaultPaymentMethodError ? (
              <div
                role="alert"
                className="rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--foreground-secondary)]"
              >
                Your saved default M-PESA number could not be loaded.
                You can still use SisiMove PayBill, or retry loading
                your payment method.

                <div className="mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void refetchDefaultPaymentMethod();
                    }}
                  >
                    Retry payment method
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Application Error */}

            {formError ? (
              <div
                role="alert"
                className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
              >
                {formError}
              </div>
            ) : null}

            {/* Mutation Error */}

            {createPaymentMutation.isError && !formError ? (
              <div
                role="alert"
                className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
              >
                {createPaymentMutation.error.message ||
                  'Unable to start the top-up. Please try again.'}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

export default TopUpPageContainer;
