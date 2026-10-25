'use client';

import { useEffect } from 'react';

import {
  AccountHoldErrorState,
} from '@/components/admin/finance/account-holds/shared';

interface AccountHoldDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AccountHoldDetailError({
  error,
  reset,
}: AccountHoldDetailErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Account hold detail page error:', error);
    }
  }, [error]);

  return (
    <main className="page-shell">
      <div className="page-container">
        <AccountHoldErrorState
          title="Unable to load account hold"
          description="The account hold details could not be displayed. Try again. If the problem continues, return to the account holds directory."
          onRetry={reset}
        />
      </div>
    </main>
  );
}