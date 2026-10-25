
// src/app/admin/account-holds/error.tsx

'use client';

import { useEffect } from 'react';

import { AccountHoldErrorState } from '@/components/admin/finance/holds/shared/AccountHoldErrorState';

interface AccountHoldsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AccountHoldsError({
  error,
  reset,
}: AccountHoldsErrorProps) {
  useEffect(() => {
    // Keep the error available to your configured error-reporting service.
    // Avoid logging potentially sensitive error details in production.
    if (process.env.NODE_ENV === 'development') {
      console.error('Account holds route error:', error);
    }
  }, [error]);

  return (
    <main className="page-shell">
      <div className="page-container py-8">
        <AccountHoldErrorState
          title="Unable to load account holds"
          description="Something went wrong while opening the account holds page. Try again."
          onRetry={reset}
        />
      </div>
    </main>
  );
}
