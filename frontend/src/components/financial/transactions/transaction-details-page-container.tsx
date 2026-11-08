
"use client";

// =============================================================================
// sisiMove — Financial Transaction Details Page Container
// =============================================================================
//
// Member-facing transaction details.
//
// Data source:
// GET /financial-transactions/me
//
// The authenticated member's transaction collection is retrieved from the
// backend. The requested transaction is selected by publicId.
//
// No admin-only transaction endpoint is used here.
// =============================================================================

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  useMyFinancialTransactions,
} from "@/features/financial-transactions";

import {
  TransactionDetails,
} from "./transaction-details";

// =============================================================================
// Props
// =============================================================================

export interface TransactionDetailsPageContainerProps {
  readonly transactionPublicId: string;
}

// =============================================================================
// Date formatting
// =============================================================================

function formatDateTime(
  value: string | null | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

// =============================================================================
// Reference formatting
// =============================================================================

function formatReference(
  reference: string | null | undefined,
): string | undefined {
  const normalizedReference = reference?.trim();

  return normalizedReference || undefined;
}

// =============================================================================
// Loading State
// =============================================================================

function TransactionDetailsLoading(): ReactNode {
  return (
    <main
      className="min-h-screen bg-[var(--background-brand)]"
      aria-busy="true"
      aria-label="Loading transaction"
    >
      <div className="page-container">
        <div className="py-6 sm:py-8 lg:py-10">
          <div className="space-y-4">
            <div
              className="surface h-40 animate-pulse"
              aria-hidden="true"
            />

            <div
              className="surface h-72 animate-pulse"
              aria-hidden="true"
            />

            <div
              className="surface h-64 animate-pulse"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Error State
// =============================================================================

interface TransactionDetailsErrorProps {
  readonly message: string;
  readonly onRetry: () => void;
}

function TransactionDetailsError({
  message,
  onRetry,
}: TransactionDetailsErrorProps): ReactNode {
  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container">
        <div className="py-6 sm:py-8 lg:py-10">
          <section
            className="surface p-5 sm:p-6"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--danger-soft)] text-sm font-semibold text-[var(--danger)]"
                aria-hidden="true"
              >
                !
              </span>

              <div className="min-w-0">
                <h1 className="text-sm font-semibold text-[var(--foreground)]">
                  We couldn&apos;t load this transaction
                </h1>

                <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
                  {message}
                </p>

                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-4 inline-flex min-h-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-3.5 text-sm font-semibold text-[var(--brand-foreground)] transition hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
                >
                  Try again
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Invalid Route State
// =============================================================================

function TransactionDetailsInvalidRequest(): ReactNode {
  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container">
        <div className="py-6 sm:py-8 lg:py-10">
          <section
            className="surface p-5 sm:p-6"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--danger-soft)] text-sm font-semibold text-[var(--danger)]"
                aria-hidden="true"
              >
                !
              </span>

              <div className="min-w-0">
                <h1 className="text-sm font-semibold text-[var(--foreground)]">
                  Invalid transaction
                </h1>

                <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
                  A valid transaction identifier is required
                  to view this transaction.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Not Found State
// =============================================================================

function TransactionDetailsNotFound(): ReactNode {
  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container">
        <div className="py-6 sm:py-8 lg:py-10">
          <section
            className="surface p-5 sm:p-6"
            role="alert"
          >
            <h1 className="text-sm font-semibold text-[var(--foreground)]">
              Transaction not found
            </h1>

            <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
              This transaction could not be found in your
              financial account.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Container
// =============================================================================

export function TransactionDetailsPageContainer({
  transactionPublicId,
}: TransactionDetailsPageContainerProps): ReactNode {
  const normalizedTransactionPublicId =
    transactionPublicId.trim();

  // ---------------------------------------------------------------------------
  // Transaction retrieval hook
  // ---------------------------------------------------------------------------

  const {
    data: transactions,
    isLoading,
    error,
    getTransactions,
  } = useMyFinancialTransactions();

  // ---------------------------------------------------------------------------
  // Track which route identifier has completed retrieval.
  //
  // State is updated only after the asynchronous request completes.
  // No synchronous state update is performed inside the effect.
  // ---------------------------------------------------------------------------

  const [loadedForId, setLoadedForId] =
    useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Initial retrieval
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!normalizedTransactionPublicId) {
      return;
    }

    let active = true;

    const loadTransactions = async (): Promise<void> => {
      try {
        await getTransactions();
      } catch {
        // The hook owns and exposes the request error.
      } finally {
        if (active) {
          setLoadedForId(normalizedTransactionPublicId);
        }
      }
    };

    void loadTransactions();

    return () => {
      active = false;
    };
  }, [
    normalizedTransactionPublicId,
    getTransactions,
  ]);

  // ---------------------------------------------------------------------------
  // Retry
  // ---------------------------------------------------------------------------

  const handleRetry = useCallback((): void => {
    void getTransactions().catch(() => {
      // The hook owns and exposes the request error.
    });
  }, [getTransactions]);

  // ---------------------------------------------------------------------------
  // Invalid route
  // ---------------------------------------------------------------------------

  if (!normalizedTransactionPublicId) {
    return <TransactionDetailsInvalidRequest />;
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (
    isLoading ||
    loadedForId !== normalizedTransactionPublicId
  ) {
    return <TransactionDetailsLoading />;
  }

  // ---------------------------------------------------------------------------
  // Retrieval error
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <TransactionDetailsError
        message={error.message}
        onRetry={handleRetry}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Find authenticated member's transaction
  // ---------------------------------------------------------------------------

  const transaction = transactions.find(
    (item) =>
      item.publicId === normalizedTransactionPublicId,
  );

  if (!transaction) {
    return <TransactionDetailsNotFound />;
  }

  // ---------------------------------------------------------------------------
  // Presentation
  // ---------------------------------------------------------------------------

  const createdAtLabel =
    formatDateTime(transaction.createdAt) ??
    transaction.createdAt;

  const entryCount = transaction.entries.length;

  const entryLabel =
    entryCount === 1
      ? "ledger entry"
      : "ledger entries";

  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container">
        <div className="py-6 sm:py-8 lg:py-10">
          <header className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              Financial account
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl">
              Transaction details
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
              Review the accounting movement recorded for
              this transaction.
            </p>
          </header>

          <TransactionDetails
            transaction={transaction}
            createdAtLabel={createdAtLabel}
            completedAtLabel={formatDateTime(
              transaction.completedAt,
            )}
            failedAtLabel={formatDateTime(
              transaction.failedAt,
            )}
            reversedAtLabel={formatDateTime(
              transaction.reversedAt,
            )}
            cancelledAtLabel={formatDateTime(
              transaction.cancelledAt,
            )}
            referenceLabel={formatReference(
              transaction.reference,
            )}
            supportingContent={
              <p className="text-xs leading-5 text-[var(--foreground-muted)]">
                {entryCount} {entryLabel} recorded for this
                transaction.
              </p>
            }
          />
        </div>
      </div>
    </main>
  );
}

export default TransactionDetailsPageContainer;
