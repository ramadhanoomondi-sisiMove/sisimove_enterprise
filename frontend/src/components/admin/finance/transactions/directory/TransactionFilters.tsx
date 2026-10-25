'use client';

import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, type SelectOption } from '@/components/ui/select';
import {
  AdminFinancialTransactionStatus,
  AdminFinancialTransactionType,
  type AdminFinancialTransactionFilters,
} from '@/features/admin/finance/transactions/models';

export interface TransactionFiltersProps {
  filters: AdminFinancialTransactionFilters;
  onChange: (patch: Partial<AdminFinancialTransactionFilters>) => void;
  onReset: () => void;
  currencies?: string[];
  disabled?: boolean;
}

const statusOptions: SelectOption[] = [
  { value: 'ALL', label: 'All statuses' },
  ...Object.values(AdminFinancialTransactionStatus).map((status) => ({
    value: status,
    label: status.charAt(0) + status.slice(1).toLowerCase(),
  })),
];

const typeOptions: SelectOption[] = [
  { value: 'ALL', label: 'All types' },
  ...Object.values(AdminFinancialTransactionType).map((type) => ({
    value: type,
    label: type.charAt(0) + type.slice(1).toLowerCase(),
  })),
];

export function TransactionFilters({
  filters,
  onChange,
  onReset,
  currencies = [],
  disabled = false,
}: TransactionFiltersProps) {
  const currencyOptions: SelectOption[] = [
    { value: 'ALL', label: 'All currencies' },
    ...Array.from(new Set(currencies.map((value) => value.trim().toUpperCase()).filter(Boolean)))
      .sort()
      .map((currency) => ({ value: currency, label: currency })),
  ];

  return (
    <section
      aria-label="Transaction filters"
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Select
          id="transaction-status-filter"
          label="Status"
          value={filters.status ?? 'ALL'}
          options={statusOptions}
          onChange={(event) =>
            onChange({
              status: event.currentTarget.value as AdminFinancialTransactionFilters['status'],
              page: 1,
            })
          }
          disabled={disabled}
        />

        <Select
          id="transaction-type-filter"
          label="Transaction type"
          value={filters.type ?? 'ALL'}
          options={typeOptions}
          onChange={(event) =>
            onChange({
              type: event.currentTarget.value as AdminFinancialTransactionFilters['type'],
              page: 1,
            })
          }
          disabled={disabled}
        />

        <Select
          id="transaction-currency-filter"
          label="Currency"
          value={filters.currency ?? 'ALL'}
          options={currencyOptions}
          onChange={(event) =>
            onChange({
              currency: event.currentTarget.value,
              page: 1,
            })
          }
          disabled={disabled}
        />

        <Input
          id="transaction-reference-filter"
          label="Reference"
          value={filters.reference ?? ''}
          onChange={(event) =>
            onChange({ reference: event.currentTarget.value, page: 1 })
          }
          placeholder="e.g. PAYMENT:SM-123"
          disabled={disabled}
        />

        <Input
          id="transaction-source-account-filter"
          label="Source account ID"
          value={filters.sourceAccountPublicId ?? ''}
          onChange={(event) =>
            onChange({ sourceAccountPublicId: event.currentTarget.value, page: 1 })
          }
          placeholder="Source account public ID"
          disabled={disabled}
        />

        <Input
          id="transaction-destination-account-filter"
          label="Destination account ID"
          value={filters.destinationAccountPublicId ?? ''}
          onChange={(event) =>
            onChange({ destinationAccountPublicId: event.currentTarget.value, page: 1 })
          }
          placeholder="Destination account public ID"
          disabled={disabled}
        />

        <Input
          id="transaction-created-from-filter"
          label="Created from"
          type="date"
          value={filters.createdFrom ?? ''}
          onChange={(event) =>
            onChange({ createdFrom: event.currentTarget.value, page: 1 })
          }
          disabled={disabled}
        />

        <Input
          id="transaction-created-to-filter"
          label="Created to"
          type="date"
          value={filters.createdTo ?? ''}
          onChange={(event) =>
            onChange({ createdTo: event.currentTarget.value, page: 1 })
          }
          min={filters.createdFrom || undefined}
          disabled={disabled}
        />
      </div>

      <div className="mt-4 flex justify-end border-t border-[var(--border-subtle)] pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          leadingIcon={<RotateCcw size={15} />}
          onClick={onReset}
          disabled={disabled}
        >
          Reset filters
        </Button>
      </div>
    </section>
  );
}

export default TransactionFilters;
