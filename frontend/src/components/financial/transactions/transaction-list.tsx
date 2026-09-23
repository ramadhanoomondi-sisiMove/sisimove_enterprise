// =============================================================================
// sisiMove — Financial Transaction List
// =============================================================================
//
// Presentation component for a collection of member-facing transactions.
//
// Responsibilities:
// - Render loading state.
// - Render empty state.
// - Render error state.
// - Render transaction cards.
// - Preserve transaction ordering supplied by the container.
//
// Non-responsibilities:
// - Fetching transactions.
// - Filtering transactions.
// - Pagination.
// - Mapping API responses.
// - Calculating transaction direction.
//
// =============================================================================

'use client';

import type { ReactNode } from 'react';

import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';

import {
  TransactionCard,
} from './transaction-card';

import type {
  TransactionCardProps,
} from './transaction-card';

// =============================================================================
// Types
// =============================================================================

export interface TransactionListProps {
  readonly transactions: readonly TransactionCardProps[];
  readonly isLoading?: boolean;
  readonly error?: string;
  readonly title?: string;
  readonly description?: string;
  readonly emptyState?: ReactNode;
  readonly footerContent?: ReactNode;
  readonly onRetry?: () => void;
}

// =============================================================================
// Loading
// =============================================================================

function TransactionListLoading(): ReactNode {
  return (
    <div
      className="space-y-3"
      aria-busy="true"
      aria-label="Loading transactions"
    >
      {Array.from({ length: 4 }).map(
        (_, index) => (
          <Skeleton
            key={index}
            className="h-28 w-full rounded-[var(--radius-xl)]"
          />
        ),
      )}
    </div>
  );
}

// =============================================================================
// Component
// =============================================================================

export function TransactionList({
  transactions,
  isLoading = false,
  error,
  title,
  description,
  emptyState,
  footerContent,
  onRetry,
}: TransactionListProps): ReactNode {
  if (isLoading) {
    return <TransactionListLoading />;
  }

  if (error) {
    return (
      <section className="surface p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--danger-soft)] text-sm font-semibold text-[var(--danger)]"
            aria-hidden="true"
          >
            !
          </span>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              We couldn&apos;t load your transactions
            </p>

            <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
              {error}
            </p>

            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 inline-flex min-h-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-3.5 text-sm font-semibold text-[var(--brand-foreground)] transition hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
              >
                Try again
              </button>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  if (transactions.length === 0) {
    return (
      <>
        {emptyState ?? (
          <EmptyState
            title={title ?? 'No transactions yet'}
            description={
              description ??
              'Your wallet activity will appear here.'
            }
          />
        )}

        {footerContent ? (
          <div className="mt-4">
            {footerContent}
          </div>
        ) : null}
      </>
    );
  }

  return (
    <section>
      {title ? (
        <header className="mb-3">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            {title}
          </h2>

          {description ? (
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}

      <div className="space-y-3">
        {transactions.map(
          (transaction) => (
            <TransactionCard
              key={transaction.transaction.publicId}
              {...transaction}
            />
          ),
        )}
      </div>

      {footerContent ? (
        <div className="mt-4">
          {footerContent}
        </div>
      ) : null}
    </section>
  );
}