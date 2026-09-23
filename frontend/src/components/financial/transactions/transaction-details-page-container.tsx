// =============================================================================
// sisiMove — Financial Transaction Details Page Container
// =============================================================================
//
// Container for the member-facing financial transaction detail surface.
//
// Responsibilities:
// - Receive the transaction public ID;
// - Normalize the route-derived public ID;
// - Invoke the existing financial transaction retrieval hook;
// - Own the retrieval lifecycle;
// - Own loading state;
// - Own error state;
// - Provide retry behavior;
// - Map domain timestamps into member-facing labels;
// - Map backend reference fields into a safe display label;
// - Compose TransactionDetails.
//
// Non-responsibilities:
// - Direct HTTP requests;
// - API response mapping;
// - Financial calculations;
// - Accounting behavior;
// - Transaction lifecycle mutations;
// - Determining transaction ownership;
// - Creating or modifying transactions.
//
// Backend capability:
//
//     GET /financial-transactions/:transactionPublicId
//
// Important:
// - No transaction collection/history endpoint is assumed here.
// - Ownership and authorization remain backend responsibilities.
// - The route public ID is treated only as a lookup identifier.
// =============================================================================

"use client";

// =============================================================================
// React
// =============================================================================

import {
  useEffect,
  type ReactNode,
} from "react";

// =============================================================================
// Financial Transaction — Feature
// =============================================================================

import {
  FinancialTransactionType,
  useFinancialTransaction,
} from "@/features/financial-transactions";

// =============================================================================
// Presentation
// =============================================================================

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
// Presentation labels
// =============================================================================
//
// The label is used only for supporting copy in this container.
// TransactionDetails owns the primary transaction-type presentation.
//
// =============================================================================

const TRANSACTION_TYPE_LABELS: Record<
  FinancialTransactionType,
  string
> = {
  [FinancialTransactionType.PAYMENT]: "Payment",
  [FinancialTransactionType.TRANSFER]: "Transfer",
  [FinancialTransactionType.HOLD]: "Funds reserved",
  [FinancialTransactionType.RELEASE]: "Funds released",
  [FinancialTransactionType.CAPTURE]: "Funds captured",
  [FinancialTransactionType.SETTLEMENT]: "Settlement",
  [FinancialTransactionType.DISBURSEMENT]: "Disbursement",
  [FinancialTransactionType.REFUND]: "Refund",
  [FinancialTransactionType.REVERSAL]: "Reversal",
  [FinancialTransactionType.ADJUSTMENT]: "Adjustment",
};

// =============================================================================
// Date formatting
// =============================================================================
//
// Financial timestamps come from the backend as ISO-compatible strings.
//
// The container converts them into member-facing labels.
// No financial timezone or accounting calculation is performed here.
//
// =============================================================================

function formatDateTime(
  value: string | null | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    // Defensive fallback:
    // preserve the backend value rather than rendering an empty date.
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
//
// Reference semantics belong to the backend/application layer.
//
// The container deliberately does not translate reference types such as:
//
//     WALLET_TOP_UP
//     BOOKING
//     WITHDRAWAL
//
// into business-specific copy.
//
// It simply presents the available reference pair.
//
// =============================================================================

function formatReference(
  referenceType: string | null | undefined,
  referencePublicId: string | null | undefined,
): string | undefined {
  if (!referenceType && !referencePublicId) {
    return undefined;
  }

  if (referenceType && referencePublicId) {
    return `${referenceType} · ${referencePublicId}`;
  }

  return referenceType ?? referencePublicId ?? undefined;
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
//
// An empty public ID is a route/input problem, not a financial transaction
// retrieval failure.
//
// Keeping this separate prevents an invalid route from being presented as
// though the backend had returned "transaction not found."
//
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
// Container
// =============================================================================

export function TransactionDetailsPageContainer({
  transactionPublicId,
}: TransactionDetailsPageContainerProps): ReactNode {
  // ---------------------------------------------------------------------------
  // Normalize the route-derived identifier once per render.
  // ---------------------------------------------------------------------------

  const normalizedTransactionPublicId =
    transactionPublicId.trim();

  // ---------------------------------------------------------------------------
  // Financial transaction retrieval
  // ---------------------------------------------------------------------------
  //
  // The feature hook owns the API interaction.
  //
  // The container owns when retrieval happens and how the resulting lifecycle
  // is represented in the page.
  //
  // ---------------------------------------------------------------------------

  const {
    data: transaction,
    isLoading,
    error,
    getTransaction,
  } = useFinancialTransaction();

  // ---------------------------------------------------------------------------
  // Initial retrieval
  // ---------------------------------------------------------------------------
  //
  // The lookup is intentionally imperative:
  //
  //     useFinancialTransaction()
  //             │
  //             └── getTransaction(publicId)
  //
  // The public ID is the only route-derived input.
  //
  // Ownership, authorization and visibility must remain backend concerns.
  //
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!normalizedTransactionPublicId) {
      return;
    }

    void getTransaction(
      normalizedTransactionPublicId,
    );
  }, [
    normalizedTransactionPublicId,
    getTransaction,
  ]);

  // ---------------------------------------------------------------------------
  // Invalid route identifier
  // ---------------------------------------------------------------------------

  if (!normalizedTransactionPublicId) {
    return <TransactionDetailsInvalidRequest />;
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return <TransactionDetailsLoading />;
  }

  // ---------------------------------------------------------------------------
  // Error / missing transaction
  // ---------------------------------------------------------------------------
  //
  // A null transaction without an explicit error is treated defensively as an
  // unavailable resource.
  //
  // This does not invent a new backend status. It simply prevents the detail
  // presentation from receiving an invalid transaction object.
  //
  // ---------------------------------------------------------------------------

  if (error || !transaction) {
    return (
      <TransactionDetailsError
        message={
          error?.message ??
          "The requested transaction could not be found."
        }
        onRetry={() => {
          void getTransaction(
            normalizedTransactionPublicId,
          );
        }}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Presentation
  // ---------------------------------------------------------------------------

  const createdAtLabel =
    formatDateTime(transaction.createdAt) ??
    transaction.createdAt;

  const supportingLabel =
    TRANSACTION_TYPE_LABELS[transaction.type];

  const entryCount =
    transaction.entries.length;

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
              transaction.referenceType,
              transaction.referencePublicId,
            )}
            supportingContent={
              <p className="text-xs leading-5 text-[var(--foreground-muted)]">
                {supportingLabel} transaction with{" "}
                {entryCount} {entryLabel}.
              </p>
            }
          />
        </div>
      </div>
    </main>
  );
}

export default TransactionDetailsPageContainer;
