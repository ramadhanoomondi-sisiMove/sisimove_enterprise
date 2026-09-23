// -----------------------------------------------------------------------------
// sisiMove — Wallet Recent Activity
// -----------------------------------------------------------------------------
//
// Recent wallet activity presentation surface.
//
// Responsibility:
// - Present a compact list of recent wallet activities.
// - Compose WalletActivityItem.
// - Provide an optional caller-owned footer/action.
//
// This component does NOT:
// - fetch transactions;
// - map API responses;
// - calculate balances;
// - apply transaction business rules;
// - perform navigation or financial operations.
//
// The wallet feature/page owns data retrieval and orchestration.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  WalletActivityItem,
  type WalletActivityItemProps,
} from './wallet-activity-item';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WalletRecentActivityProps {
  /**
   * Recent activities already mapped into presentation-friendly data.
   */
  activities: WalletActivityItemProps[];

  /**
   * Optional content rendered below the activity list.
   *
   * Typically a link to the complete transaction history.
   */
  footer?: ReactNode;

  /**
   * Maximum number of activities to display.
   *
   * Defaults to five for the wallet overview surface.
   */
  limit?: number;
}

// -----------------------------------------------------------------------------
// Wallet Recent Activity
// -----------------------------------------------------------------------------

export function WalletRecentActivity({
  activities,
  footer,
  limit = 5,
}: WalletRecentActivityProps) {
  const visibleActivities = activities.slice(0, Math.max(0, limit));

  return (
    <section
      aria-labelledby="wallet-recent-activity-title"
      className="surface p-4"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id="wallet-recent-activity-title"
          className="text-sm font-semibold text-[var(--foreground)]"
        >
          Recent activity
        </h2>
      </div>

      {visibleActivities.length > 0 ? (
        <div className="mt-2 divide-y divide-[var(--border-subtle)]">
          {visibleActivities.map((activity) => (
            <WalletActivityItem
              key={activity.id}
              {...activity}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-[var(--foreground-secondary)]">
            No recent activity
          </p>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Wallet activity will appear here when transactions occur.
          </p>
        </div>
      )}

      {footer ? (
        <div className="mt-3 border-t border-[var(--border-subtle)] pt-3">
          {footer}
        </div>
      ) : null}
    </section>
  );
}