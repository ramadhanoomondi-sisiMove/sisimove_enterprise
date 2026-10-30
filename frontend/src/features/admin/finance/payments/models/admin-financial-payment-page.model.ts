import type { AdminFinancialPayment } from './admin-financial-payment.model';

/**
 * Generic paginated result shape for the frontend.
 *
 * This is a frontend contract, not a claim about the current API response.
 * Adapt it to the actual backend pagination envelope when a list endpoint
 * is available.
 */
export interface AdminFinancialPaymentPage {
  items: AdminFinancialPayment[];

  page: number;

  pageSize: number;

  totalItems: number;

  totalPages: number;

  hasPreviousPage: boolean;

  hasNextPage: boolean;
}

/**
 * Safe initial state for a payments directory.
 */
export const EMPTY_ADMIN_FINANCIAL_PAYMENT_PAGE: AdminFinancialPaymentPage =
  {
    items: [],
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  };