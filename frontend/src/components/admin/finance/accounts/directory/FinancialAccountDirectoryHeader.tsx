import { RefreshCw, WalletCards } from 'lucide-react';

export interface FinancialAccountDirectoryHeaderProps {
  count: number;
  totalCount: number;
  collectionIsComplete: boolean;
  onRefresh?: () => void;
}

export function FinancialAccountDirectoryHeader({
  count, totalCount, collectionIsComplete, onRefresh,
}: FinancialAccountDirectoryHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <WalletCards size={21} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">Financial account directory</h2>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            {count.toLocaleString()} shown after filters · {totalCount.toLocaleString()} supplied
            {collectionIsComplete ? ' · complete collection' : ' · supplied subset'}
          </p>
        </div>
      </div>
      {onRefresh && (
        <button type="button" onClick={onRefresh} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-muted)]">
          <RefreshCw size={15} aria-hidden="true" /> Refresh source
        </button>
      )}
    </header>
  );
}