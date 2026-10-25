import {
  AccountHoldLoadingState,
} from '@/components/admin/finance/holds/shared';

export default function AccountHoldDetailLoading() {
  return (
    <main className="page-shell">
      <div className="page-container space-y-6">
        <div className="space-y-2">
          <div className="h-3 w-32 animate-pulse rounded bg-[var(--background-muted)]" />
          <div className="h-8 w-64 max-w-full animate-pulse rounded-lg bg-[var(--background-muted)]" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-[var(--background-muted)]" />
        </div>

        <AccountHoldLoadingState rows={3} showHeader />

        <div className="grid gap-6 lg:grid-cols-2">
          <AccountHoldLoadingState rows={3} showHeader />
          <AccountHoldLoadingState rows={3} showHeader />
        </div>
      </div>
    </main>
  );
}