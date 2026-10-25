import type {
  AdminFinancialTransactionStatus,
  AdminFinancialTransactionType,
} from './admin-financial-transaction.enums';

export interface AdminFinancialTransactionFilters {
  search?: string;

  status?: AdminFinancialTransactionStatus | 'ALL';

  type?: AdminFinancialTransactionType | 'ALL';

  currency?: string | 'ALL';

  sourceAccountPublicId?: string;

  destinationAccountPublicId?: string;

  reference?: string;

  createdFrom?: string;

  createdTo?: string;

  page?: number;

  pageSize?: number;

  sortBy?: 'createdAt' | 'updatedAt' | 'amount' | 'status';

  sortDirection?: 'asc' | 'desc';
}

export const DEFAULT_ADMIN_FINANCIAL_TRANSACTION_FILTERS:
  Readonly<AdminFinancialTransactionFilters> = {
    search: '',
    status: 'ALL',
    type: 'ALL',
    currency: 'ALL',
    page: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  };