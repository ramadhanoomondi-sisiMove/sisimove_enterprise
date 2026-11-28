'use client';

import Link from 'next/link';

import { ErrorState } from '@/components/ui';
import { CommissionPageContainer } from '@/components/admin/finance/commissions/layout/CommissionPageContainer';
import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

interface CommissionRuleErrorProps {
  readonly error: Error & {
    digest?: string;
  };
  readonly reset: () => void;
}

export default function CommissionRuleError({
  error,
  reset,
}: CommissionRuleErrorProps) {
  const description =
    process.env.NODE_ENV === 'development'
      ? error.message
      : 'Something went wrong while loading this commission rule. Please try again.';

  return (
    <CommissionPageContainer>
      <div className="space-y-4">
        <ErrorState
          title="Unable to load commission rule"
          description={description}
          retryAction={{
            label: 'Try again',
            onClick: reset,
            variant: 'primary',
          }}
        />

        <div className="flex justify-center">
          <Link
            href={ADMIN_ROUTES.FINANCE_COMMISSION_RULES}
            className="text-sm font-medium text-[var(--primary)] underline-offset-4 hover:underline"
          >
            Return to commission rules
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && error.digest && (
          <p className="text-center text-xs text-muted-foreground">
            Error reference: {error.digest}
          </p>
        )}
      </div>
    </CommissionPageContainer>
  );
}