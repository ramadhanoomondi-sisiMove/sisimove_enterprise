'use client';

import { useEffect } from 'react';

import {
  ErrorState,
} from '@/components/ui';

export interface CommissionErrorProps {
  readonly error: Error & {
    digest?: string;
  };
  readonly reset: () => void;
}

export default function CommissionError({
  error,
  reset,
}: CommissionErrorProps) {
  useEffect(() => {
    console.error('Commission page error:', error);
  }, [error]);

  return (
    <ErrorState
      title="Unable to load commissions"
      description="Something went wrong while loading the commissions page. Please try again."
      retryAction={{
        label: 'Try again',
        onClick: reset,
      }}
      className="min-h-[400px]"
    />
  );
}