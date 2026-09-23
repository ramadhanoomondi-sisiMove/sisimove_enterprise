import type { ReactNode } from 'react';

import {
  WithdrawalHistoryItem,
  type WithdrawalHistoryItemProps,
} from './withdrawal-history-item';

// -----------------------------------------------------------------------------
// sisiMove — Withdrawal History
// -----------------------------------------------------------------------------
//
// Presentation component for a collection of wallet withdrawal records.
//
// Financial boundary:
//
// FinancialAccountWithdrawal[]
//
// This component represents withdrawal operations only. It does not replace
// or duplicate the FinancialTransaction history surface.
//
// Responsibilities:
// - render a collection of withdrawal history items;
// - present loading state;
// - present empty state;
// - present an error state supplied by the container;
// - optionally render a heading and supporting content.
//
// It does NOT:
// - fetch withdrawals;
// - paginate or query the backend;
// - calculate balances;
// - mutate withdrawals;
// - transform accounting transactions into withdrawals.
//
// Data retrieval and orchestration remain in the feature/container layer.
//
// -----------------------------------------------------------------------------

export interface WithdrawalHistoryProps {
  /**
   * Withdrawal records prepared by the container.
   */
  withdrawals: readonly WithdrawalHistoryItemProps[];

  /**
   * Whether the withdrawal history is currently loading.
   */
  isLoading?: boolean;

  /**
   * Optional error message supplied by the application layer.
   */
  error?: string;

  /**
   * Optional heading.
   *
   * Defaults to "Withdrawal history".
   */
  title?: string;

  /**
   * Optional supporting description.
   */
  description?: string;

  /**
   * Optional content rendered when there are no withdrawals.
   *
   * This allows the container to provide an application-specific CTA without
   * coupling this component to routing or wallet behavior.
   */
  emptyState?: ReactNode;

  /**
   * Optional content rendered below the history list.
   *
   * Useful for pagination controls or other container-owned controls.
   */
  footerContent?: ReactNode;

  /**
   * Optional retry action rendered when an error exists.
   */
  onRetry?: () => void;
}

// -----------------------------------------------------------------------------
// Loading skeleton
// -----------------------------------------------------------------------------

function WithdrawalHistorySkeleton() {
  return (
    <div
      className="space-y-3"
      aria-label="Loading withdrawal history"
      aria-busy="true"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-3 w-24 rounded bg-slate-100" />
              <div className="h-4 w-40 rounded bg-slate-100" />
              <div className="h-3 w-36 rounded bg-slate-100" />
            </div>

            <div className="h-5 w-28 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Default empty state
// -----------------------------------------------------------------------------

function DefaultEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
      <p className="text-sm font-medium text-slate-900">
        No withdrawals yet
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Your withdrawal activity will appear here.
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Default error state
// -----------------------------------------------------------------------------

function DefaultErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-5 py-4"
    >
      <p className="text-sm font-medium text-red-800">
        We could not load your withdrawal history.
      </p>

      <p className="mt-1 text-sm text-red-700">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-sm font-medium text-red-800 underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalHistory({
  withdrawals,
  isLoading = false,
  error,
  title = 'Withdrawal history',
  description,
  emptyState,
  footerContent,
  onRetry,
}: WithdrawalHistoryProps) {
  return (
    <section className="w-full">
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-base font-semibold text-slate-900">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Error                                                               */}
      {/* ------------------------------------------------------------------- */}
      {error ? (
        <DefaultErrorState
          message={error}
          onRetry={onRetry}
        />
      ) : isLoading ? (
        /* --------------------------------------------------------------- */
        /* Loading                                                          */
        /* --------------------------------------------------------------- */
        <WithdrawalHistorySkeleton />
      ) : withdrawals.length === 0 ? (
        /* --------------------------------------------------------------- */
        /* Empty                                                            */
        /* --------------------------------------------------------------- */
        emptyState ?? <DefaultEmptyState />
      ) : (
        /* ----------------------------------------------------------------- */
        /* History list                                                      */
        /* ----------------------------------------------------------------- */
        <div className="space-y-3">
          {withdrawals.map((withdrawal) => (
            <WithdrawalHistoryItem
              key={withdrawal.publicId}
              {...withdrawal}
            />
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Footer                                                              */}
      {/* ------------------------------------------------------------------- */}
      {footerContent && !error && !isLoading && (
        <div className="mt-4">
          {footerContent}
        </div>
      )}
    </section>
  );
}