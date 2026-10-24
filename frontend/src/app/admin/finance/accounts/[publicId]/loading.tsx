
// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Detail Loading Boundary
// -----------------------------------------------------------------------------
//
// Reuses FinancialAccountLoadingState for a consistent loading experience.
// -----------------------------------------------------------------------------

import { FinancialAccountLoadingState } from '@/components/admin/finance/accounts';

export default function FinancialAccountDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <FinancialAccountLoadingState
        rows={3}
        showHeader
      />
    </main>
  );
}
