
"use client";

// -----------------------------------------------------------------------------
// sisiMove — Wallet Quick Actions
// -----------------------------------------------------------------------------
//
// Compact action group for the primary wallet operations.
//
// Responsibilities:
// - Present caller-provided actions.
// - Control responsive layout.
// - Provide accessible grouping.
// - Maintain consistent action spacing and alignment.
//
// Non-responsibilities:
// - Performing financial operations.
// - Determining action availability.
// - Fetching wallet state.
// - Defining navigation.
// - Applying financial business rules.
//
// Action appearance and behavior belong to the caller.
// -----------------------------------------------------------------------------

import type { ReactNode } from "react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WalletQuickAction {
  /**
   * Stable key used for React rendering.
   */
  readonly id: string;

  /**
   * User-facing action label.
   */
  readonly label: string;

  /**
   * Optional supporting description.
   */
  readonly description?: string;

  /**
   * Caller-provided interactive element.
   *
   * Usually a Button or Link from the application UI layer.
   */
  readonly action: ReactNode;
}

export interface WalletQuickActionsProps {
  /**
   * Actions currently available to the wallet user.
   */
  readonly actions: readonly WalletQuickAction[];
}

// -----------------------------------------------------------------------------
// Wallet Quick Actions
// -----------------------------------------------------------------------------

export function WalletQuickActions({
  actions,
}: WalletQuickActionsProps): ReactNode {
  if (actions.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="wallet-quick-actions-title"
      className="surface p-4 sm:p-5"
    >
      <header className="mb-4">
        <h2
          id="wallet-quick-actions-title"
          className="text-sm font-semibold text-[var(--foreground)]"
        >
          Quick actions
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((item) => (
          <article
            key={item.id}
            className={[
              "flex min-w-0 flex-col",
              "rounded-[var(--radius-md)]",
              "border border-[var(--border)]",
              "bg-[var(--surface)]",
              "p-3 sm:p-4",
            ].join(" ")}
          >
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                {item.label}
              </h3>

              {item.description ? (
                <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
                  {item.description}
                </p>
              ) : null}
            </div>

            <div className="mt-3 w-full">
              {item.action}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WalletQuickActions;
