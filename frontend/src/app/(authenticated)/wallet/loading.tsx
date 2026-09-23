// -----------------------------------------------------------------------------
// sisiMove — Authenticated Wallet Loading State
// -----------------------------------------------------------------------------
//
// Route-level loading UI for the authenticated wallet surface.
//
// Responsibilities:
// - provide immediate visual feedback while the wallet route is loading;
// - preserve the wallet page's visual structure during the transition.
//
// This component intentionally does NOT:
// - fetch financial-account data;
// - fetch balance data;
// - use React Query hooks;
// - duplicate WalletPageContainer orchestration;
// - render the authenticated application shell.
//
// Next.js automatically renders this boundary while the wallet route's
// server/client tree is loading.
//
// The authenticated application shell remains owned by:
//     src/app/(authenticated)/layout.tsx
// -----------------------------------------------------------------------------

export default function WalletLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading wallet"
      className="min-h-screen bg-[var(--background-brand)]"
    >
      <div className="page-container py-6 sm:py-8">
        <div className="space-y-4">
          {/* -----------------------------------------------------------------
              Page heading skeleton
             ----------------------------------------------------------------- */}
          <section className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-[var(--background-muted)]" />
            <div className="h-7 w-32 animate-pulse rounded bg-[var(--background-muted)]" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded bg-[var(--background-muted)]" />
          </section>

          {/* -----------------------------------------------------------------
              Available balance skeleton
             ----------------------------------------------------------------- */}
          <section
            aria-hidden="true"
            className="surface p-5"
          >
            <div className="space-y-3">
              <div className="h-3 w-32 animate-pulse rounded bg-[var(--background-muted)]" />
              <div className="h-9 w-40 animate-pulse rounded bg-[var(--background-muted)]" />
            </div>
          </section>

          {/* -----------------------------------------------------------------
              Balance breakdown skeleton
             ----------------------------------------------------------------- */}
          <section
            aria-hidden="true"
            className="surface p-4"
          >
            <div className="mb-4 space-y-2">
              <div className="h-4 w-36 animate-pulse rounded bg-[var(--background-muted)]" />
              <div className="h-3 w-64 max-w-full animate-pulse rounded bg-[var(--background-muted)]" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-[var(--background-muted)]" />
                <div className="h-5 w-28 animate-pulse rounded bg-[var(--background-muted)]" />
              </div>

              <div className="space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-[var(--background-muted)]" />
                <div className="h-5 w-28 animate-pulse rounded bg-[var(--background-muted)]" />
              </div>

              <div className="space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-[var(--background-muted)]" />
                <div className="h-5 w-28 animate-pulse rounded bg-[var(--background-muted)]" />
              </div>
            </div>
          </section>

          {/* -----------------------------------------------------------------
              Account status skeleton
             ----------------------------------------------------------------- */}
          <section
            aria-hidden="true"
            className="surface p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-[var(--background-muted)]" />
                <div className="h-3 w-48 max-w-full animate-pulse rounded bg-[var(--background-muted)]" />
              </div>

              <div className="h-6 w-20 animate-pulse rounded-full bg-[var(--background-muted)]" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}