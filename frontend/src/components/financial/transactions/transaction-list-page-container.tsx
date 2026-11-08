
"use client";

// =============================================================================
// sisiMove — Financial Transaction List Page Container
// =============================================================================
//
// Member-facing wallet transaction history.
//
// Responsibilities:
// - Retrieve the authenticated financial account.
// - Retrieve the authenticated member's transactions.
// - Resolve transaction direction from the member's ledger entries.
// - Map transactions into TransactionCard props.
// - Apply member-facing transaction filters.
// - Navigate to transaction details.
//
// Data source:
// GET /financial-transactions/me
//
// Ownership and authorization remain backend responsibilities.
// =============================================================================

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import {
  AUTHENTICATED_ROUTES,
} from "@/foundation/routing/authenticated-routes";

import {
  useMyFinancialAccount,
} from "@/features/financial-account";

import {
  useMyFinancialTransactions,
  FinancialTransactionEntryType,
  FinancialBalanceType,
  type FinancialTransaction,
  type FinancialTransactionEntry,
} from "@/features/financial-transactions";

import {
  TransactionList,
} from "./transaction-list";

import type {
  TransactionCardProps,
  TransactionDirection,
} from "./transaction-card";

import {
  TransactionFilters,
} from "./transaction-filters";

import type {
  TransactionFilter,
} from "./transaction-filters";

// =============================================================================
// Date Formatting
// =============================================================================

function formatTransactionDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// =============================================================================
// Transaction Labels
// =============================================================================

function getTransactionTitle(
  transaction: FinancialTransaction,
): string {
  const titles: Record<
    FinancialTransaction["type"],
    string
  > = {
    PAYMENT: "Payment",
    TRANSFER: "Transfer",
    HOLD: "Funds reserved",
    RELEASE: "Funds released",
    CAPTURE: "Funds captured",
    SETTLEMENT: "Settlement",
    DISBURSEMENT: "Disbursement",
    REFUND: "Refund",
    REVERSAL: "Reversal",
    ADJUSTMENT: "Balance adjustment",
  };

  return titles[transaction.type];
}

// =============================================================================
// Account Entry Resolution
// =============================================================================

function getWalletAccountEntry(
  transaction: FinancialTransaction,
  accountPublicId: string,
): FinancialTransactionEntry | undefined {
  const accountEntries = transaction.entries.filter(
    (entry) =>
      entry.accountPublicId === accountPublicId,
  );

  const preferredBalanceTypes: FinancialBalanceType[] = [
    FinancialBalanceType.AVAILABLE,
    FinancialBalanceType.PENDING,
    FinancialBalanceType.HELD,
  ];

  for (const balanceType of preferredBalanceTypes) {
    const entry = accountEntries.find(
      (candidate) =>
        candidate.balanceType === balanceType,
    );

    if (entry) {
      return entry;
    }
  }

  return undefined;
}

// =============================================================================
// Direction Resolution
// =============================================================================

function getTransactionDirection(
  entry: FinancialTransactionEntry,
): TransactionDirection {
  return entry.type === FinancialTransactionEntryType.CREDIT
    ? "IN"
    : "OUT";
}

// =============================================================================
// Transaction Mapping
// =============================================================================

function mapTransactionToCard(
  transaction: FinancialTransaction,
  accountPublicId: string,
  onClick: () => void,
): TransactionCardProps | null {
  const accountEntry = getWalletAccountEntry(
    transaction,
    accountPublicId,
  );

  if (!accountEntry) {
    return null;
  }

  return {
    transaction,
    direction: getTransactionDirection(accountEntry),
    title: getTransactionTitle(transaction),
    description: transaction.status.toLowerCase(),
    dateLabel: formatTransactionDate(transaction.createdAt),
    referenceLabel: transaction.reference?.trim() || undefined,
    onClick,
  };
}

// =============================================================================
// Container
// =============================================================================

