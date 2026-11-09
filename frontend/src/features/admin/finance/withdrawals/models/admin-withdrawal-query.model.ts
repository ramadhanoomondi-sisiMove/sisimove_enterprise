
/**
 * SisiMove Admin — Withdrawal Query Models
 */

import type { AdminWithdrawalStatus } from './admin-withdrawal.enums';

// =============================================================================
// Shared Query Parameters
// =============================================================================

export interface AdminWithdrawalDateRange {
  from?: string;
  to?: string;
}

export type AdminWithdrawalSortDirection = 'asc' | 'desc';

export type AdminWithdrawalSortField =
  | 'requestedAt'
  | 'createdAt'
  | 'updatedAt'
  | 'amount';

// =============================================================================
// List Query
// =============================================================================

export interface AdminWithdrawalQuery
  extends AdminWithdrawalDateRange {
  accountPublicId?: string;

  status?: AdminWithdrawalStatus;

  page?: number;

  pageSize?: number;

  sortBy?: AdminWithdrawalSortField;

  sortDirection?: AdminWithdrawalSortDirection;
}

// =============================================================================
// Account Query
// =============================================================================

export interface AdminAccountWithdrawalsQuery {
  accountPublicId: string;
}

// =============================================================================
// Account + Status Query
// =============================================================================

export interface AdminAccountWithdrawalsByStatusQuery
  extends AdminAccountWithdrawalsQuery {
  status: AdminWithdrawalStatus;
}

// =============================================================================
// Detail Query
// =============================================================================

export interface AdminWithdrawalDetailQuery {
  publicId: string;
}
