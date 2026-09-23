// -----------------------------------------------------------------------------
// sisiMove — Wallet Withdrawal Route
// -----------------------------------------------------------------------------
//
// Route:
//     /wallet/withdraw
//
// Next.js route boundary for the authenticated wallet withdrawal flow.
//
// Architecture:
//
//     Next.js Route
//          ↓
//     WithdrawalPageContainer
//          ↓
//     Financial withdrawal hooks
//          ↓
//     Financial withdrawal API
//
// Responsibilities:
// - Expose the `/wallet/withdraw` route.
// - Delegate screen-level composition to WithdrawalPageContainer.
//
// Non-responsibilities:
// - Financial data fetching.
// - Withdrawal mutation handling.
// - Form state.
// - Validation.
// - Withdrawal lifecycle handling.
// - Financial business rules.
// - Financial account ownership decisions.
// - Presentation composition.
// - Recreating the authenticated application shell.
//
// The authenticated layout already provides the application shell.
//
// WithdrawalPageContainer owns the screen-level withdrawal orchestration.
//
// The route remains a thin Next.js entry point.
//
// -----------------------------------------------------------------------------

import { WithdrawalPageContainer } from '@/components/financial/withdrawals/withdrawal-page-container';

// =============================================================================
// Route
// =============================================================================

export default function WalletWithdrawRoute() {
  return <WithdrawalPageContainer />;
}