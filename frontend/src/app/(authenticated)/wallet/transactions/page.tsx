
import { TransactionListPageContainer } from "@/components/financial/transactions/transaction-list-page-container";

// =============================================================================
// sisiMove — Authenticated Wallet Transactions Route
// =============================================================================
//
// Route:
// /wallet/transactions
//
// Responsibility:
// - Provide the authenticated transaction history route.
// - Delegate screen composition to TransactionListPageContainer.
//
// Data fetching, filtering and presentation belong to the container.
// =============================================================================

export default function WalletTransactionsRoute() {
  return <TransactionListPageContainer />;
}
