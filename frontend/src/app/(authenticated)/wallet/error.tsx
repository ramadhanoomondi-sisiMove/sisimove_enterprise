'use client';

// -----------------------------------------------------------------------------
// sisiMove — Authenticated Wallet Error Boundary
// -----------------------------------------------------------------------------
//
// Route-level error boundary for the authenticated wallet surface.
//
// Responsibilities:
// - receive errors thrown while rendering the wallet route;
// - present a clear recovery state;
// - allow the user to retry the route.
//
// This component intentionally does NOT:
// - perform financial API calls;
// - own React Query state;
// - duplicate WalletPageContainer error handling;
// - know about FinancialAccount or FinancialTransaction internals;
// - recreate the authenticated application shell.
//
// Next.js requires this boundary to be a Client Component because the
// `error` object and `reset` recovery callback are provided by the framework.
//
// `reset()` asks Next.js to attempt rendering the affected route again.
// -----------------------------------------------------------------------------

import { useEffect } from 'react';

interface WalletErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WalletError({
  error,
  reset,
}: WalletErrorProps) {
  useEffect(() => {
    // -------------------------------------------------------------------------
    // Keep error reporting at the application/observability boundary.
    //
    // Do not log financial payloads, account identifiers, balances, payment
    // details, or other sensitive financial information here.
    // -------------------------------------------------------------------------
    console.error('Wallet route error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container py-6 sm:py-8">
        <section
          role="alert"
          className="surface p-6 sm:p-8"
        >
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              sisiMove Wallet
            </p>

            <h1 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
              We couldn&apos;t load your wallet
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
              Something went wrong while loading this page. Please try again.
            </p>

            <div className="mt-5">
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--brand-foreground)] transition-colors hover:bg-[var(--brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}