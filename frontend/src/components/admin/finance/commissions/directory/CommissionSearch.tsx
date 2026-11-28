import { Input } from '@/components/ui';

export interface CommissionSearchProps {
  readonly value: string;
  readonly onQueryChange: (value: string) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function CommissionSearch({
  value,
  onQueryChange,
  placeholder = 'Search by commission ID or reference...',
  disabled = false,
  className,
}: CommissionSearchProps) {
  return (
    <div className={className}>
      <Input
        type="search"
        value={value}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search commissions"
        disabled={disabled}
      />
    </div>
  );
}