
// src/app/admin/payment-methods/error.tsx

"use client";

// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Methods Route Error Boundary
// -----------------------------------------------------------------------------
//
// Displays a recoverable error when the Payment Methods route fails.
// Uses the shared PaymentMethodErrorState component.
// Next.js requires error boundary components to be Client Components.
// -----------------------------------------------------------------------------

import { useEffect } from "react";

import { PaymentMethodErrorState } from "@/components/admin/finance/payment-methods/shared";

interface PaymentMethodsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PaymentMethodsError({
  error,
  reset,
}: PaymentMethodsErrorProps) {
  useEffect(() => {
    // Replace with the project's logging service if one is available.
    console.error("Payment Methods route error:", error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <PaymentMethodErrorState
        title="Unable to load payment methods"
        description="The payment-method page encountered an unexpected error. Please try again."
        onRetry={reset}
      />
    </main>
  );
}
