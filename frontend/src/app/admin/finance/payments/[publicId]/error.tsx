
"use client";

// -----------------------------------------------------------------------------
// sisiMove Admin — Payments Route Error Boundary
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Catch errors thrown while rendering the Payments route.
// - Reuse the shared PaymentErrorState UI.
// - Allow the user to retry rendering through Next.js reset().
// - Keep route-level error handling separate from presentation.
// -----------------------------------------------------------------------------

import { useEffect } from "react";

import { PaymentErrorState } from "@/components/admin/finance/payments/shared/PaymentErrorState";

// =============================================================================
// Types
// =============================================================================

interface PaymentsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// =============================================================================
// Payments Error Boundary
// =============================================================================

export default function PaymentsError({
  error,
  reset,
}: PaymentsErrorProps) {
  useEffect(() => {
    // Replace with your project's error-reporting service if configured.
    console.error("Payments route error:", error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PaymentErrorState
        title="Unable to load payment details"
        description="Something went wrong while displaying payment information. Please try again."
        onRetry={reset}
        retryLabel="Try again"
      />
    </main>
  );
}
