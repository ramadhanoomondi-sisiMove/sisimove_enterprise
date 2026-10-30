
// src/app/admin/payment-methods/loading.tsx

// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Methods Route Loading State
// -----------------------------------------------------------------------------
//
// Provides a consistent loading skeleton while the Payment Methods page loads.
// Reuses the feature's PaymentMethodLoadingState component.
// -----------------------------------------------------------------------------

import { PaymentMethodLoadingState } from "@/components/admin/finance/payment-methods/shared";

export default function PaymentMethodsLoading() {
  return (
    <main
      className="w-full"
      aria-label="Payment methods page loading"
    >
      <div className="mx-auto w-full max-w-screen-2xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section
          className="space-y-2"
          aria-hidden="true"
        >
          <div className="h-7 w-64 animate-pulse rounded-md bg-[var(--background-muted)]" />
          <div className="h-4 w-full max-w-2xl animate-pulse rounded-md bg-[var(--background-muted)]" />
        </section>

        <section
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
          role="status"
          aria-live="polite"
        >
          <p className="mb-4 text-sm text-[var(--foreground-muted)]">
            Loading payment methods…
          </p>

          <PaymentMethodLoadingState rows={5} />
        </section>
      </div>
    </main>
  );
}
