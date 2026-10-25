import { AccountHoldLoadingState } from '@/components/admin/finance/account-holds/shared/AccountHoldLoadingState';

export default function AccountHoldsLoading() {
  return (
    <main
      className="page-shell"
      aria-label="Account holds"
    >
      <div className="page-container space-y-6">
        <AccountHoldLoadingState
          showHeader
          rows={6}
        />
      </div>
    </main>
  );
}