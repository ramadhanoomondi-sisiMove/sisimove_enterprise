// -----------------------------------------------------------------------------
// sisiMove — Wallet Overview
// -----------------------------------------------------------------------------
//
// Composition component for the authenticated wallet overview.
//
// Presentation hierarchy:
//
// WalletOverview
// ├── WalletBalanceCard
// ├── WalletBalanceBreakdown
// ├── WalletStatusCard
// ├── WalletQuickActions
// └── WalletRecentActivity
//
// Architectural boundary:
//
// This component:
// - composes wallet presentation components;
// - receives already-resolved wallet data;
// - controls the responsive layout.
//
// This component does NOT:
// - fetch wallet data;
// - call financial APIs;
// - perform financial operations;
// - calculate balances;
// - determine account permissions;
// - map backend API responses.
//
// Data retrieval and application orchestration belong outside the component.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { WalletBalanceBreakdown } from './wallet-balance-breakdown';
import { WalletBalanceCard } from './wallet-balance-card';
import { WalletQuickActions } from './wallet-quick-actions';
import type { WalletQuickAction } from './wallet-quick-actions';
import { WalletRecentActivity } from './wallet-recent-activity';
import type { WalletActivityItemProps } from './wallet-activity-item';
import {
  WalletStatusCard,
  type WalletAccountStatus,
} from './wallet-status-card';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WalletOverviewProps {
  /**
   * Amount currently available for use.
   *
   * Expressed in integer minor units.
   */
  availableAmount: number;

  /**
   * Amount currently pending.
   *
   * Expressed in integer minor units.
   */
  pendingAmount: number;

  /**
   * Amount currently held.
   *
   * Expressed in integer minor units.
   */
  heldAmount: number;

  /**
   * Currency used by the financial account.
   */
  currency?: string;

  /**
   * Current financial account status.
   */
  status: WalletAccountStatus;

  /**
   * Optional status explanation.
   */
  statusMessage?: string;

  /**
   * Available wallet actions.
   */
  actions?: WalletQuickAction[];

  /**
   * Recent wallet activity.
   */
  recentActivity?: WalletActivityItemProps[];

  /**
   * Optional action rendered with the primary balance.
   *
   * Usually a caller-provided Link or Button.
   */
  balanceAction?: ReactNode;

  /**
   * Optional content rendered after the recent activity list.
   *
   * Usually a link to the complete transaction history.
   */
  activityFooter?: ReactNode;
}

// -----------------------------------------------------------------------------
// Wallet Overview
// -----------------------------------------------------------------------------

export function WalletOverview({
  availableAmount,
  pendingAmount,
  heldAmount,
  currency = 'KES',
  status,
  statusMessage,
  actions = [],
  recentActivity = [],
  balanceAction,
  activityFooter,
}: WalletOverviewProps) {
  return (
    <div className="space-y-4">
      <WalletBalanceCard
        availableAmount={availableAmount}
        currency={currency}
        action={balanceAction}
      />

      <WalletBalanceBreakdown
        availableAmount={availableAmount}
        pendingAmount={pendingAmount}
        heldAmount={heldAmount}
        currency={currency}
      />

      <WalletStatusCard
        status={status}
        message={statusMessage}
      />

      <WalletQuickActions actions={actions} />

      <WalletRecentActivity
        activities={recentActivity}
        footer={activityFooter}
      />
    </div>
  );
}