import { ArrowDownUp, ReceiptText } from 'lucide-react';

export interface TransactionDirectoryHeaderProps {
  resultCount: number;
  isFiltered?: boolean;
}

export function TransactionDirectoryHeader({
  resultCount,
  isFiltered = false,
}: TransactionDirectoryHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]">
          <ReceiptText aria-hidden="true" size={21} />
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Financial transactions
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
            Review transaction activity, inspect statuses, and narrow results using filters.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 text-sm text-[var(--foreground-secondary)]">
        <ArrowDownUp aria-hidden="true" size={16} />
        <span>
          <strong className="font-semibold text-[var(--foreground)]">
            {new Intl.NumberFormat('en-KE').format(resultCount)}
          </strong>{' '}
          {isFiltered ? 'matching transactions' : 'transactions'}
        </span>
      </div>
    </header>
  );
}

export default TransactionDirectoryHeader;
