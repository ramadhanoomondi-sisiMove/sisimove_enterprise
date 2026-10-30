
import type {
  AdminPaymentMethodSortDirection,
  AdminPaymentMethodSortField,
} from './admin-payment-method.enums';

/**
 * Admin Payment Method — Query Model
 *
 * Describes the query parameters used to retrieve payment-method directory
 * data. The backend must explicitly implement the corresponding list endpoint.
 */
export interface AdminPaymentMethodQuery {
  page?: number;

  pageSize?: number;

  search?: string;

  accountPublicId?: string;

  type?: string;

  provider?: string;

  isActive?: boolean;

  isDefault?: boolean;

  createdFrom?: string;

  createdTo?: string;

  sortBy?: AdminPaymentMethodSortField;

  sortDirection?: AdminPaymentMethodSortDirection;
}

/** Query for retrieving one payment method by its public identifier. */
export interface AdminPaymentMethodDetailQuery {
  publicId: string;
}

/** Query for retrieving an account's default payment method. */
export interface AdminDefaultPaymentMethodQuery {
  accountPublicId: string;
}

/** Default pagination and ordering values for directory requests. */
export const DEFAULT_ADMIN_PAYMENT_METHOD_QUERY: Required<
  Pick<AdminPaymentMethodQuery, 'page' | 'pageSize' | 'sortBy' | 'sortDirection'>
> = {
  page: 1,
  pageSize: 20,
  sortBy: 'createdAt',
  sortDirection: 'desc',
};
