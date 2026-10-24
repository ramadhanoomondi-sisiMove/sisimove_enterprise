
'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Accounts Error Boundary
// -----------------------------------------------------------------------------
//
// Reuses FinancialAccountErrorState for consistent error presentation.
// Provides retry and navigation back to the Financial Accounts directory.
// -----------------------------------------------------------------------------

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';
import { FinancialAccountErrorState } from '@/components/admin/finance/accounts';

export default function FinancialAccountsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const handleRetry = useCallback(() => {
    reset();
  }, [reset]);

  const handleBack = useCallback(() => {
    router.push(ADMIN_ROUTES.FINANCE_ACCOUNTS);
  }, [router]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <FinancialAccountErrorState
        title="Unable to load financial accounts"
        description="Something prevented the financial accounts page from loading. Please try again."
        onRetry={handleRetry}
        retryLabel="Try again"
        onBack={handleBack}
        backLabel="Back to financial accounts"
      />
    </div>
  );
}
