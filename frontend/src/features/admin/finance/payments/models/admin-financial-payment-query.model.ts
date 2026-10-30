import type {
  AdminFinancialPaymentSortDirection,
  AdminFinancialPaymentSortField,
} from './admin-financial-payment.enums';

import type { AdminFinancialPaymentFilters } from './admin-financial-payment-filters.model';

/**
 * Query state for a future or existing payment directory.
 *
 * Pagination and sorting must only be sent to the backend when the
 * corresponding API endpoint supports them.
 */
export interface AdminFinancialPaymentQuery {
  filters: AdminFinancialPaymentFilters;

  page: number;

  pageSize: number;

  sortBy?: AdminFinancialPaymentSortField;

  sortDirection?: AdminFinancialPaymentSortDirection;
}

export const DEFAULT_ADMIN_FINANCIAL_PAYMENT_QUERY: AdminFinancialPaymentQuery =
  {
    filters: {},
    page: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  };