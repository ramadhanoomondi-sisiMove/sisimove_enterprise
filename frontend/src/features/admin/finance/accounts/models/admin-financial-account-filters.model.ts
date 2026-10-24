// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Filters
// -----------------------------------------------------------------------------
// UI filter state only. This does not imply that the backend currently exposes
// a list, search, filtering, or pagination endpoint.
// -----------------------------------------------------------------------------

import type {
  AdminFinancialAccountStatus,
  AdminFinancialAccountType,
} from './admin-financial-account.enums';

export interface AdminFinancialAccountFilters {
  /** Case-insensitive client-side search when a collection is available. */
  search: string;
  status: AdminFinancialAccountStatus | 'ALL';
  type: AdminFinancialAccountType | 'ALL';
  /** Exact currency code, or ALL to include every currency. */
  currency: string | 'ALL';
  /** Exact owner public ID; ownerless accounts can have no ownerPublicId. */
  ownerPublicId: string;
}

export const DEFAULT_ADMIN_FINANCIAL_ACCOUNT_FILTERS: Readonly<AdminFinancialAccountFilters> = {
  search: '',
  status: 'ALL',
  type: 'ALL',
  currency: 'ALL',
  ownerPublicId: '',
};
