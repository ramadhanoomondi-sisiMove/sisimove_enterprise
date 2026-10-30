
// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Method Detail Loading State
// -----------------------------------------------------------------------------

import { PaymentMethodPageContainer } from "@/components/admin/finance/payment-methods/layout/PaymentMethodPageContainer";
import { PaymentMethodLoadingState } from "@/components/admin/finance/payment-methods/shared/PaymentMethodLoadingState";

export default function PaymentMethodDetailLoading() {
  return (
    <PaymentMethodPageContainer>
      <div className="space-y-6">
        <div className="space-y-2" aria-hidden="true">
          <div className="h-7 w-64 animate-pulse rounded-md bg-[var(--background-muted)]" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded-md bg-[var(--background-muted)]" />
        </div>

        <PaymentMethodLoadingState rows={3} />
      </div>
    </PaymentMethodPageContainer>
  );
}
