
/**
 * SisiMove Admin — Withdrawal Filters
 */

import type {
  AdminWithdrawalDestinationType,
  AdminWithdrawalStatus,
} from './admin-withdrawal.enums';

// =============================================================================
// Filters
// =============================================================================

export interface AdminWithdrawalFilters {
  search: string;

  status: AdminWithdrawalStatus | 'ALL';

  destinationType: AdminWithdrawalDestinationType | 'ALL';

  accountPublicId: string;

  currency: string;

  dateFrom: string;

  dateTo: string;
}

// =============================================================================
// Defaults
// =============================================================================

export const DEFAULT_ADMIN_WITHDRAWAL_FILTERS: AdminWithdrawalFilters = {
  search: '',
  status: 'ALL',
  destinationType: 'ALL',
  accountPublicId: '',
  currency: '',
  dateFrom: '',
  dateTo: '',
};

// =============================================================================
// Filter State
// =============================================================================

export type AdminWithdrawalFilterKey =
  keyof AdminWithdrawalFilters;

export type AdminWithdrawalFilterValue =
  AdminWithdrawalFilters[AdminWithdrawalFilterKey];
