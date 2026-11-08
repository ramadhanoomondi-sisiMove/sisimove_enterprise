
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Wallet Page Container
// -----------------------------------------------------------------------------
//
// Authenticated wallet data composition boundary.
//
// Responsibilities:
// - Resolve the authenticated Financial Account.
// - Resolve its Financial Account Balance.
// - Retrieve authenticated user's Financial Transactions.
// - Map transactions into wallet activity presentation data.
// - Compose wallet-level presentation data.
// - Provide wallet-level loading and error states.
// - Provide wallet navigation actions.
//
// Financial Account remains authoritative for account state.
//
// Financial Account Balance remains authoritative for:
// - availableAmount;
// - pendingAmount;
// - heldAmount;
// - currency.
//
// Transaction amounts remain integer minor units.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useCallback,
  useEffect,
} from 'react';

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------

import Link from 'next/link';

// -----------------------------------------------------------------------------
// Authenticated Routes
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
// Financial Transactions
// -----------------------------------------------------------------------------

import {
  useMyFinancialTransactions,
  FinancialTransactionEntryType,
  FinancialBalanceType,
  FinancialTransactionType,
} from '@/features/financial-transactions';

import type {
  FinancialTransaction,
  FinancialTransactionEntry,
} from '@/features/financial-transactions';

// -----------------------------------------------------------------------------
// Wallet Presentation
// -----------------------------------------------------------------------------

import { WalletOverview } from './wallet-overview';

import type {
  WalletActivityItemProps,
} from './wallet-activity-item';

import type {
  WalletQuickAction,
} from './wallet-quick-actions';

// =============================================================================
// Shared Link Classes
// =============================================================================

const primaryActionClassName = [
  'inline-flex',
  'min-h-11',
  'w-full',
  'items-center',
  'justify-center',
  'rounded-[var(--radius-md)]',
  'bg-[var(--brand)]',
  'px-4',
  'text-sm',
  'font-semibold',
  '!text-white',
  'shadow-[var(--shadow-sm)]',
  'transition',
  'hover:bg-[var(--brand-hover)]',
  'active:translate-y-px',
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-[var(--brand)]',
  'focus-visible:ring-offset-2',
  'sm:w-auto',
].join(' ');


const secondaryActionClassName = [
  'inline-flex',
  'min-h-11',
  'w-full',
  'items-center',
  'justify-center',
  'rounded-[var(--radius-md)]',
  'border',
  'border-[var(--border)]',
  'bg-[var(--surface)]',
  'px-4',
  'text-sm',
  'font-semibold',
  'text-[var(--foreground)]',
  'transition',
  'hover:bg-[var(--background-subtle)]',
  'active:translate-y-px',
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-[var(--brand)]',
  'focus-visible:ring-offset-2',
  'sm:w-auto',
].join(' ');

// =============================================================================
// Transaction Presentation Helpers
// =============================================================================

/**
 * Convert a Financial Transaction type into a readable wallet activity title.
 */
function getTransactionTitle(
  type: FinancialTransactionType,
): string {
  const titles: Record<FinancialTransactionType, string> = {
    [FinancialTransactionType.PAYMENT]: 'Payment',
    [FinancialTransactionType.TRANSFER]: 'Transfer',
    [FinancialTransactionType.HOLD]: 'Funds held',
    [FinancialTransactionType.RELEASE]: 'Funds released',
    [FinancialTransactionType.CAPTURE]: 'Payment captured',
    [FinancialTransactionType.SETTLEMENT]: 'Settlement',
    [FinancialTransactionType.DISBURSEMENT]: 'Disbursement',
    [FinancialTransactionType.REFUND]: 'Refund',
    [FinancialTransactionType.REVERSAL]: 'Reversal',
    [FinancialTransactionType.ADJUSTMENT]: 'Balance adjustment',
  };

  return titles[type] ?? 'Wallet transaction';
}

/**
 * Format an ISO date for wallet activity display.
 */
function formatActivityDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Resolve the most appropriate entry belonging to the user's wallet.
 *
 * A transaction may contain multiple entries for different balance
 * categories. Prefer AVAILABLE to avoid showing multiple rows for the
 * same transaction.
 */
