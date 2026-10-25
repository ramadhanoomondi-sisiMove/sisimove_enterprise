
'use client';

import { useEffect } from 'react';

import { TransactionErrorState } from '@/components/admin/finance/transactions/shared/TransactionErrorState';

export interface TransactionsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TransactionsError({
  error,
  reset,
}: TransactionsErrorProps) {
  useEffect(() => {
    // Log the error for diagnostics without exposing details to the user.
    console.error('Financial transactions route error:', error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <TransactionErrorState
        title="Unable to load financial transactions"
        description="We couldn't load the transactions directory. Please try again."
        onRetry={reset}
      />
    </main>
  );
}
