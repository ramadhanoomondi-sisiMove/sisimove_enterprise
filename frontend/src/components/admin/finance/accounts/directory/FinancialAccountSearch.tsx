import { Search, X } from 'lucide-react';

export interface FinancialAccountSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function FinancialAccountSearch({
  value, onChange, onClear, placeholder = 'Search public ID, owner, type, status or currency…',
}: FinancialAccountSearchProps) {
  return (
    <div className="min-w-0">
      <label htmlFor="financial-account-search" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
        Search accounts
      </label>
      <div className="flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[var(--brand-soft)]">
        <Search size={17} className="shrink-0 text-[var(--foreground-muted)]" aria-hidden="true" />
        <input
          id="financial-account-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--foreground-muted)]"
        />
        {value && <button type="button" onClick={onClear} aria-label="Clear search" className="rounded-md p-1 text-[var(--foreground-muted)] hover:bg-[var(--background-muted)]"><X size={15} /></button>}
      </div>
    </div>
  );
}
