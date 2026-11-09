import { Input } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

export interface WithdrawalSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function WithdrawalSearch({
  value,
  onChange,
  placeholder = 'Search withdrawal, account or destination…',
  className,
}: WithdrawalSearchProps) {
  return (
    <div className={cn('w-full', className)}>
      <label
        htmlFor="withdrawal-directory-search"
        className="sr-only"
      >
        Search withdrawals
      </label>

      <Input
        id="withdrawal-directory-search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
      />
    </div>
  );
}

export default WithdrawalSearch;