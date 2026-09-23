// -----------------------------------------------------------------------------
// sisiMove — Withdrawal Page Container
// -----------------------------------------------------------------------------
//
// Authenticated withdrawal data and flow composition boundary.
//
// Responsibilities:
// - resolve the authenticated Financial Account;
// - resolve the authenticated Financial Account Balance;
// - own withdrawal form state;
// - prepare the withdrawal request;
// - submit a FinancialAccountWithdrawal through the withdrawal feature;
// - resolve the created withdrawal lifecycle;
// - compose withdrawal presentation states;
// - provide container-level loading and error handling;
// - provide navigation actions.
//
// Non-responsibilities:
// - performing HTTP requests directly;
// - knowing backend HTTP routes;
// - mapping raw API responses;
// - calculating authoritative balances;
// - calculating withdrawal fees;
// - performing withdrawal lifecycle transitions;
// - authorizing withdrawals;
// - validating account ownership;
// - rendering individual withdrawal sections;
// - managing saved withdrawal destinations.
//
// Architecture:
//
//     Authenticated Route
//            │
//            ▼
//     WithdrawalPageContainer
//            │
//       ┌────┼──────────────────────┐
//       │    │                      │
//       ▼    ▼                      ▼
//    Account Balance         Withdrawal Feature
//                              │
//                         ┌────┴─────┐
//                         ▼          ▼
//                       Create     Detail
//                         │          │
//                         └────┬─────┘
//                              ▼
//                    Withdrawal Presentation
//                         │       │       │
//                         ▼       ▼       ▼
//                        Form  Processing Result
//
// Financial Account Balance remains authoritative for:
// - availableAmount;
// - pendingAmount;
// - heldAmount;
// - currency.
//
// The withdrawal returned by the backend remains authoritative for:
// - amount;
// - currency;
// - destination;
// - lifecycle status;
// - lifecycle timestamps.
//
// Monetary values remain integer minor units at the feature boundary.
//
// Presentation formatting belongs to the foundation financial-formatting
// boundary. This container must not introduce a second financial formatter.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useCallback,
  useState,
  type ReactNode,
} from 'react';

import { useRouter } from 'next/navigation';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AUTHENTICATED_ROUTES } from '@/foundation/routing/authenticated-routes';

// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

import {
  useMyFinancialAccount,
  useMyFinancialBalance,
} from '@/features/financial-account';

// -----------------------------------------------------------------------------
// Financial Withdrawals
// -----------------------------------------------------------------------------

import {
  useCreateWithdrawal,
  useFinancialWithdrawal,
} from '@/features/financial-withdrawals';

import type {
  CreateWithdrawalRequest,
  FinancialWithdrawal,
  FinancialWithdrawalStatus,
} from '@/features/financial-withdrawals';

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

import {
  WithdrawalForm,
  WithdrawalProcessing,
  WithdrawalResult,
  WithdrawalSummary,
} from './index';

// =============================================================================
// Constants
// =============================================================================

const DEFAULT_CURRENCY = 'KES';

const DESTINATION_TYPE_OPTIONS = [
  {
    value: 'MOBILE_MONEY',
    label: 'Mobile money',
    description: 'Send funds to a mobile money number.',
  },
  {
    value: 'BANK_ACCOUNT',
    label: 'Bank account',
    description: 'Send funds to a bank account.',
  },
  {
    value: 'OTHER',
    label: 'Other destination',
    description: 'Provide another supported destination.',
  },
] as const;

type DestinationType =
  (typeof DESTINATION_TYPE_OPTIONS)[number]['value'];

type DestinationMode =
  | 'REGISTERED_NUMBER'
  | 'OTHER_DESTINATION';

// =============================================================================
// Helpers
// =============================================================================

/**
 * Convert a user-entered major-unit amount into integer minor units.
 *
 * Examples:
 *
 *     "1250"   → "125000"
 *     "1250.5" → "125050"
 *     "1250.50" → "125050"
 *
 * This is input normalization only.
 *
 * The container does not perform financial calculations such as:
 * - fees;
 * - exchange rates;
 * - available-balance adjustments;
 * - receive amounts.
 */
