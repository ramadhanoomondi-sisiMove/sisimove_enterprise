// =============================================================================
// sisiMove — Wallet Payment Methods Route
// =============================================================================
//
// Thin Next.js App Router boundary for the authenticated payment-method
// management surface.
//
// Architecture:
//
//     Next.js Route
//          │
//          ▼
//     PaymentMethodsPageContainer
//          │
//          ▼
//     Feature hooks
//          │
//          ▼
//     Feature API adapters
//          │
//          ▼
//     sisiMove backend
//
// The authenticated layout already owns:
// - authentication/session context;
// - authenticated navigation;
// - profile/avatar loading;
// - global application shell.
//
// Therefore this route intentionally does NOT:
// - fetch payment methods;
// - own payment-method state;
// - perform mutations;
// - validate forms;
// - render the authenticated shell;
// - duplicate financial orchestration.
//
// =============================================================================

import { PaymentMethodsPageContainer } from '@/components/financial/payment-methods/payment-methods-page-container';

// =============================================================================
// Route
// =============================================================================

export default function PaymentMethodsRoute() {
  return <PaymentMethodsPageContainer />;
}