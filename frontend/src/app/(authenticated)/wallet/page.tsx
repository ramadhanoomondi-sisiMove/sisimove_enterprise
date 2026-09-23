// -----------------------------------------------------------------------------
// sisiMove — Authenticated Wallet Route
// -----------------------------------------------------------------------------
//
// Route:
//     /wallet
//
// Responsibility:
// - Provide the authenticated route entry point for the user's wallet.
// - Delegate wallet screen composition to WalletPageContainer.
//
// This route represents the wallet overview only.
//
// Child financial flows have their own Next.js route boundaries:
//
//     /wallet/top-up
//         → TopUpPageContainer
//
//     /wallet/withdraw
//         → WithdrawalPageContainer
//
//     /wallet/transactions
//         → TransactionList
//
//     /wallet/transactions/[transactionPublicId]
//         → TransactionDetailsPageContainer
//
//     /wallet/payment-methods
//         → PaymentMethodsPageContainer
//
// Architecture:
//
//     Next.js Route
//          │
//          ▼
//     WalletPageContainer
//          │
//          ├── Financial Account
//          ├── Financial Balance
//          ├── Wallet actions
//          └── Recent Activity
//                 │
//                 ▼
//            WalletOverview
//                 │
//                 ├── Balance
//                 ├── Balance Breakdown
//                 ├── Account Status
//                 ├── Quick Actions
//                 └── Recent Activity
//
// Non-responsibilities:
// - Data fetching.
// - API calls.
// - Financial account state management.
// - Balance mapping.
// - Financial business rules.
// - Transaction composition.
// - Wallet presentation composition.
// - Routing decisions.
//
// The authenticated route layout already owns the authenticated shell.
//
// The route therefore remains a thin Next.js entry point.
//
// WalletPageContainer owns screen-level data composition.
//
// WalletOverview remains the wallet presentation composition boundary.
//
// Importantly, /wallet is NOT a parent page that renders all financial
// child screens. Next.js resolves each child URL to its own route boundary.
// -----------------------------------------------------------------------------

import { WalletPageContainer } from '@/components/financial/wallet/wallet-page-container';

// =============================================================================
// Route
// =============================================================================

export default function WalletRoute() {
  return <WalletPageContainer />;
}