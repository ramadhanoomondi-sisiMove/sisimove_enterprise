/**
 * sisiMove Admin — Payment Method Search
 */
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui';

export interface PaymentMethodSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function PaymentMethodSearch({
  value,
  onChange,
  placeholder = 'Search by name, provider, type, account, or public ID…',
  className,
}: PaymentMethodSearchProps) {
  return (
    <div className={['relative min-w-0', className].filter(Boolean).join(' ')}>
      <label htmlFor="payment-method-search" className="sr-only">Search payment methods</label>
      <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
      <input
        id="payment-method-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="min-h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] py-2 pl-10 pr-11 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-subtle)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Clear search"
          className="absolute right-1 top-1/2 -translate-y-1/2 px-2"
          onClick={() => onChange('')}
          leadingIcon={<X size={15} aria-hidden="true" />}
        >
          <span className="sr-only">Clear</span>
        </Button>
      )}
    </div>
  );
}

export default PaymentMethodSearch;