function toMinorUnitString(
  value: string,
): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    return '';
  }

  if (!/^\d+(?:\.\d{0,2})?$/.test(normalized)) {
    return '';
  }

  const [wholePart, fractionalPart = ''] =
    normalized.split('.');

  return `${wholePart}${fractionalPart.padEnd(2, '0')}`;
}

/**
 * Format an integer minor-unit amount for presentation.
 *
 * This helper intentionally accepts minor units.
 *
 * Example:
 *
 *     125050 → "1,250.50"
 *
 * Currency is supplied separately because the presentation component decides
 * how the currency label is rendered.
 */
function formatMinorUnits(
  amount: number,
): string {
  return (amount / 100).toLocaleString(
    'en-KE',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );
}

/**
 * Safely extract an application error message.
 */
function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    error instanceof Error &&
    error.message.trim().length > 0
  ) {
    return error.message;
  }

  return fallback;
}

/**
 * Determine whether the authoritative withdrawal lifecycle is still active.
 */
function isWithdrawalProcessing(
  status: FinancialWithdrawalStatus,
): boolean {
  return (
    status === 'PENDING' ||
    status === 'PROCESSING'
  );
}

/**
 * Determine whether the authoritative withdrawal lifecycle is terminal.
 */
function isWithdrawalTerminal(
  status: FinancialWithdrawalStatus,
): boolean {
  return (
    status === 'COMPLETED' ||
    status === 'FAILED' ||
    status === 'CANCELLED'
  );
}

/**
 * Convert the backend lifecycle status into the presentation component's
 * terminal-state union.
 *
 * This function is only called after terminality has already been established.
 */
function toWithdrawalResultStatus(
  status: FinancialWithdrawalStatus,
): 'COMPLETED' | 'FAILED' | 'CANCELLED' {
  switch (status) {
    case 'COMPLETED':
      return 'COMPLETED';

    case 'CANCELLED':
      return 'CANCELLED';

    case 'FAILED':
      return 'FAILED';

    default:
      return 'FAILED';
  }
}

// =============================================================================
// Loading State
// =============================================================================

