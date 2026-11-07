
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AUTHENTICATED_ROUTES } from '@/foundation/routing/authenticated-routes';

import {
  useMyFinancialAccount,
} from '@/features/financial-account';

import {
  useDefaultPaymentMethod,
} from '@/features/financial-payment-methods';

import {
  createPaymentSchema,
  useCreatePayment,
  useFinancialPayment,
} from '@/features/financial-payments';

import {
  PaymentForm,
  PaymentProcessing,
  PaymentResult,
  type PaymentMethodOption,
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
  return (
    status === 'PENDING' ||
    status === 'PROCESSING'
  );
}

function mapPaymentResultStatus(
  status: FinancialPaymentStatus,
): PaymentResultStatus {
  return status === 'SUCCEEDED'
    ? 'success'
    : 'failed';
}

function getPaymentResultCopy(
  status:
    | 'SUCCEEDED'
    | 'FAILED'
    | 'CANCELLED'
    | 'EXPIRED',
): PaymentResultCopy {
  switch (status) {
    case 'SUCCEEDED':
      return {
        title: 'Top-up successful',
        message:
          'Your payment was completed successfully.',
      };

    case 'CANCELLED':
      return {
        title: 'Top-up cancelled',
        message:
          'This payment was cancelled before it completed.',
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
        message:
          'The payment could not be completed. Please try again.',
      };
  }
}

function createPaymentMethodOption(
  paymentMethod: NonNullable<
    ReturnType<typeof useDefaultPaymentMethod>['data']
  >,
): PaymentMethodOption {
  const displayName =
    paymentMethod.displayName?.trim() ?? '';

  const label =
    displayName.length > 0
      ? displayName
      : paymentMethod.provider;

  const lastFour =
    paymentMethod.lastFour?.trim() ?? '';

  const description =
    lastFour.length > 0
      ? `•••• ${lastFour}`
      : paymentMethod.provider;

  return {
    id: paymentMethod.publicId,
    label,
    description,
    isDefault: paymentMethod.isDefault,
  };
}

// =============================================================================
// Component
// =============================================================================

export function TopUpPageContainer() {
  const router = useRouter();

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
    isLoading: isDefaultPaymentMethodLoading,
    isError: isDefaultPaymentMethodError,
    error: defaultPaymentMethodError,
    refetch: refetchDefaultPaymentMethod,
  } = useDefaultPaymentMethod();

  // ===========================================================================
  // Create Payment
  // ===========================================================================

  const createPaymentMutation = useCreatePayment();

  // ===========================================================================
  // Form State
  // ===========================================================================

  /**
   * Amount is maintained as a string in whole KES.
   *
   * The exact input is preserved.
   *
   * Examples:
   *
   *     "100"  = KES 100
   *     "500"  = KES 500
   *     "1250" = KES 1,250
   *
   * No minor-unit conversion occurs in this container.
   */
  const [
    amount,
    setAmount,
  ] = useState<string>('');

  const [
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
  ] = useState<string>('');

  const [
    amountError,
    setAmountError,
  ] = useState<string | undefined>();

  const [
    paymentMethodError,
    setPaymentMethodError,
  ] = useState<string | undefined>();

  const [
    formError,
    setFormError,
  ] = useState<string | undefined>();

  // ===========================================================================
  // Payment Observation State
  // ===========================================================================

  const [
    paymentPublicId,
    setPaymentPublicId,
  ] = useState<string | undefined>();

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
  // Effective Payment Method
  // ===========================================================================

  const effectivePaymentMethodId =
    selectedPaymentMethodId.trim().length > 0
      ? selectedPaymentMethodId
      : defaultPaymentMethod?.publicId ?? '';

  // ===========================================================================
  // Payment Method Presentation
  // ===========================================================================

  const paymentMethods: PaymentMethodOption[] =
    defaultPaymentMethod
      ? [
          createPaymentMethodOption(
            defaultPaymentMethod,
          ),
        ]
      : [];

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
  }, [
    paymentPublicId,
    payment,
    refetchPayment,
  ]);

  // ===========================================================================
  // Submit
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
    // Payment Method
    // -------------------------------------------------------------------------

    if (
      effectivePaymentMethodId.trim().length === 0
    ) {
      setPaymentMethodError(
        'Select a payment method.',
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
      setAmountError(
        'Enter a valid top-up amount.',
      );

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
      // Send the exact string entered by the member.
      amount,

      currency: DEFAULT_CURRENCY,

      correlationId,

      methodPublicId: effectivePaymentMethodId,
    });

    if (!parsed.success) {
      const fieldErrors =
        parsed.error.flatten().fieldErrors;

      setAmountError(
        fieldErrors.amount?.[0],
      );

      setPaymentMethodError(
        fieldErrors.methodPublicId?.[0],
      );

      setFormError(
        fieldErrors.currency?.[0] ??
          fieldErrors.correlationId?.[0] ??
          fieldErrors.referenceType?.[0],
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
          setPaymentPublicId(
            createdPayment.publicId,
          );
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
    setSelectedPaymentMethodId('');
    setAmountError(undefined);
    setPaymentMethodError(undefined);
    setFormError(undefined);

    createPaymentMutation.reset();
  };

  // ===========================================================================
  // Initial Loading
  // ===========================================================================

  if (
    isAccountLoading ||
    isDefaultPaymentMethodLoading
  ) {
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
  // Initial Data Error
  // ===========================================================================

  if (
    isAccountError ||
    isDefaultPaymentMethodError
  ) {
    const message =
      accountError?.message ??
      defaultPaymentMethodError?.message ??
      'Unable to load your wallet top-up information.';

    return (
      <main className="min-h-screen bg-[var(--background-brand)]">
        <div className="page-container">
          <section className="section">
            <div className="mx-auto max-w-2xl">
              <div className="surface p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--danger)]">
                      Unable to load top-up
                    </p>

                    <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                      {message}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void refetchAccount();
                      void refetchDefaultPaymentMethod();
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
  // Payment Lifecycle Surface
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

    if (
      isPaymentLoading ||
      payment === undefined
    ) {
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

    const resultCopy = getPaymentResultCopy(
      payment.status,
    );

    return (
      <main className="min-h-screen bg-[var(--background-brand)]">
        <div className="page-container">
          <section className="section">
            <div className="mx-auto max-w-2xl">
              <PaymentResult
                status={mapPaymentResultStatus(
                  payment.status,
                )}
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
  // No Default Payment Method
  // ===========================================================================

  if (
    defaultPaymentMethod === null ||
    defaultPaymentMethod === undefined
  ) {
    return (
      <main className="min-h-screen bg-[var(--background-brand)]">
        <div className="page-container">
          <section className="section">
            <div className="mx-auto max-w-2xl">
              <div className="surface p-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      No payment method available
                    </p>

                    <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                      Add a payment method before starting a wallet top-up.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.push(
                        AUTHENTICATED_ROUTES.WALLET_PAYMENT_METHODS,
                      );
                    }}
                  >
                    Add payment method
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
              paymentMethodPublicId={effectivePaymentMethodId}
              paymentMethods={paymentMethods}
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
              onPaymentMethodChange={(paymentMethodPublicId) => {
                setSelectedPaymentMethodId(
                  paymentMethodPublicId,
                );

                setPaymentMethodError(undefined);
                setFormError(undefined);
              }}
              onSubmit={handleSubmit}
              onCancel={handleReset}
            />

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

            {createPaymentMutation.isError &&
            !formError ? (
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
