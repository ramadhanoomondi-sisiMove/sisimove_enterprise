/**
 * sisiMove Admin — Payment Method Directory
 *
 * Composition root for search, filters, table, and pagination. The feature
 * hook owns retrieval and client-side query behavior; this component owns
 * only presentation state.
 */
'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui';
import type { AdminPaymentMethodSummary } from '@/features/admin/finance/payment-methods/models';
import { useAdminPaymentMethods } from '@/features/admin/finance/payment-methods/hooks/useAdminPaymentMethods';
import { PaymentMethodDirectoryHeader } from './PaymentMethodDirectoryHeader';
import { PaymentMethodSearch } from './PaymentMethodSearch';
import { PaymentMethodFilters, type PaymentMethodFiltersValue } from './PaymentMethodFilters';
import { PaymentMethodFilterChips } from './PaymentMethodFilterChips';
import { PaymentMethodTable } from './PaymentMethodTable';
import { PaymentMethodTableSkeleton } from './PaymentMethodTableSkeleton';
import { PaymentMethodPagination } from './PaymentMethodPagination';
import { PaymentMethodErrorState } from '../shared';

export interface PaymentMethodDirectoryProps {
  onSelectPaymentMethod?: (paymentMethod: AdminPaymentMethodSummary) => void;
  onCreatePaymentMethod?: () => void;
  canCreate?: boolean;
  className?: string;
}

const INITIAL_FILTERS: PaymentMethodFiltersValue = {
  status: 'all',
  defaultFilter: 'all',
  type: '',
  provider: '',
};

export function PaymentMethodDirectory({
  onSelectPaymentMethod,
  onCreatePaymentMethod,
  canCreate = false,
  className,
}: PaymentMethodDirectoryProps) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<PaymentMethodFiltersValue>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  /*
   * Adapt the visible directory controls to the established hook contract:
   * `types`, `providers`, `activeState`, and `defaultState`.
   */
  const hookFilters = useMemo(() => ({
    search,
    types: filters.type ? [filters.type] : [],
    providers: filters.provider ? [filters.provider] : [],
    activeState: filters.status,
    defaultState: filters.defaultFilter,
  }), [search, filters]);

  const directory = useAdminPaymentMethods(hookFilters, { page, pageSize });

  const items = directory.paymentMethods ?? [];
  const totalItems = directory.totalFiltered ?? items.length;
  const totalPages = directory.totalPages ?? Math.ceil(totalItems / pageSize);
  const isLoading = Boolean(directory.isLoading);
  const isFetching = isLoading;
  const error = directory.error;
  const filterOptions = useMemo(() => {
    const all = directory.allPaymentMethods ?? [];
    return {
      types: [...new Set(all.map((item: AdminPaymentMethodSummary) => item.type).filter(Boolean))].sort(),
      providers: [...new Set(all.map((item: AdminPaymentMethodSummary) => item.provider).filter(Boolean))].sort(),
    };
  }, [directory.allPaymentMethods]);

  const hasFilters = Boolean(search.trim()) ||
    filters.status !== 'all' ||
    filters.defaultFilter !== 'all' ||
    Boolean(filters.type) ||
    Boolean(filters.provider);

  const clearFilters = () => {
    setSearch('');
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  const removeChip = (key: keyof PaymentMethodFiltersValue | 'search') => {
    if (key === 'search') setSearch('');
    else setFilters((current) => ({ ...current, [key]: key === 'status' ? 'all' : key === 'defaultFilter' ? 'all' : '' }));
    setPage(1);
  };

  const changeFilters = (next: PaymentMethodFiltersValue) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <section className={['space-y-6', className].filter(Boolean).join(' ')}>
      <PaymentMethodDirectoryHeader
        total={totalItems}
        isRefreshing={isFetching && !isLoading}
        onRefresh={() => { void directory.refetch?.(); }}
        onCreate={onCreatePaymentMethod}
        canCreate={canCreate}
      />

      <Card padding="md" className="space-y-4">
        <PaymentMethodSearch value={search} onChange={(value) => { setSearch(value); setPage(1); }} />
        <PaymentMethodFilters
          value={filters}
          options={filterOptions}
          onChange={changeFilters}
          onClear={clearFilters}
        />
        <PaymentMethodFilterChips value={filters} search={search} onRemove={removeChip} />
      </Card>

      {error ? (
        <PaymentMethodErrorState
          onRetry={() => { void directory.refetch?.(); }}
        />
      ) : (
        <>
          {isLoading ? (
            <PaymentMethodTableSkeleton rows={pageSize > 10 ? 6 : pageSize} />
          ) : (
            <PaymentMethodTable
              items={items}
              hasFilters={hasFilters}
              onClearFilters={clearFilters}
              onSelect={onSelectPaymentMethod}
            />
          )}
          {!isLoading && (
            <PaymentMethodPagination
              page={directory.currentPage ?? page}
              pageSize={directory.pageSize ?? pageSize}
              totalItems={totalItems}
              totalPages={totalPages}
              hasPreviousPage={page > 1}
              hasNextPage={page < totalPages}
              onPageChange={(nextPage) => setPage(Math.max(1, Math.min(totalPages || 1, nextPage)))}
              onPageSizeChange={(nextSize) => { setPageSize(nextSize); setPage(1); }}
            />
          )}
        </>
      )}
    </section>
  );
}

export default PaymentMethodDirectory;