function WithdrawalLoadingState(): ReactNode {
  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container">
        <div className="py-6 sm:py-8 lg:py-10">
          <div className="mb-6 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded-[var(--radius-sm)] bg-[var(--border-subtle)]" />

            <div className="h-8 w-28 animate-pulse rounded-[var(--radius-sm)] bg-[var(--border-subtle)]" />

            <div className="h-4 w-80 max-w-full animate-pulse rounded-[var(--radius-sm)] bg-[var(--border-subtle)]" />
          </div>

          <div className="space-y-4">
            <div className="surface h-28 animate-pulse" />

            <div className="surface h-64 animate-pulse" />

            <div className="surface h-48 animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Error State
// =============================================================================

interface WithdrawalStateProps {
  readonly message: string;
  readonly onRetry: () => void;
}

function WithdrawalState({
  message,
  onRetry,
}: WithdrawalStateProps): ReactNode {
  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container">
        <div className="py-6 sm:py-8 lg:py-10">
          <header className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              Financial account
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl">
              Withdraw
            </h1>
          </header>

          <section
            className={[
              'overflow-hidden',
              'rounded-[var(--radius-2xl)]',
              'border',
              'border-[var(--border)]',
              'bg-[var(--surface)]',
              'shadow-[var(--shadow-sm)]',
            ].join(' ')}
          >
            <div className="border-b border-[var(--border-subtle)] bg-[var(--background-subtle)] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span
                  className={[
                    'flex h-9 w-9 shrink-0 items-center justify-center',
                    'rounded-full',
                    'bg-[var(--danger-soft)]',
                    'text-sm font-semibold',
                    'text-[var(--danger)]',
                  ].join(' ')}
                  aria-hidden="true"
                >
                  !
                </span>

                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    We couldn&apos;t load your withdrawal screen
                  </p>

                  <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                    Something prevented your financial account data from loading.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
                {message}
              </p>

              <button
                type="button"
                onClick={onRetry}
                className={[
                  'mt-5',
                  'inline-flex min-h-10 items-center justify-center',
                  'rounded-[var(--radius-md)]',
                  'bg-[var(--brand)]',
                  'px-4',
                  'text-sm font-semibold',
                  'text-[var(--brand-foreground)]',
                  'shadow-[var(--shadow-sm)]',
                  'transition',
                  'hover:bg-[var(--brand-hover)]',
                  'active:translate-y-px',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-[var(--brand)]',
                  'focus-visible:ring-offset-2',
                ].join(' ')}
              >
                Try again
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Component
// =============================================================================

export function WithdrawalPageContainer(): ReactNode {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Financial Account
  // ---------------------------------------------------------------------------

  const {
    data: account,
    isLoading: accountLoading,
    isError: accountIsError,
    error: accountError,
    refetch: refetchAccount,
  } = useMyFinancialAccount();

  // ---------------------------------------------------------------------------
  // Financial Balance
  // ---------------------------------------------------------------------------

  const {
    data: balance,
    isLoading: balanceLoading,
    isError: balanceIsError,
    error: balanceError,
    refetch: refetchBalance,
  } = useMyFinancialBalance();

  // ---------------------------------------------------------------------------
  // Withdrawal Mutation
  // ---------------------------------------------------------------------------

  const createWithdrawalMutation =
    useCreateWithdrawal();

  // ---------------------------------------------------------------------------
  // Form State
  // ---------------------------------------------------------------------------

  const [amount, setAmount] = useState('');

  /**
   * Registered-number withdrawal cannot currently be submitted unless the
   * authenticated profile boundary supplies the registered number.
   *
   * Therefore the explicit-destination path is the usable initial state.
   */
  const [destinationMode, setDestinationMode] =
    useState<DestinationMode>(
      'OTHER_DESTINATION',
    );

  const [destinationType, setDestinationType] =
    useState<DestinationType>(
      'MOBILE_MONEY',
    );

  const [destinationValue, setDestinationValue] =
    useState('');

  const [formError, setFormError] =
    useState<string>();

  // ---------------------------------------------------------------------------
  // Created Withdrawal
  // ---------------------------------------------------------------------------
  //
  // The create mutation supplies the authoritative public withdrawal ID.
  //
  // Once that ID exists, useFinancialWithdrawal becomes the authoritative
  // lifecycle source for the withdrawal.
  //
  // ---------------------------------------------------------------------------

  const [
    createdWithdrawalPublicId,
    setCreatedWithdrawalPublicId,
  ] = useState<string>();

  const {
    data: withdrawal,
    isLoading: withdrawalLoading,
    isError: withdrawalIsError,
    error: withdrawalError,
    refetch: refetchWithdrawal,
  } = useFinancialWithdrawal(
    createdWithdrawalPublicId,
  );

  // ---------------------------------------------------------------------------
  // Account / Balance Loading
  // ---------------------------------------------------------------------------

  const isAccountLoading =
    accountLoading ||
    balanceLoading;

  // ---------------------------------------------------------------------------
  // Account / Balance Error
  // ---------------------------------------------------------------------------

  const accountDataError =
    accountIsError
      ? accountError
      : balanceIsError
        ? balanceError
        : null;

  // ---------------------------------------------------------------------------
  // Retry
  // ---------------------------------------------------------------------------

  const handleRetry = useCallback((): void => {
    void refetchAccount();
    void refetchBalance();
  }, [
    refetchAccount,
    refetchBalance,
  ]);

  // ---------------------------------------------------------------------------
  // Form Normalization
  // ---------------------------------------------------------------------------

  const normalizedAmount =
    amount.trim();

  const amountInMinorUnits =
    toMinorUnitString(normalizedAmount);

  const hasValidAmount =
    amountInMinorUnits.length > 0 &&
    Number.isSafeInteger(
      Number(amountInMinorUnits),
    ) &&
    Number(amountInMinorUnits) > 0;

  const effectiveDestinationValue =
    destinationMode === 'REGISTERED_NUMBER'
      ? ''
      : destinationValue.trim();

  const hasValidDestination =
    destinationMode === 'REGISTERED_NUMBER'
      ? false
      : effectiveDestinationValue.length > 0;

  const isFormSubmittable =
    !createWithdrawalMutation.isPending &&
    hasValidAmount &&
    hasValidDestination;

  // ---------------------------------------------------------------------------
  // Withdrawal Destination
  // ---------------------------------------------------------------------------

  const withdrawalDestinationType =
    destinationMode === 'REGISTERED_NUMBER'
      ? 'MOBILE_MONEY'
      : destinationType;

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmit = useCallback((): void => {
    setFormError(undefined);

    if (!account) {
      setFormError(
        'Your financial account could not be loaded.',
      );

      return;
    }

    if (!balance) {
      setFormError(
        'Your financial account balance could not be loaded.',
      );

      return;
    }

    if (!hasValidAmount) {
      setFormError(
        'Enter a valid withdrawal amount.',
      );

      return;
    }

    if (
      destinationMode === 'REGISTERED_NUMBER'
    ) {
      setFormError(
        'Your registered withdrawal number is not currently available to the withdrawal flow.',
      );

      return;
    }

    if (
      effectiveDestinationValue.length === 0
    ) {
      setFormError(
        'Enter a withdrawal destination.',
      );

      return;
    }

    const request: CreateWithdrawalRequest = {
      amount: amountInMinorUnits,
      currency:
        balance.currency ||
        DEFAULT_CURRENCY,
      destinationType:
        withdrawalDestinationType,
      destinationValue:
        effectiveDestinationValue,
      correlationId:
        crypto.randomUUID(),
    };

    createWithdrawalMutation.mutate(
      {
        accountPublicId:
          account.publicId,
        request,
      },
      {
        onSuccess: (
          createdWithdrawal: FinancialWithdrawal,
        ): void => {
          setFormError(undefined);

          setCreatedWithdrawalPublicId(
            createdWithdrawal.publicId,
          );
        },

        onError: (
          error: Error,
        ): void => {
          setFormError(
            getErrorMessage(
              error,
              'Your withdrawal could not be submitted.',
            ),
          );
        },
      },
    );
  }, [
    account,
    balance,
    amountInMinorUnits,
    destinationMode,
    effectiveDestinationValue,
    hasValidAmount,
    withdrawalDestinationType,
    createWithdrawalMutation,
  ]);

  // ---------------------------------------------------------------------------
  // Cancel / Back
  // ---------------------------------------------------------------------------

  const handleCancel = useCallback((): void => {
    router.back();
  }, [router]);

  // ---------------------------------------------------------------------------
  // Withdrawal Lifecycle
  // ---------------------------------------------------------------------------

  const withdrawalIsProcessing =
    withdrawal !== undefined &&
    isWithdrawalProcessing(
      withdrawal.status,
    );

  const withdrawalIsTerminal =
    withdrawal !== undefined &&
    isWithdrawalTerminal(
      withdrawal.status,
    );

  // ---------------------------------------------------------------------------
  // Safe Destination Presentation
  // ---------------------------------------------------------------------------
  //
  // The backend destination value is not independently transformed here.
  //
  // The withdrawal feature should expose a presentation-safe/masked value if
  // the value is sensitive. Until that contract exists, the form's explicit
  // destination is used only before the withdrawal has been created.
  //
  // ---------------------------------------------------------------------------

  const withdrawalDestinationLabel =
    withdrawal?.destinationValue ??
    (
      destinationMode === 'OTHER_DESTINATION'
        ? effectiveDestinationValue
        : undefined
    );

  // ---------------------------------------------------------------------------
  // Initial Account / Balance Loading
  // ---------------------------------------------------------------------------

  if (isAccountLoading) {
    return <WithdrawalLoadingState />;
  }

  // ---------------------------------------------------------------------------
  // Initial Account / Balance Error
  // ---------------------------------------------------------------------------

  if (
    accountDataError !== null &&
    accountDataError !== undefined
  ) {
    return (
      <WithdrawalState
        message={getErrorMessage(
          accountDataError,
          'Your financial account data could not be loaded.',
        )}
        onRetry={handleRetry}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Missing Account
  // ---------------------------------------------------------------------------

  if (!account) {
    return (
      <WithdrawalState
        message="Your financial account could not be found. Please try again."
        onRetry={handleRetry}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Missing Balance
  // ---------------------------------------------------------------------------

  if (!balance) {
    return (
      <WithdrawalState
        message="Your financial account balance could not be loaded."
        onRetry={handleRetry}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Withdrawal Lifecycle Loading
  // ---------------------------------------------------------------------------

  if (
    createdWithdrawalPublicId &&
    withdrawalLoading
  ) {
    return (
      <main className="min-h-screen bg-[var(--background-brand)]">
        <div className="page-container">
          <div className="py-6 sm:py-8 lg:py-10">
            <WithdrawalProcessing
              amountLabel={`${balance.currency || DEFAULT_CURRENCY} ${formatMinorUnits(
                Number(amountInMinorUnits),
              )}`}
              status="PENDING"
              destinationLabel={
                withdrawalDestinationLabel
              }
            />
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Withdrawal Lifecycle Error
  // ---------------------------------------------------------------------------
  //
  // IMPORTANT:
  //
  // A failure to retrieve withdrawal status is NOT equivalent to a backend
  // withdrawal status of FAILED.
  //
  // We therefore keep the user in a status-confirmation error state rather
  // than presenting a false terminal financial outcome.
  //
  // ---------------------------------------------------------------------------

  if (
    createdWithdrawalPublicId &&
    withdrawalIsError
  ) {
    return (
      <main className="min-h-screen bg-[var(--background-brand)]">
        <div className="page-container">
          <div className="py-6 sm:py-8 lg:py-10">
            <WithdrawalResult
              status="FAILED"
              amountLabel={`${balance.currency || DEFAULT_CURRENCY} ${formatMinorUnits(
                Number(amountInMinorUnits),
              )}`}
              destinationLabel={
                withdrawalDestinationLabel
              }
              message={getErrorMessage(
                withdrawalError,
                'We could not confirm the current withdrawal status.',
              )}
              primaryActionLabel="Try again"
              onPrimaryAction={(): void => {
                void refetchWithdrawal();
              }}
              secondaryActionLabel="Back to wallet"
              onSecondaryAction={(): void => {
                router.push(
                  AUTHENTICATED_ROUTES.WALLET,
                );
              }}
            />
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Processing State
  // ---------------------------------------------------------------------------

  if (
    withdrawal &&
    withdrawalIsProcessing
  ) {
    return (
      <main className="min-h-screen bg-[var(--background-brand)]">
        <div className="page-container">
          <div className="py-6 sm:py-8 lg:py-10">
            <WithdrawalProcessing
              amountLabel={`${withdrawal.currency} ${formatMinorUnits(
                withdrawal.amount,
              )}`}
              status={
                withdrawal.status === 'PROCESSING'
                  ? 'PROCESSING'
                  : 'PENDING'
              }
              destinationLabel={
                withdrawalDestinationLabel
              }
            />
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Terminal State
  // ---------------------------------------------------------------------------

  if (
    withdrawal &&
    withdrawalIsTerminal
  ) {
    const resultStatus =
      toWithdrawalResultStatus(
        withdrawal.status,
      );

    const isCompleted =
      withdrawal.status === 'COMPLETED';

    const isCancelled =
      withdrawal.status === 'CANCELLED';

    return (
      <main className="min-h-screen bg-[var(--background-brand)]">
        <div className="page-container">
          <div className="py-6 sm:py-8 lg:py-10">
            <WithdrawalResult
              status={resultStatus}
              amountLabel={`${withdrawal.currency} ${formatMinorUnits(
                withdrawal.amount,
              )}`}
              destinationLabel={
                withdrawalDestinationLabel
              }
              message={
                isCompleted
                  ? 'Your withdrawal has been completed.'
                  : isCancelled
                    ? 'This withdrawal was cancelled.'
                    : 'Your withdrawal could not be completed.'
              }
              primaryActionLabel={
                isCompleted
                  ? 'Go to wallet'
                  : 'Try again'
              }
              onPrimaryAction={(): void => {
                if (isCompleted) {
                  router.push(
                    AUTHENTICATED_ROUTES.WALLET,
                  );

                  return;
                }

                router.refresh();
              }}
              secondaryActionLabel="Back to wallet"
              onSecondaryAction={(): void => {
                router.push(
                  AUTHENTICATED_ROUTES.WALLET,
                );
              }}
            />
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Withdrawal Form
  // ---------------------------------------------------------------------------

  const currency =
    balance.currency ||
    DEFAULT_CURRENCY;

  const availableAmountLabel =
    `${currency} ${formatMinorUnits(
      balance.availableAmount,
    )}`;

  const summaryAmountLabel =
    normalizedAmount.length > 0
      ? `${currency} ${normalizedAmount}`
      : `${currency} 0.00`;

  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container">
        <div className="py-6 sm:py-8 lg:py-10">
          <header className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              Financial account
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl">
              Withdraw
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
              Move available funds from your sisiMove wallet to a destination.
            </p>
          </header>

          <div className="space-y-4">
            <WithdrawalForm
              availableAmount={
                balance.availableAmount
              }
              currency={currency}
              availableAmountLabel={
                availableAmountLabel
              }
              amount={amount}
              onAmountChange={(
                value: string,
              ): void => {
                setFormError(undefined);
                setAmount(value);
              }}
              destinationMode={
                destinationMode
              }
              onDestinationModeChange={(
                mode: DestinationMode,
              ): void => {
                setFormError(undefined);
                setDestinationMode(mode);
              }}
              destinationType={
                destinationType
              }
              onDestinationTypeChange={(
                type: DestinationType,
              ): void => {
                setFormError(undefined);
                setDestinationType(type);
              }}
              destinationValue={
                destinationValue
              }
              onDestinationValueChange={(
                value: string,
              ): void => {
                setFormError(undefined);
                setDestinationValue(value);
              }}
              destinationTypeOptions={
                DESTINATION_TYPE_OPTIONS
              }
              amountError={
                normalizedAmount.length > 0 &&
                !hasValidAmount
                  ? 'Enter a valid withdrawal amount.'
                  : undefined
              }
              destinationError={
                destinationMode ===
                  'OTHER_DESTINATION' &&
                effectiveDestinationValue.length === 0
                  ? 'Destination is required.'
                  : undefined
              }
              formError={
                formError
              }
              isSubmitting={
                createWithdrawalMutation.isPending
              }
              isSubmitDisabled={
                !isFormSubmittable
              }
              onCancel={
                handleCancel
              }
              onSubmit={
                handleSubmit
              }
            />

            <WithdrawalSummary
              currency={currency}
              amountLabel={
                summaryAmountLabel
              }
              feeLabel="Confirmed by the withdrawal service when applicable"
              receiveAmountLabel="Confirmed by the withdrawal service"
              destinationLabel={
                destinationMode ===
                'OTHER_DESTINATION'
                  ? effectiveDestinationValue
                  : 'Registered number'
              }
              supportingContent={
                <p className="text-xs leading-5 text-[var(--foreground-muted)]">
                  The final withdrawal result is determined by the
                  financial service after the request is submitted.
                </p>
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Default Export
// =============================================================================

export default WithdrawalPageContainer;

