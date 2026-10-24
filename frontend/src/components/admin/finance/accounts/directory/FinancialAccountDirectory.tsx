
'use client';

import { useMemo, useState } from 'react';

import type { AdminFinancialAccount } from '@/features/admin/finance/accounts/models';
import {
  AdminFinancialAccountStatus,
  AdminFinancialAccountType,
} from '@/features/admin/finance/accounts/models';

import { FinancialAccountDirectoryHeader } from './FinancialAccountDirectoryHeader';
import { FinancialAccountSearch } from './FinancialAccountSearch';
import { FinancialAccountFilters } from './FinancialAccountFilters';
import { FinancialAccountTable } from './FinancialAccountTable';
import { FinancialAccountPagination } from './FinancialAccountPagination';

export interface FinancialAccountDirectoryProps {
  /** The exact collection available to this view. This component does not fetch accounts. */
  accounts: readonly AdminFinancialAccount[];

  /** Whether the caller knows this collection is complete. Defaults to false. */
  collectionIsComplete?: boolean;

  isLoading?: boolean;
  error?: string | null;
  pageSize?: number;
  onRefresh?: () => void;

  /** Opens the account's dedicated detail page. */
  onOpenAccount?: (accountPublicId: string) => void;

  /** Selects an account for the inline overview. */
  onSelectAccount?: (accountPublicId: string) => void;

  formatAmount: (minorUnits: number, currency: string) => string;
}

export function FinancialAccountDirectory({
  accounts,
  collectionIsComplete = false,
  isLoading = false,
  error = null,
  pageSize = 10,
  onRefresh,
  onOpenAccount,
  onSelectAccount,
  formatAmount,
}: FinancialAccountDirectoryProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AdminFinancialAccountStatus | 'ALL'>(
    'ALL',
  );
  const [type, setType] = useState<AdminFinancialAccountType | 'ALL'>('ALL');
  const [currency, setCurrency] = useState('ALL');
  const [ownerPublicId, setOwnerPublicId] = useState('');
  const [page, setPage] = useState(1);

  const currencies = useMemo(
    () => [...new Set(accounts.map((account) => account.currency))].sort(),
    [accounts],
  );

  const filteredAccounts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    const normalizedOwner = ownerPublicId.trim().toLocaleLowerCase();

    return accounts.filter((account) => {
      const matchesSearch =
        !term ||
        [
          account.publicId,
          account.ownerPublicId ?? '',
          account.type,
          account.status,
          account.currency,
        ].some((value) => value.toLocaleLowerCase().includes(term));

      const matchesStatus =
        status === 'ALL' || account.status === status;

      const matchesType = type === 'ALL' || account.type === type;

      const matchesCurrency =
        currency === 'ALL' || account.currency === currency;

      const matchesOwner =
        !normalizedOwner ||
        (account.ownerPublicId ?? '')
          .toLocaleLowerCase()
          .includes(normalizedOwner);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesCurrency &&
        matchesOwner
      );
    });
  }, [accounts, search, status, type, currency, ownerPublicId]);

  const safePageSize = Math.max(1, pageSize);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredAccounts.length / safePageSize),
  );

  const currentPage = Math.min(page, pageCount);

  const pageAccounts = filteredAccounts.slice(
    (currentPage - 1) * safePageSize,
    currentPage * safePageSize,
  );

  const hasFilters = Boolean(
    search.trim() ||
      status !== 'ALL' ||
      type !== 'ALL' ||
      currency !== 'ALL' ||
      ownerPublicId.trim(),
  );

  const resetFilters = () => {
    setSearch('');
    setStatus('ALL');
    setType('ALL');
    setCurrency('ALL');
    setOwnerPublicId('');
    setPage(1);
  };

  return (
    <section className="space-y-5">
      <FinancialAccountDirectoryHeader
        count={filteredAccounts.length}
        totalCount={accounts.length}
        collectionIsComplete={collectionIsComplete}
        onRefresh={onRefresh}
      />

      {!collectionIsComplete && (
        <div className="rounded-xl border border-[var(--warning)]/30 bg-[var(--background-muted)] px-4 py-3 text-sm text-[var(--foreground-secondary)]">
          Showing the accounts supplied to this view. The collection has not
          been confirmed as complete, so these results should not be treated
          as a platform-wide directory.
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-[var(--danger)]/30 bg-[var(--background-muted)] px-4 py-3 text-sm text-[var(--danger)]"
        >
          {error}
        </div>
      )}

      <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_minmax(0,2fr)]">
        <FinancialAccountSearch
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onClear={() => {
            setSearch('');
            setPage(1);
          }}
        />

        <FinancialAccountFilters
          status={status}
          type={type}
          currency={currency}
          ownerPublicId={ownerPublicId}
          currencies={currencies}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          onTypeChange={(value) => {
            setType(value);
            setPage(1);
          }}
          onCurrencyChange={(value) => {
            setCurrency(value);
            setPage(1);
          }}
          onOwnerPublicIdChange={(value) => {
            setOwnerPublicId(value);
            setPage(1);
          }}
          onReset={resetFilters}
        />
      </div>

      <FinancialAccountTable
        accounts={pageAccounts}
        isLoading={isLoading}
        hasFilters={hasFilters}
        onResetFilters={resetFilters}
        onOpenAccount={onOpenAccount}
        onSelectAccount={onSelectAccount}
        formatAmount={formatAmount}
      />

      <FinancialAccountPagination
        page={currentPage}
        pageCount={pageCount}
        pageSize={safePageSize}
        totalCount={filteredAccounts.length}
        onPageChange={setPage}
      />
    </section>
  );
}

export default FinancialAccountDirectory;
