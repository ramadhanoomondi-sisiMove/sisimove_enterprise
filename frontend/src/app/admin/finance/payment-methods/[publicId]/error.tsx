
"use client";

// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Method Detail Error Boundary
// -----------------------------------------------------------------------------

import { useEffect } from "react";

import { PaymentMethodPageContainer } from "@/components/admin/finance/payment-methods/layout/PaymentMethodPageContainer";
import { PaymentMethodErrorState } from "@/components/admin/finance/payment-methods/shared/PaymentMethodErrorState";

interface PaymentMethodDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PaymentMethodDetailError({
  error,
  reset,
}: PaymentMethodDetailErrorProps) {
  useEffect(() => {
    console.error("Payment Method Detail route error:", error);
  }, [error]);

  return (
    <PaymentMethodPageContainer>
      <PaymentMethodErrorState
        title="Unable to load payment method"
        description="An unexpected error occurred while opening this payment method. Please try again."
        onRetry={reset}
      />
    </PaymentMethodPageContainer>
  );
}
