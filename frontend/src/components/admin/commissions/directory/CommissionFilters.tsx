import { Select } from '@/components/ui';

export type CommissionStatusFilterValue =
  | 'ALL'
  | 'PENDING'
  | 'ASSESSED'
  | 'CANCELLED';

export interface CommissionFiltersProps {
  readonly status: CommissionStatusFilterValue;
  readonly onStatusChange: (status: CommissionStatusFilterValue) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

const statusOptions = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ASSESSED', label: 'Assessed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function CommissionFilters({
  status,
  onStatusChange,
  disabled = false,
  className,
}: CommissionFiltersProps) {
  return (
    <div className={className}>
      <Select
        aria-label="Filter commissions by status"
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value as CommissionStatusFilterValue)
        }
        options={statusOptions}
        disabled={disabled}
      />
    </div>
  );
}