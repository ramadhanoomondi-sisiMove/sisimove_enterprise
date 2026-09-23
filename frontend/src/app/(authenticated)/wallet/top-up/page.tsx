// =============================================================================
// sisiMove — Wallet Top-Up Route
// =============================================================================
//
// Route:
//     /wallet/top-up
//
// Thin Next.js route boundary for the authenticated wallet top-up surface.
//
// Architecture:
//
//     Next.js Route
//          ↓
//     TopUpPageContainer
//          ↓
//     Financial feature hooks
//          ↓
//     API adapters
//
// The route deliberately does NOT:
// - fetch financial data;
// - own form state;
// - perform mutations;
// - contain payment lifecycle logic;
// - compose the wallet overview;
// - render the /wallet page;
// - recreate the authenticated shell.
//
// The authenticated layout already provides the application shell.
//
// /wallet is the financial overview.
//
// /wallet/top-up is a focused financial workflow for adding funds.
//
// The top-up flow therefore has its own route boundary and should not be
// rendered automatically as part of the /wallet page.
//
// =============================================================================

import { TopUpPageContainer } from '@/components/financial/payments/top-up-page-container';

// =============================================================================
// Route
// =============================================================================

export default function WalletTopUpRoute() {
  return <TopUpPageContainer />;
}