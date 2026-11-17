
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

type TopUpOption = 'DEFAULT_NUMBER' | 'PAYBILL_TILL';

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

function mapPaymentResultStatus(
  status: FinancialPaymentStatus,
): PaymentResultStatus {
  return status === 'SUCCEEDED' ? 'success' : 'failed';
}

function getPaymentResultCopy(
  status: 'SUCCEEDED' | 'FAILED' | 'CANCELLED' | 'EXPIRED',
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
    default:
      return {
        title: 'Top-up failed',
        message: 'The payment could not be completed. Please try again.',
      };
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
  // The backend performs the conversion to minor units.
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
    isError: isPaymentError,
    error: paymentError,
    refetch: refetchPayment,
  } = useFinancialPayment(paymentPublicId);

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

  const c2bPaymentDetails = c2bPaymentInstructions
    ? {
        provider: c2bPaymentInstructions.provider,
        paymentMethod: 'C2B' as const,
        businessType: c2bPaymentInstructions.businessType,
        shortcode: c2bPaymentInstructions.shortcode,
        accountReference:
          c2bPaymentInstructions.accountReference ?? undefined,
        currency: c2bPaymentInstructions.currency,

        // PaymentForm expects an array, while the API model
        // currently supplies a single instruction string.
        instructions: [c2bPaymentInstructions.instructions],
      }
    : null;

  // ===========================================================================
  // Payment Status Polling
  // ===========================================================================

  useEffect(() => {
    if (
      paymentPublicId === undefined ||
      payment === undefined ||
      !isPaymentInProgress(payment.status)
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refetchPayment();
    }, PAYMENT_STATUS_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [paymentPublicId, payment, refetchPayment]);

  // ===========================================================================
  // STK Push Submission
  // ===========================================================================

  const handleSubmit = () => {
    setAmountError(undefined);
    setPaymentMethodError(undefined);
    setFormError(undefined);

    // C2B instructions are displayed separately.
    // This submission handler is only for STK Push.
    if (topUpOption !== 'DEFAULT_NUMBER') {
      return;
    }

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
    // Saved Default Payment Method
    // -------------------------------------------------------------------------

    if (
      !defaultPaymentMethod?.publicId ||
      !defaultPaymentMethod.isActive
    ) {
      setPaymentMethodError(
        'An active default M-PESA payment method is required for STK Push.',
      );
      return;
    }

    // -------------------------------------------------------------------------
    // Amount
    // -------------------------------------------------------------------------

    if (
      !/^\d+$/.test(amount) ||
      !Number.isSafeInteger(Number(amount)) ||
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
      channel: 'STK_PUSH',

      // Send whole KES. Do not multiply by 100 here.
      amount,

      currency: DEFAULT_CURRENCY,
      correlationId,
      methodPublicId: defaultPaymentMethod.publicId,
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
    // Create FinancialPayment
    // -------------------------------------------------------------------------

    createPaymentMutation.mutate(
      {
        accountPublicId: financialAccount.publicId,
        request: parsed.data,
      },
      {
        onSuccess: (createdPayment) => {
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
  // Payment Lifecycle Surface — STK Push Only
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
                  title="Checking payment status"
                  message="We're retrieving the latest status of your top-up."
                />
              </div>
            </section>
          </div>
        </main>
      );
    }

    // -------------------------------------------------------------------------
    // Active Payment
    // -------------------------------------------------------------------------

    if (
      payment.status === 'PENDING' ||
      payment.status === 'PROCESSING'
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
                paymentReference={payment.publicId}
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

            {topUpOption === 'PAYBILL_TILL' &&
            isC2BInstructionsLoading ? (
              <p
                className="text-sm text-[var(--foreground-muted)]"
                aria-live="polite"
              >
                Loading M-PESA payment instructions…
              </p>
            ) : null}

            {/* C2B Instructions Error */}

            {topUpOption === 'PAYBILL_TILL' &&
            isC2BInstructionsError ? (
              <div
                role="alert"
                className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
              >
                {c2bPaymentInstructionsError?.message ??
                  'Unable to load M-PESA payment instructions.'}

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
                You can still use PayBill / Buy Goods, or retry loading
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
