
import type {
  AdminPaymentMethodDefaultFilter,
  AdminPaymentMethodSortDirection,
  AdminPaymentMethodSortField,
  AdminPaymentMethodStatusFilter,
} from './admin-payment-method.enums';

/**
 * Filters supported by the admin payment-method directory.
 *
 * Optional filters are omitted when they are not applied.
 */
export interface AdminPaymentMethodFilters {
  search?: string;

  accountPublicId?: string;

  type?: string;

  provider?: string;

  status?: AdminPaymentMethodStatusFilter;

  defaultFilter?: AdminPaymentMethodDefaultFilter;

  createdFrom?: string;

  createdTo?: string;

  sortBy?: AdminPaymentMethodSortField;

  sortDirection?: AdminPaymentMethodSortDirection;
}

/** Initial directory filter state. */
export const DEFAULT_ADMIN_PAYMENT_METHOD_FILTERS: AdminPaymentMethodFilters = {
  search: '',
  status: 'all',
  defaultFilter: 'all',
  sortBy: 'createdAt',
  sortDirection: 'desc',
};

/** Filters that can be represented as selectable directory options. */
export interface AdminPaymentMethodFilterOptions {
  types: readonly string[];
  providers: readonly string[];
}
