'use client';

import { useMemo } from 'react';
import { FilterX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import {
  DEFAULT_ADMIN_FINANCIAL_TRANSACTION_FILTERS,
  type AdminFinancialTransaction,
  type AdminFinancialTransactionFilters,
} from '@/features/admin/finance/transactions/models';

import { TransactionDirectoryHeader } from './TransactionDirectoryHeader';
import { TransactionFilters } from './TransactionFilters';
import { TransactionPagination } from './TransactionPagination';
import { TransactionSearch } from './TransactionSearch';
import { TransactionTable } from './TransactionTable';

export interface TransactionDirectoryProps {
  transactions: AdminFinancialTransaction[];
  filters: AdminFinancialTransactionFilters;
  totalItems: number;
  onFiltersChange: (filters: AdminFinancialTransactionFilters) => void;
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  currencies?: string[];
  detailHref?: (publicId: string) => string;
  onViewTransaction?: (transaction: AdminFinancialTransaction) => void;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function TransactionDirectory({
  transactions,
  filters,
  totalItems,
  onFiltersChange,
  isLoading = false,
  error,
  onRetry,
  currencies,
  detailHref,
  onViewTransaction,
  containerSize = '2xl',
}: TransactionDirectoryProps) {
  const isFiltered = useMemo(
    () =>
      Boolean(
        filters.search?.trim() ||
        (filters.status && filters.status !== 'ALL') ||
        (filters.type && filters.type !== 'ALL') ||
        (filters.currency && filters.currency !== 'ALL') ||
        filters.sourceAccountPublicId?.trim() ||
        filters.destinationAccountPublicId?.trim() ||
        filters.reference?.trim() ||
        filters.createdFrom ||
        filters.createdTo
      ),
    [filters],
  );

  const patchFilters = (patch: Partial<AdminFinancialTransactionFilters>) => {
    onFiltersChange({
      ...filters,
      ...patch,
      page: patch.page ?? 1,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      ...DEFAULT_ADMIN_FINANCIAL_TRANSACTION_FILTERS,
    });
  };

  const changePage = (page: number) => {
    onFiltersChange({ ...filters, page });
  };

  const changePageSize = (pageSize: number) => {
    onFiltersChange({ ...filters, page: 1, pageSize });
  };

  const changeSort = (sortBy: NonNullable<AdminFinancialTransactionFilters['sortBy']>) => {
    const sortDirection =
      filters.sortBy === sortBy && filters.sortDirection === 'desc'
        ? 'asc'
        : 'desc';

    onFiltersChange({ ...filters, sortBy, sortDirection, page: 1 });
  };

  return (
    <Container size={containerSize} className="py-6 sm:py-8">
      <div className="space-y-6">
        <TransactionDirectoryHeader resultCount={totalItems} isFiltered={isFiltered} />

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <TransactionSearch
              value={filters.search ?? ''}
              onChange={(search) => patchFilters({ search })}
              disabled={isLoading}
            />
            {isFiltered && (
              <Button
                type="button"
                variant="ghost"
                size="md"
                leadingIcon={<FilterX size={16} />}
                onClick={resetFilters}
                disabled={isLoading}
                className="shrink-0"
              >
                Clear all filters
              </Button>
            )}
          </div>

          <TransactionFilters
            filters={filters}
            onChange={patchFilters}
            onReset={resetFilters}
            currencies={currencies}
            disabled={isLoading}
          />
        </div>

        <TransactionTable
          transactions={transactions}
          filters={filters}
          onSortChange={changeSort}
          isLoading={isLoading}
          error={error}
          onRetry={onRetry}
          onClearFilters={resetFilters}
          detailHref={detailHref}
          onViewTransaction={onViewTransaction}
        />

        {!error && (
          <TransactionPagination
            page={filters.page ?? 1}
            pageSize={filters.pageSize ?? 20}
            totalItems={totalItems}
            onPageChange={changePage}
            onPageSizeChange={changePageSize}
            disabled={isLoading}
          />
        )}
      </div>
    </Container>
  );
}

export default TransactionDirectory;
