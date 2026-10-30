import type {
  AdminFinancialPaymentStatus,
} from './admin-financial-payment.enums';

/**
 * Frontend directory filters.
 *
 * These fields describe UI filtering intent. The supplied backend
 * controller does not currently expose a payments-list/filter endpoint.
 */
export interface AdminFinancialPaymentFilters {
  search?: string;

  statuses?: AdminFinancialPaymentStatus[];

  accountId?: string;

  methodId?: string;

  transactionPublicId?: string;

  referenceType?: string;

  referencePublicId?: string;

  initiatedFrom?: string;

  initiatedTo?: string;

  createdFrom?: string;

  createdTo?: string;
}

export const DEFAULT_ADMIN_FINANCIAL_PAYMENT_FILTERS: AdminFinancialPaymentFilters =
  {
    search: '',
    statuses: [],
    accountId: '',
    methodId: '',
    transactionPublicId: '',
    referenceType: '',
    referencePublicId: '',
    initiatedFrom: '',
    initiatedTo: '',
    createdFrom: '',
    createdTo: '',
  };