// -----------------------------------------------------------------------------
// sisiMove — Authenticated Financial Transaction Details Route
// -----------------------------------------------------------------------------
//
// Route:
//     /wallet/transactions/[transactionPublicId]
//
// Responsibility:
// - Provide the authenticated route entry point for a financial transaction.
// - Resolve the dynamic transaction public ID from the Next.js route params.
// - Pass the route identifier to TransactionDetailsPageContainer.
//
// Architecture:
//
//     Next.js Route
//          │
//          ▼
//     transactionPublicId
//          │
//          ▼
//     TransactionDetailsPageContainer
//          │
//          ▼
//     Financial Transaction Hook
//          │
//          ▼
//     Financial Transaction API
//
// Non-responsibilities:
// - Data fetching.
// - API calls.
// - Transaction retrieval state.
// - Financial calculations.
// - Accounting behavior.
// - Transaction ownership decisions.
// - Transaction presentation.
// - Transaction lifecycle decisions.
//
// The route deliberately remains a thin Next.js entry point.
//
// The authenticated layout already provides the application shell.
//
// TransactionDetailsPageContainer owns the screen-level transaction retrieval
// orchestration and presentation boundary.
//
// -----------------------------------------------------------------------------

import { TransactionDetailsPageContainer } from "@/components/financial/transactions/transaction-details-page-container";

// =============================================================================
// Route Parameters
// =============================================================================

interface FinancialTransactionDetailsRouteProps {
  readonly params: Promise<{
    transactionPublicId: string;
  }>;
}

// =============================================================================
// Route
// =============================================================================

export default async function FinancialTransactionDetailsRoute({
  params,
}: FinancialTransactionDetailsRouteProps) {
  const { transactionPublicId } = await params;

  return (
    <TransactionDetailsPageContainer
      transactionPublicId={transactionPublicId}
    />
  );
}