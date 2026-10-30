/**
 * sisiMove Admin — Payment Method Filters
 *
 * Filter controls are presentation-only. Domain values remain owned by the
 * payment-method model and are passed to the directory controller.
 */
import type { AdminPaymentMethodFilterOptions } from '@/features/admin/finance/payment-methods/models';
import { Button } from '@/components/ui';
import { X } from 'lucide-react';

export type PaymentMethodDirectoryStatus = 'all' | 'active' | 'inactive';
export type PaymentMethodDirectoryDefault = 'all' | 'default' | 'non-default';

export interface PaymentMethodFiltersValue {
  status: PaymentMethodDirectoryStatus;
  defaultFilter: PaymentMethodDirectoryDefault;
  type: string;
  provider: string;
}

export interface PaymentMethodFiltersProps {
  value: PaymentMethodFiltersValue;
  options: AdminPaymentMethodFilterOptions;
  onChange: (value: PaymentMethodFiltersValue) => void;
  onClear: () => void;
  className?: string;
}

const selectClassName = 'min-h-10 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15';

export function PaymentMethodFilters({
  value,
  options,
  onChange,
  onClear,
  className,
}: PaymentMethodFiltersProps) {
  const update = <K extends keyof PaymentMethodFiltersValue>(key: K, next: PaymentMethodFiltersValue[K]) => {
    onChange({ ...value, [key]: next });
  };

  const hasFilters =
    value.status !== 'all' ||
    value.defaultFilter !== 'all' ||
    Boolean(value.type) ||
    Boolean(value.provider);

  return (
    <div className={['space-y-3', className].filter(Boolean).join(' ')}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-[var(--foreground-secondary)]">Status</span>
          <select className={selectClassName} value={value.status} onChange={(event) => update('status', event.currentTarget.value as PaymentMethodDirectoryStatus)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-[var(--foreground-secondary)]">Account default</span>
          <select className={selectClassName} value={value.defaultFilter} onChange={(event) => update('defaultFilter', event.currentTarget.value as PaymentMethodDirectoryDefault)}>
            <option value="all">All methods</option>
            <option value="default">Default only</option>
            <option value="non-default">Non-default only</option>
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-[var(--foreground-secondary)]">Type</span>
          <select className={selectClassName} value={value.type} onChange={(event) => update('type', event.currentTarget.value)}>
            <option value="">All types</option>
            {options.types.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-[var(--foreground-secondary)]">Provider</span>
          <select className={selectClassName} value={value.provider} onChange={(event) => update('provider', event.currentTarget.value)}>
            <option value="">All providers</option>
            {options.providers.map((provider) => <option key={provider} value={provider}>{provider}</option>)}
          </select>
        </label>
      </div>
      {hasFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClear} leadingIcon={<X size={15} aria-hidden="true" />}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default PaymentMethodFilters;
