
'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Accounts Page
// -----------------------------------------------------------------------------
// Parent control center composing:
// - Financial Account page container
// - Control center header and toolbar
// - Financial account directory
// - Selected financial account overview
//
// The directory remains visible when an account is selected.
// Account navigation uses canonical routes and public identifiers.
// -----------------------------------------------------------------------------

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

import { useAdminFinancialAccountsList } from '@/features/admin/finance/accounts/hooks';

import type { AdminFinancialAccount } from '@/features/admin/finance/accounts/models';

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

  const [selectedAccountPublicId, setSelectedAccountPublicId] =
    useState<string | null>(null);

  const selectedAccount = useMemo<AdminFinancialAccount | null>(
    () =>
      accounts.find(
        (account) => account.publicId === selectedAccountPublicId,
      ) ?? null,
    [accounts, selectedAccountPublicId],
  );

  const formatAmount = useCallback(
    (minorUnits: number, currency: string) =>
      new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency,
      }).format(minorUnits / 100),
    [],
  );

  const handleOpenAccount = useCallback(
    (accountPublicId: string) => {
      router.push(ADMIN_ROUTES.FINANCE_ACCOUNT(accountPublicId));
    },
    [router],
  );

  const handleSelectAccount = useCallback(
    (accountPublicId: string) => {
      setSelectedAccountPublicId((current) =>
        current === accountPublicId ? null : accountPublicId,
      );
    },
    [],
  );

  const handleCloseOverview = useCallback(() => {
    setSelectedAccountPublicId(null);
  }, []);

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load financial accounts. Please try again.'
    : null;

  const collectionIsComplete = !isLoading && !isError;

  return (
    <FinancialAccountPageContainer size="2xl">
      <main className="space-y-6">
        <FinancialAccountControlCenterHeader
          title="Financial Accounts"
          description="Inspect account details, review balances, and monitor account status across the platform."
          actions={
            selectedAccount ? (
              <button
                type="button"
                onClick={handleCloseOverview}
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-muted)]"
              >
                Close account overview
              </button>
            ) : undefined
          }
        />

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

        <FinancialAccountDirectory
          accounts={accounts}
          collectionIsComplete={collectionIsComplete}
          isLoading={isLoading}
          error={errorMessage}
          onRefresh={handleRefresh}
          onOpenAccount={handleOpenAccount}
          onSelectAccount={handleSelectAccount}
          formatAmount={formatAmount}
        />

        {selectedAccount && (
          <section
            aria-label="Selected financial account overview"
            className="space-y-4 border-t border-[var(--border)] pt-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Selected Account Overview
                </h2>
                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  Review the selected account’s status, balance, and ownership.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleOpenAccount(selectedAccount.publicId)
                }
                className="self-start rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 sm:self-auto"
              >
                Open account details
              </button>
            </div>

            <FinancialAccountOverview
              account={selectedAccount}
              formatAmount={formatAmount}
            />
          </section>
        )}
      </main>
    </FinancialAccountPageContainer>
  );
}
