
 // -----------------------------------------------------------------------------
 // sisiMove Admin — Payments Route Loading
 // -----------------------------------------------------------------------------
 //
 // Responsibilities:
 // - Provide a route-level loading fallback for the Payments page.
 // - Reuse the shared PaymentLoadingState component.
 // - Keep loading presentation consistent with the design system.
 // -----------------------------------------------------------------------------

import { PaymentLoadingState } from "@/components/admin/finance/payments/shared/PaymentLoadingState";

// =============================================================================
// Payments Loading
// =============================================================================

export default function PaymentsLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PaymentLoadingState
        label="Loading payments"
        className="min-h-64"
      />
    </main>
  );
}