function getWalletAccountEntry(
  transaction: FinancialTransaction,
  accountPublicId: string,
): FinancialTransactionEntry | undefined {
  const accountEntries = transaction.entries.filter(
    (entry) => entry.accountPublicId === accountPublicId,
  );

  const preferredBalanceTypes: FinancialBalanceType[] = [
    FinancialBalanceType.AVAILABLE,
    FinancialBalanceType.PENDING,
    FinancialBalanceType.HELD,
  ];

  for (const balanceType of preferredBalanceTypes) {
    const entry = accountEntries.find(
      (candidate) => candidate.balanceType === balanceType,
    );

    if (entry) {
      return entry;
    }
  }

  return undefined;
}

/**
 * Map authenticated wallet transactions into recent activity items.
 *
 * The original transaction timestamp is used for sorting before formatting.
 * Only entries belonging to the authenticated account are displayed.
 */
function mapWalletActivity(
  transactions: FinancialTransaction[],
  accountPublicId: string,
): WalletActivityItemProps[] {
  return [...transactions]
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime(),
    )
    .map((transaction): WalletActivityItemProps | null => {
      const entry = getWalletAccountEntry(
        transaction,
        accountPublicId,
      );

      if (!entry) {
        return null;
      }

      const direction =
        entry.type === FinancialTransactionEntryType.CREDIT
          ? 'in'
          : 'out';

      return {
        id: transaction.publicId,
        title: getTransactionTitle(transaction.type),
        description: transaction.status.toLowerCase(),
        date: formatActivityDate(transaction.createdAt),
        amount: Math.abs(entry.amount),
        currency: entry.currency,
        direction,
      };
    })
    .filter(
      (activity): activity is WalletActivityItemProps =>
        activity !== null,
    )
    .slice(0, 5);
}

// =============================================================================
// Loading State
// =============================================================================

