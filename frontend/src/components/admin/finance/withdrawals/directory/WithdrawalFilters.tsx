
import { Select } from '@/components/ui';

import {
  ADMIN_WITHDRAWAL_DESTINATION_TYPES,
  ADMIN_WITHDRAWAL_STATUSES,
} from '@/features/admin/finance/withdrawals/models/admin-withdrawal.enums';

import type {
  AdminWithdrawalDestinationType,
  AdminWithdrawalStatus,
} from '@/features/admin/finance/withdrawals/models/admin-withdrawal.enums';

import type {
  AdminWithdrawalFilters as Filters,
} from '@/features/admin/finance/withdrawals/models/admin-withdrawal-filters.model';

import { cn } from '@/foundation/utils/cn';

export interface WithdrawalFiltersProps {
  filters: Filters;
  currencies?: readonly string[];
  onChange: (filters: Filters) => void;
  className?: string;
}

const STATUS_LABELS: Record<AdminWithdrawalStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
};

const DESTINATION_LABELS: Record<
  AdminWithdrawalDestinationType,
  string
> = {
  MOBILE_MONEY: 'Mobile Money',
  BANK_ACCOUNT: 'Bank Account',
  OTHER: 'Other',
};

export function WithdrawalFilters({
  filters,
  currencies = [],
  onChange,
  className,
}: WithdrawalFiltersProps) {
  const update = (changes: Partial<Filters>) => {
    onChange({ ...filters, ...changes });
  };

  const handleStatusChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;

    const status = ADMIN_WITHDRAWAL_STATUSES.find(
      (item) => item === value,
    );

    update({
      status: status ?? 'ALL',
    });
  };

  const handleDestinationChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;

    const destinationType = ADMIN_WITHDRAWAL_DESTINATION_TYPES.find(
      (item) => item === value,
    );

    update({
      destinationType: destinationType ?? 'ALL',
    });
  };

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;

    update({
      currency: value === 'ALL' ? '' : value,
    });
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4',
        className,
      )}
    >
      <Select
        value={filters.status}
        onChange={handleStatusChange}
        options={[
          { label: 'All statuses', value: 'ALL' },
          ...ADMIN_WITHDRAWAL_STATUSES.map((status) => ({
            label: STATUS_LABELS[status],
            value: status,
          })),
        ]}
      />

      <Select
        value={filters.destinationType}
        onChange={handleDestinationChange}
        options={[
          { label: 'All destinations', value: 'ALL' },
          ...ADMIN_WITHDRAWAL_DESTINATION_TYPES.map((type) => ({
            label: DESTINATION_LABELS[type],
            value: type,
          })),
        ]}
      />

      <Select
        value={filters.currency || 'ALL'}
        onChange={handleCurrencyChange}
        options={[
          { label: 'All currencies', value: 'ALL' },
          ...currencies.map((currency) => ({
            label: currency,
            value: currency,
          })),
        ]}
      />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label
            htmlFor="withdrawal-date-from"
            className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]"
          >
            From
          </label>

          <input
            id="withdrawal-date-from"
            type="date"
            value={filters.dateFrom}
            onChange={(event) =>
              update({ dateFrom: event.target.value })
            }
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)]"
          />
        </div>

        <div>
          <label
            htmlFor="withdrawal-date-to"
            className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]"
          >
            To
          </label>

          <input
            id="withdrawal-date-to"
            type="date"
            min={filters.dateFrom || undefined}
            value={filters.dateTo}
            onChange={(event) =>
              update({ dateTo: event.target.value })
            }
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)]"
          />
        </div>
      </div>
    </div>
  );
}

export default WithdrawalFilters;
