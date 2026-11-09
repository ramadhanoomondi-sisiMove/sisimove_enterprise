
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

import { DEFAULT_ADMIN_WITHDRAWAL_PAGE } from '@/features/admin/finance/withdrawals/models/admin-withdrawal-page.model';

import { useAdminWithdrawalFilters } from '@/features/admin/finance/withdrawals/hooks/useAdminWithdrawalFilters';
import { useAdminWithdrawals } from '@/features/admin/finance/withdrawals/hooks/useAdminWithdrawals';

import { WithdrawalErrorState } from '../shared/WithdrawalErrorState';

import WithdrawalDirectoryHeader from './WithdrawalDirectoryHeader';
import WithdrawalSearch from './WithdrawalSearch';
import WithdrawalFilters from './WithdrawalFilters';
import WithdrawalFilterChips from './WithdrawalFilterChips';
import WithdrawalTable from './WithdrawalTable';
import WithdrawalPagination from './WithdrawalPagination';

import { cn } from '@/foundation/utils/cn';

export interface WithdrawalDirectoryProps {
  className?: string;
}

export function WithdrawalDirectory({
  className,
}: WithdrawalDirectoryProps) {
  const router = useRouter();

  const { filters, setFilters } = useAdminWithdrawalFilters();

  const [pagination, setPagination] = useState(
    DEFAULT_ADMIN_WITHDRAWAL_PAGE,
  );

  const {
    withdrawals,
    allWithdrawals,
    totalFiltered,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminWithdrawals(filters, pagination);

  const currencies = useMemo(
    () =>
      Array.from(
        new Set(
          allWithdrawals
            .map((withdrawal) => withdrawal.currency)
            .filter(Boolean),
        ),
      ).sort(),
    [allWithdrawals],
  );

  const handleFiltersChange = (
    nextFilters: typeof filters,
  ) => {
    setFilters(nextFilters);

    setPagination((current) => ({
      ...current,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setPagination((current) => ({
      ...current,
      page,
    }));
  };

  const handleSelectWithdrawal = (
    withdrawal: AdminWithdrawal,
  ) => {
    router.push(
      ADMIN_ROUTES.FINANCE_WITHDRAWAL(withdrawal.publicId),
    );
  };

  if (isError) {
    return (
      <WithdrawalErrorState
        title="Unable to load withdrawal records"
        description={
          error instanceof Error
            ? error.message
            : 'We could not retrieve the withdrawal records.'
        }
        onRetry={() => void refetch()}
        className={className}
      />
    );
  }

  return (
    <section className={cn('space-y-5', className)}>
      <WithdrawalDirectoryHeader
        totalWithdrawals={totalFiltered}
        onRefresh={() => void refetch()}
        isFetching={isFetching}
      />

      <div className="space-y-3">
        <WithdrawalSearch
          value={filters.search}
          onChange={(search) =>
            handleFiltersChange({ ...filters, search })
          }
        />

        <WithdrawalFilters
          filters={filters}
          currencies={currencies}
          onChange={handleFiltersChange}
        />

        <WithdrawalFilterChips
          filters={filters}
          onChange={handleFiltersChange}
        />
      </div>

      <WithdrawalTable
        withdrawals={withdrawals}
        isLoading={isLoading}
        onSelect={handleSelectWithdrawal}
      />

      {!isLoading && (
        <WithdrawalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalFiltered}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
}

export default WithdrawalDirectory;
