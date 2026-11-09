
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  WithdrawalPageContainer,
} from '@/components/admin/finance/withdrawals/layout';

import {
  WithdrawalErrorState,
} from '@/components/admin/finance/withdrawals/shared';

interface WithdrawalsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WithdrawalsError({
  error,
  reset,
}: WithdrawalsErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('Withdrawals route error:', error);
  }, [error]);

  return (
    <WithdrawalPageContainer size="2xl" className="py-6">
      <WithdrawalErrorState
        title="Unable to load withdrawals"
        description="We couldn't display the withdrawals page. Please try again."
        onRetry={reset}
        secondaryAction={{
          label: 'Go to Finance Control Center',
          onClick: () => router.push('/admin/finance'),
        }}
        className="mx-auto w-full max-w-xl"
      />
    </WithdrawalPageContainer>
  );
}