export function TransactionListPageContainer(): ReactNode {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Financial Account
  // ---------------------------------------------------------------------------

  const {
    data: account,
    isLoading: accountLoading,
    isError: accountIsError,
    error: accountError,
    refetch: refetchAccount,
  } = useMyFinancialAccount();

  // ---------------------------------------------------------------------------
  // Financial Transactions
  // ---------------------------------------------------------------------------

  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
    getTransactions,
  } = useMyFinancialTransactions();

  // ---------------------------------------------------------------------------
  // Local Presentation State
  // ---------------------------------------------------------------------------

  const [filter, setFilter] =
    useState<TransactionFilter>("ALL");

  const [hasLoaded, setHasLoaded] =
    useState(false);

  // ---------------------------------------------------------------------------
  // Initial Retrieval
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let active = true;

    const loadTransactions = async (): Promise<void> => {
      try {
        await getTransactions();
      } catch {
        // The transaction hook owns the retrieval error.
      } finally {
        if (active) {
          setHasLoaded(true);
        }
      }
    };

    void loadTransactions();

    return () => {
      active = false;
    };
  }, [getTransactions]);

  // ---------------------------------------------------------------------------
  // Retry
  // ---------------------------------------------------------------------------

  const handleRetry = useCallback((): void => {
    setHasLoaded(false);

    void Promise.allSettled([
      getTransactions(),
      Promise.resolve(refetchAccount()),
    ]).finally(() => {
      setHasLoaded(true);
    });
  }, [
    getTransactions,
    refetchAccount,
  ]);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  const isLoading =
    accountLoading ||
    transactionsLoading ||
    !hasLoaded;

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  const errorMessage = accountIsError
    ? accountError?.message ?? "Unable to load your financial account."
    : transactionsError?.message;


  // ---------------------------------------------------------------------------
  // Map Transactions
  // ---------------------------------------------------------------------------

  const mappedTransactions = useMemo(() => {
    const accountPublicId = account?.publicId;

    if (!accountPublicId) {
      return [];
    }

    return [...transactions]
      .sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
      )
      .map((transaction) =>
        mapTransactionToCard(
          transaction,
          accountPublicId,
          () => {
            router.push(
              AUTHENTICATED_ROUTES.WALLET_TRANSACTION(
                transaction.publicId,
              ),
            );
          },
        ),
      )
      .filter(
        (item): item is TransactionCardProps =>
          item !== null,
      );
  }, [
    account,
    transactions,
    router,
  ]);

  // ---------------------------------------------------------------------------
  // Apply Filters
  // ---------------------------------------------------------------------------

  const filteredTransactions = useMemo(() => {
    switch (filter) {
      case "MONEY_IN":
        return mappedTransactions.filter(
          (item) => item.direction === "IN",
        );

      case "MONEY_OUT":
        return mappedTransactions.filter(
          (item) => item.direction === "OUT",
        );

      case "ALL":
      default:
        return mappedTransactions;
    }
  }, [
    filter,
    mappedTransactions,
  ]);

  // ---------------------------------------------------------------------------
  // Missing Account
  // ---------------------------------------------------------------------------

  const resolvedError =
    errorMessage ??
    (!isLoading && !account
      ? "Your financial account could not be found."
      : undefined);

  // ---------------------------------------------------------------------------
  // Presentation
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container">
        <div className="py-6 sm:py-8 lg:py-10">

          <header className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              Wallet
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl">
              Transactions
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
              View your wallet payments, transfers and other
              financial activity.
            </p>
          </header>

          <div className="mb-5">
            <TransactionFilters
              value={filter}
              onChange={setFilter}
              disabled={isLoading || Boolean(resolvedError)}
            />
          </div>

          <TransactionList
            transactions={filteredTransactions}
            isLoading={isLoading}
            error={resolvedError}
            title={
              filter === "MONEY_IN"
                ? "Money in"
                : filter === "MONEY_OUT"
                  ? "Money out"
                  : "All transactions"
            }
            description="Your latest wallet activity, with the newest transactions first."
            onRetry={handleRetry}
          />

        </div>
      </div>
    </main>
  );
}

export default TransactionListPageContainer;
