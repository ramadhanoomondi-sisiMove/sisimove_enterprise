'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Accounts Page
// -----------------------------------------------------------------------------
//
// Platform finance control center composing:
// - Financial Accounts header and toolbar
// - Platform-wide financial account overview
// - Financial account directory
//
// The platform overview summarizes the supplied account collection.
// The directory supports account selection and navigation to account details.
// Account navigation uses canonical routes and public identifiers.
// -----------------------------------------------------------------------------

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

import { useAdminFinancialAccountsList } from '@/features/admin/finance/accounts/hooks';

import {
  FinancialAccountDirectory,
  FinancialAccountOverview,
  FinancialAccountPageContainer,
  FinancialAccountControlCenterHeader,
  FinancialAccountPageToolbar,
} from '@/components/admin/finance/accounts';

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function FinancialAccountsPage() {
  const router = useRouter();

  const {
    accounts,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminFinancialAccountsList();

  // ---------------------------------------------------------------------------
  // Formatting
  // ---------------------------------------------------------------------------

  const formatAmount = useCallback(
    (minorUnits: number, currency: string) =>
      new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency,
      }).format(minorUnits),
    [],
  );

  // ---------------------------------------------------------------------------
  // Navigation and actions
  // ---------------------------------------------------------------------------

  const handleOpenAccount = useCallback(
    (accountPublicId: string) => {
      router.push(ADMIN_ROUTES.FINANCE_ACCOUNT(accountPublicId));
    },
    [router],
  );

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  // ---------------------------------------------------------------------------
  // Collection state
  // ---------------------------------------------------------------------------

  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load financial accounts. Please try again.'
    : null;

  const collectionIsComplete = !isLoading && !isError;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <FinancialAccountPageContainer size="2xl">
      <main className="space-y-6">
        {/* Page header */}

        <FinancialAccountControlCenterHeader
          title="Financial Accounts"
          description="Inspect account details, review balances, and monitor account status across the platform."
        />

        {/* Collection toolbar */}

        <FinancialAccountPageToolbar
          leading={
            <p
              className="text-sm text-[var(--foreground-secondary)]"
              aria-live="polite"
            >
              {isLoading
                ? 'Loading financial accounts…'
                : isError
                  ? 'Financial accounts could not be loaded'
                  : `${accounts.length} account${accounts.length === 1 ? '' : 's'} loaded`}
            </p>
          }
          actions={
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-muted)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Refreshing…' : 'Refresh accounts'}
            </button>
          }
        />

        {/* Platform-wide overview */}

        <FinancialAccountOverview
          accounts={accounts}
          isLoading={isLoading}
          isError={isError}
          collectionIsComplete={collectionIsComplete}
          formatAmount={formatAmount}
        />

        {/* Individual account directory */}

        <FinancialAccountDirectory
          accounts={accounts}
          collectionIsComplete={collectionIsComplete}
          isLoading={isLoading}
          error={errorMessage}
          onRefresh={handleRefresh}
          onOpenAccount={handleOpenAccount}
          onSelectAccount={() => {
            // The overview is platform-wide and does not depend on selection.
            // The directory can still use its own selection behavior.
          }}
          formatAmount={formatAmount}
        />
      </main>
    </FinancialAccountPageContainer>
  );
}
