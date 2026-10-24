
// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Detail Error Boundary
// -----------------------------------------------------------------------------
//
// Reuses FinancialAccountErrorState for consistent error presentation.
// Retries rendering through the Next.js error boundary reset function.
// -----------------------------------------------------------------------------

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';
import { FinancialAccountErrorState } from '@/components/admin/finance/accounts';

interface FinancialAccountDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function FinancialAccountDetailError({
  reset,
}: FinancialAccountDetailErrorProps) {
  const router = useRouter();

  const handleRetry = useCallback(() => {
    reset();
  }, [reset]);

  const handleBack = useCallback(() => {
    router.push(ADMIN_ROUTES.FINANCE_ACCOUNTS);
  }, [router]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <FinancialAccountErrorState
        title="Unable to load financial account"
        description="Something prevented this account's information from loading. Please try again."
        onRetry={handleRetry}
        retryLabel="Try again"
        onBack={handleBack}
        backLabel="Back to financial accounts"
      />
    </main>
  );
}
