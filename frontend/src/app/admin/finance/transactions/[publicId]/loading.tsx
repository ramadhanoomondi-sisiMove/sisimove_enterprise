
import { TransactionLoadingState } from '@/components/admin/finance/transactions/shared';

export default function TransactionsLoading() {
  return (
    <main
      className="mx-auto w-full max-w-[var(--container-xl)] space-y-6 px-4 py-6 sm:px-6 lg:px-8"
      aria-label="Financial transactions"
    >
      <div className="space-y-2">
        <div className="h-7 w-64 max-w-full animate-pulse rounded-md bg-[var(--background-muted)]" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded-md bg-[var(--background-muted)]" />
      </div>

      <TransactionLoadingState rows={8} showHeader />

      <span className="sr-only">Loading financial transactions…</span>
    </main>
  );
}
