// -----------------------------------------------------------------------------
// sisiMove — Wallet Page Container
// -----------------------------------------------------------------------------
//
// Authenticated wallet data composition boundary.
//
// Responsibilities:
// - Resolve the authenticated Financial Account.
// - Resolve the authenticated Financial Account Balance.
// - Compose wallet-level presentation data.
// - Provide wallet-level loading and error states.
// - Provide wallet navigation actions.
// - Pass composed financial data into WalletOverview.
//
// Non-responsibilities:
// - Performing HTTP requests directly.
// - Knowing backend API routes.
// - Mapping raw API responses.
// - Implementing financial business rules.
// - Calculating balances.
// - Rendering individual wallet sections.
// - Performing payment operations.
// - Performing withdrawal operations.
// - Loading transaction history until the transaction collection feature exists.
//
// Architecture:
//
//     Authenticated Route
//            │
//            ▼
//     WalletPageContainer
//            │
//       ┌────┴─────────────┐
//       │                  │
//       ▼                  ▼
// useMyFinancialAccount  useMyFinancialBalance
//       │                  │
//       └────────┬─────────┘
//                │
//                ▼
//          WalletOverview
//                │
//       ┌────────┼──────────────────────┐
//       ▼        ▼          ▼           ▼
//    Balance  Breakdown   Status     Actions
//                                      │
//                                      ├── Top up
//                                      ├── Withdraw
//                                      └── Transactions
//
// Financial Account remains the authoritative source for account state.
//
// Financial Account Balance remains the authoritative source for:
// - availableAmount;
// - pendingAmount;
// - heldAmount;
// - currency.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

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
// Wallet Presentation
// -----------------------------------------------------------------------------

import { WalletOverview } from './wallet-overview';
import type { WalletQuickAction } from './wallet-quick-actions';

// =============================================================================
// Shared Link Classes
// =============================================================================
//
// Wallet actions are navigation actions rather than financial mutations.
//
// The destination routes own the corresponding financial workflows.
//
// Keeping the visual treatment here prevents WalletQuickActions from knowing
// anything about routing while allowing this container to compose complete
// wallet navigation.
//
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
  'text-[var(--brand-foreground)]',
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

/**
 * Authenticated wallet screen composition container.
 *
 * This component composes the independently owned Financial Account feature
 * boundaries and passes the resulting state into WalletOverview.
 */
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
  } = useMyFinancialBalance();

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

  const handleRetry = (): void => {
    void refetchAccount();
    void refetchBalance();
  };

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
  // Primary Wallet Actions
  // ---------------------------------------------------------------------------
  //
  // These are navigation-only elements.
  //
  // The wallet container does not perform financial operations itself.
  // The destination feature owns the corresponding transaction flow.
  //
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
  //
  // WalletQuickActions is intentionally presentation-only.
  //
  // Each action receives a ready-to-render Link from this composition
  // boundary. The quick-action component therefore remains unaware of routing.
  //
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
  //
  // A transaction collection API is not currently part of the connected
  // transaction feature, so the wallet does not fabricate recent transactions.
  //
  // The footer still provides the correct navigation boundary for the
  // transaction surface.
  //
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