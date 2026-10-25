
// src/components/admin/finance/account-holds/directory/AccountHoldDirectory.tsx

import type {
  AdminAccountHold,
  AdminAccountHoldFilters as HoldFilters,
} from '@/features/admin/finance/holds/models';

import { cn } from '@/foundation/utils/cn';

import { AccountHoldErrorState } from '../shared/AccountHoldErrorState';
import { AccountHoldLoadingState } from '../shared/AccountHoldLoadingState';
import { AccountHoldDirectoryHeader } from './AccountHoldDirectoryHeader';
import { AccountHoldSearch } from './AccountHoldSearch';
import { AccountHoldFilters } from './AccountHoldFilters';
import { AccountHoldTable } from './AccountHoldTable';
import { AccountHoldPagination } from './AccountHoldPagination';

export interface AccountHoldDirectoryProps {
  holds: AdminAccountHold[];
  filters: HoldFilters;
  totalItems: number;
  onFiltersChange: (filters: Partial<HoldFilters>) => void;
  onResetFilters: () => void;
  onViewHold?: (hold: AdminAccountHold) => void;
  currencies?: string[];
  isLoading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function AccountHoldDirectory({
  holds,
  filters,
  totalItems,
  onFiltersChange,
  onResetFilters,
  onViewHold,
  currencies,
  isLoading = false,
  error = false,
  onRetry,
  className,
}: AccountHoldDirectoryProps) {
  const currencyOptions =
    currencies ??
    [...new Set(holds.map((hold) => hold.currency))].sort();

  const currentPage = filters.page ?? 1;
  const currentPageSize = filters.pageSize ?? 20;

  return (
    <section
      aria-label="Account hold directory"
      className={cn(
        'space-y-5 rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] sm:p-6',
        className,
      )}
    >
      <AccountHoldDirectoryHeader
        totalCount={totalItems}
        filteredCount={totalItems}
      />

      <AccountHoldSearch
        value={filters.search ?? ''}
        onChange={(search) => onFiltersChange({ search, page: 1 })}
      />

      <AccountHoldFilters
        filters={filters}
        onChange={onFiltersChange}
        onReset={onResetFilters}
        currencies={currencyOptions}
      />

      {isLoading ? (
        <AccountHoldLoadingState showHeader rows={5} />
      ) : error ? (
        <AccountHoldErrorState
          title="Unable to load account holds"
          description="The account hold directory could not be retrieved. Try again."
          onRetry={onRetry}
        />
      ) : (
        <>
          <AccountHoldTable
            holds={holds}
            onView={onViewHold}
          />

          <AccountHoldPagination
            page={currentPage}
            pageSize={currentPageSize}
            totalItems={totalItems}
            onPageChange={(page) => onFiltersChange({ page })}
            onPageSizeChange={(pageSize) =>
              onFiltersChange({ pageSize, page: 1 })
            }
          />
        </>
      )}
    </section>
  );
}
