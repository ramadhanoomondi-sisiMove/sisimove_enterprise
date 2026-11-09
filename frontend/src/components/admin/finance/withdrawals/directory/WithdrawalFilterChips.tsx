import type { AdminWithdrawalFilters as Filters } from '@/features/admin/finance/withdrawals/models/admin-withdrawal-filters.model';
import { cn } from '@/foundation/utils/cn';

export interface WithdrawalFilterChipsProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  className?: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
};

const DESTINATION_LABELS: Record<string, string> = {
  MOBILE_MONEY: 'Mobile Money',
  BANK_ACCOUNT: 'Bank Account',
  OTHER: 'Other',
};

export function WithdrawalFilterChips({
  filters,
  onChange,
  className,
}: WithdrawalFilterChipsProps) {
  const activeFilters = [
    filters.search
      ? { key: 'search', label: `Search: ${filters.search}` }
      : null,
    filters.status !== 'ALL'
      ? {
          key: 'status',
          label: `Status: ${STATUS_LABELS[filters.status] ?? filters.status}`,
        }
      : null,
    filters.destinationType !== 'ALL'
      ? {
          key: 'destinationType',
          label: `Destination: ${DESTINATION_LABELS[filters.destinationType] ?? filters.destinationType}`,
        }
      : null,
    filters.accountPublicId
      ? { key: 'accountPublicId', label: `Account: ${filters.accountPublicId}` }
      : null,
    filters.currency
      ? { key: 'currency', label: `Currency: ${filters.currency}` }
      : null,
    filters.dateFrom
      ? { key: 'dateFrom', label: `From: ${filters.dateFrom}` }
      : null,
    filters.dateTo
      ? { key: 'dateTo', label: `To: ${filters.dateTo}` }
      : null,
  ].filter((item): item is { key: string; label: string } => item !== null);

  if (activeFilters.length === 0) {
    return null;
  }

  const removeFilter = (key: string) => {
    const updates: Partial<Filters> = {
      [key]: key === 'status' || key === 'destinationType' ? 'ALL' : '',
    };

    onChange({ ...filters, ...updates });
  };

  const clearAll = () => {
    onChange({
      search: '',
      status: 'ALL',
      destinationType: 'ALL',
      accountPublicId: '',
      currency: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {activeFilters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={() => removeFilter(filter.key)}
          aria-label={`Remove ${filter.label} filter`}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface)]"
        >
          {filter.label}
          <span aria-hidden="true">×</span>
        </button>
      ))}

      <button
        type="button"
        onClick={clearAll}
        className="text-xs font-medium text-[var(--brand)] hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

export default WithdrawalFilterChips;