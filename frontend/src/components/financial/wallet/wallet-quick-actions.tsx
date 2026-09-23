// -----------------------------------------------------------------------------
// sisiMove — Wallet Quick Actions
// -----------------------------------------------------------------------------
//
// Compact action group for the primary wallet operations.
//
// Typical actions:
//
// - Add money
// - Withdraw
// - Payment methods
// - Transactions
//
// Architectural boundary:
//
// This component:
// - presents caller-provided actions;
// - controls responsive layout;
// - provides accessible grouping.
//
// This component does NOT:
// - perform financial operations;
// - decide whether an action is permitted;
// - fetch wallet state;
// - contain routing logic;
// - know about API responses.
//
// Availability and behavior belong to the wallet feature/page orchestration.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WalletQuickAction {
  /**
   * Stable key used for React rendering.
   */
  id: string;

  /**
   * User-facing action label.
   */
  label: string;

  /**
   * Optional supporting description.
   */
  description?: string;

  /**
   * Caller-provided interactive element.
   *
   * Usually a Button or Link from the application UI layer.
   */
  action: ReactNode;
}

export interface WalletQuickActionsProps {
  /**
   * Actions currently available to the wallet user.
   */
  actions: WalletQuickAction[];
}

// -----------------------------------------------------------------------------
// Wallet Quick Actions
// -----------------------------------------------------------------------------

export function WalletQuickActions({
  actions,
}: WalletQuickActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="wallet-quick-actions-title"
      className="surface p-4"
    >
      <div className="mb-4">
        <h2
          id="wallet-quick-actions-title"
          className="text-sm font-semibold text-[var(--foreground)]"
        >
          Quick actions
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((item) => (
          <div
            key={item.id}
            className={[
              'rounded-[var(--radius-md)]',
              'border',
              'border-[var(--border)]',
              'p-3',
            ].join(' ')}
          >
            <div className="flex min-w-0 flex-col gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {item.label}
                </p>

                {item.description ? (
                  <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
                    {item.description}
                  </p>
                ) : null}
              </div>

              <div className="w-full">
                {item.action}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}