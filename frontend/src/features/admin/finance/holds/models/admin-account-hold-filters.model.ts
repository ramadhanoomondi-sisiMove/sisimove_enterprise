import type { AdminAccountHoldStatus } from './admin-account-hold.enums';

export interface AdminAccountHoldFilters {
  search?: string;
  status?: AdminAccountHoldStatus | 'ALL';
  accountPublicId?: string;
  referenceType?: string;
  currency?: string;
  expired?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'amount' | 'expiresAt';
  sortDirection?: 'asc' | 'desc';
}

export const DEFAULT_ADMIN_ACCOUNT_HOLD_FILTERS: AdminAccountHoldFilters = {
  search: '',
  status: 'ALL',
  page: 1,
  pageSize: 20,
  sortBy: 'createdAt',
  sortDirection: 'desc',
};