// -----------------------------------------------------------------------------
// sisiMove — Wallet Components
// -----------------------------------------------------------------------------
//
// Public export surface for the wallet component feature.
//
// Consumers should import wallet components from this barrel rather than
// reaching into individual implementation files.
//
// Example:
//
// import {
//   WalletOverview,
//   WalletBalanceCard,
// } from '@/components/financial/wallet';
// -----------------------------------------------------------------------------

export { WalletOverview } from './wallet-overview';
export type { WalletOverviewProps } from './wallet-overview';

export { WalletBalanceCard } from './wallet-balance-card';
export type { WalletBalanceCardProps } from './wallet-balance-card';

export { WalletBalanceBreakdown } from './wallet-balance-breakdown';
export type {
  WalletBalanceBreakdownProps,
} from './wallet-balance-breakdown';

export { WalletStatusCard } from './wallet-status-card';
export type {
  WalletAccountStatus,
  WalletStatusCardProps,
} from './wallet-status-card';

export { WalletQuickActions } from './wallet-quick-actions';
export type {
  WalletQuickAction,
  WalletQuickActionsProps,
} from './wallet-quick-actions';

export { WalletRecentActivity } from './wallet-recent-activity';
export type {
  WalletRecentActivityProps,
} from './wallet-recent-activity';

export { WalletActivityItem } from './wallet-activity-item';
export type {
  WalletActivityDirection,
  WalletActivityItemProps,
} from './wallet-activity-item';