function WalletLoadingState(): ReactNode {
  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container">
        <div className="py-6 sm:py-8 lg:py-10">
          <div className="mb-6 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded-[var(--radius-sm)] bg-[var(--border-subtle)]" />

            <div className="h-8 w-24 animate-pulse rounded-[var(--radius-sm)] bg-[var(--border-subtle)]" />

            <div className="h-4 w-72 max-w-full animate-pulse rounded-[var(--radius-sm)] bg-[var(--border-subtle)]" />
          </div>

          <div className="space-y-4">
            <div className="surface h-32 animate-pulse" />
            <div className="surface h-32 animate-pulse" />
            <div className="surface h-20 animate-pulse" />
            <div className="surface h-32 animate-pulse" />
            <div className="surface h-52 animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Error State
// =============================================================================

interface WalletStateProps {
  readonly message: string;
  readonly onRetry: () => void;
}

function WalletState({
  message,
  onRetry,
}: WalletStateProps): ReactNode {
  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container">
        <div className="py-6 sm:py-8 lg:py-10">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              sisiMove
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl">
              Wallet
            </h1>
          </div>

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
                    We couldn&apos;t load your wallet
                  </p>

                  <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                    Something prevented your financial account data from
                    loading.
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

export function WalletPageContainer(): ReactNode {
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
  } = useMyFinancialBalance(account?.publicId);

  // ---------------------------------------------------------------------------
  // Financial Transactions
  // ---------------------------------------------------------------------------

  const {
    data: transactions,
    getTransactions,
  } = useMyFinancialTransactions();

  // ---------------------------------------------------------------------------
  // Load Transaction History
  // ---------------------------------------------------------------------------

  useEffect(() => {
    void getTransactions().catch(() => {
      // Transaction history is supplementary wallet data.
      // Its failure must not block wallet balance and operations.
    });
  }, [getTransactions]);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  const isLoading =
    accountLoading ||
    balanceLoading;

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  const error =
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

    if (account?.publicId) {
      void refetchBalance();
    }

    void getTransactions().catch(() => {
      // Keep transaction-history errors independent of wallet balance.
    });
  }, [
    account?.publicId,
    refetchAccount,
    refetchBalance,
    getTransactions,
  ]);

  // ---------------------------------------------------------------------------
  // Loading State
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return <WalletLoadingState />;
  }

  // ---------------------------------------------------------------------------
  // Error State
  // ---------------------------------------------------------------------------

  if (error !== null && error !== undefined) {
    return (
      <WalletState
        message={error.message}
        onRetry={handleRetry}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Missing Financial Account
  // ---------------------------------------------------------------------------

  if (account === null || account === undefined) {
    return (
      <WalletState
        message="Your financial account could not be found. Please try again."
        onRetry={handleRetry}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Missing Financial Balance
  // ---------------------------------------------------------------------------

  if (balance === null || balance === undefined) {
    return (
      <WalletState
        message="Your financial account balance could not be loaded."
        onRetry={handleRetry}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Wallet Recent Activity
  // ---------------------------------------------------------------------------

  const recentActivity = mapWalletActivity(
    transactions,
    account.publicId,
  );

  // ---------------------------------------------------------------------------
  // Primary Wallet Actions
  // ---------------------------------------------------------------------------

  const balanceAction: ReactNode = (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
      <Link
        href={AUTHENTICATED_ROUTES.WALLET_TOP_UP}
        className={primaryActionClassName}
      >
        + Top up
      </Link>

      <Link
        href={AUTHENTICATED_ROUTES.WALLET_WITHDRAW}
        className={secondaryActionClassName}
      >
        ↑ Withdraw
      </Link>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Quick Actions
  // ---------------------------------------------------------------------------

  const actions: WalletQuickAction[] = [
    {
      id: 'wallet-top-up',
      label: 'Top up',
      description: 'Add money to your sisiMove wallet.',
      action: (
        <Link
          href={AUTHENTICATED_ROUTES.WALLET_TOP_UP}
          className={primaryActionClassName}
        >
          Top up
        </Link>
      ),
    },

    {
      id: 'wallet-withdraw',
      label: 'Withdraw',
      description: 'Move available funds to your withdrawal destination.',
      action: (
        <Link
          href={AUTHENTICATED_ROUTES.WALLET_WITHDRAW}
          className={secondaryActionClassName}
        >
          Withdraw
        </Link>
      ),
    },

    {
      id: 'wallet-transactions',
      label: 'Transactions',
      description: 'View your wallet activity and transaction details.',
      action: (
        <Link
          href={AUTHENTICATED_ROUTES.WALLET_TRANSACTIONS}
          className={secondaryActionClassName}
        >
          View transactions
        </Link>
      ),
    },
  ];

  // ---------------------------------------------------------------------------
  // Activity Footer
  // ---------------------------------------------------------------------------

  const activityFooter: ReactNode = (
    <div className="flex justify-end">
      <Link
        href={AUTHENTICATED_ROUTES.WALLET_TRANSACTIONS}
        className={[
          'text-sm',
          'font-semibold',
          'text-[var(--brand)]',
          'transition',
          'hover:text-[var(--brand-hover)]',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[var(--brand)]',
          'focus-visible:ring-offset-2',
        ].join(' ')}
      >
        View wallet activity →
      </Link>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Status Message
  // ---------------------------------------------------------------------------

  const statusMessage =
    account.status === 'ACTIVE'
      ? 'Your sisiMove wallet is ready for payments and travel.'
      : account.status === 'SUSPENDED'
        ? 'Wallet operations are currently restricted.'
        : 'This wallet is no longer available for financial operations.';

  // ---------------------------------------------------------------------------
  // Presentation Composition
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container">
        <div className="py-6 sm:py-8 lg:py-10">
          <header className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              Wallet
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl">
              Wallet
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
              Manage your balance, payments and withdrawals.
            </p>
          </header>

          <WalletOverview
            availableAmount={balance.availableAmount}
            pendingAmount={balance.pendingAmount}
            heldAmount={balance.heldAmount}
            currency={balance.currency}
            status={account.status}
            statusMessage={statusMessage}
            actions={actions}
            recentActivity={recentActivity}
            balanceAction={balanceAction}
            activityFooter={activityFooter}
          />
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Default Export
// =============================================================================

export default WalletPageContainer;
