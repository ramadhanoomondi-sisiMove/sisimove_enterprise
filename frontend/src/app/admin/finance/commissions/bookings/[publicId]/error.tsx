
'use client';

import Link from 'next/link';

import { ErrorState } from '@/components/ui';

import {
  CommissionPageContainer,
} from '@/components/admin/finance/commissions/layout';

import {
  ADMIN_ROUTES,
} from '@/foundation/routing/admin-routes';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface BookingCommissionErrorProps {
  readonly error: Error & {
    digest?: string;
  };
  readonly reset: () => void;
}

// -----------------------------------------------------------------------------
// Error Boundary
// -----------------------------------------------------------------------------

export default function BookingCommissionError({
  error,
  reset,
}: BookingCommissionErrorProps) {
  return (
    <CommissionPageContainer size="2xl" className="py-6">
      <div className="space-y-4">
        <ErrorState
          title="Unable to load booking commission"
          description="Something went wrong while loading this booking commission. Please try again."
          retryAction={{
            label: 'Try again',
            onClick: reset,
            variant: 'primary',
          }}
        />

        {process.env.NODE_ENV === 'development' && (
          <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background-muted)] p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
              Development Error Details
            </p>

            <p className="break-words text-sm text-[var(--foreground-secondary)]">
              {error.message || 'Unknown error'}
            </p>

            {error.digest && (
              <p className="mt-2 text-xs text-[var(--foreground-muted)]">
                Error digest: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-center">
          <Link
            href={ADMIN_ROUTES.FINANCE_BOOKING_COMMISSIONS}
            className={[
              'inline-flex',
              'min-h-10',
              'items-center',
              'justify-center',
              'rounded-[var(--radius-md)]',
              'border',
              'border-[var(--border)]',
              'bg-[var(--surface)]',
              'px-4',
              'text-sm',
              'font-medium',
              'text-[var(--foreground)]',
              'transition-colors',
              'hover:border-[var(--border-strong)]',
              'hover:bg-[var(--background-muted)]',
              'focus-visible:outline-2',
              'focus-visible:outline-[var(--brand)]',
              'focus-visible:outline-offset-2',
            ].join(' ')}
          >
            Back to booking commissions
          </Link>
        </div>
      </div>
    </CommissionPageContainer>
  );
}
