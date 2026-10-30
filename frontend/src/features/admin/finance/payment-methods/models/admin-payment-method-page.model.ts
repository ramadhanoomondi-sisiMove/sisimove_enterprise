
import type {
  AdminPaymentMethod,
  AdminPaymentMethodSummary,
} from './admin-payment-method.model';

/** Pagination metadata returned by a directory endpoint. */
export interface AdminPaymentMethodPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/** Paginated payment-method directory response. */
export interface AdminPaymentMethodPage {
  items: AdminPaymentMethodSummary[];
  pagination: AdminPaymentMethodPagination;
}

/** Generic API response for a paginated directory. */
export interface AdminPaymentMethodPageResponse {
  data: AdminPaymentMethod[];
  pagination: AdminPaymentMethodPagination;
}

/** Parameters used when changing the displayed directory page. */
export interface AdminPaymentMethodPaginationParams {
  page: number;
  pageSize: number;
}

/** Creates an empty directory result. */
export function createEmptyAdminPaymentMethodPage(
  page = 1,
  pageSize = 20,
): AdminPaymentMethodPage {
  return {
    items: [],
    pagination: {
      page,
      pageSize,
      totalItems: 0,
      totalPages: 0,
      hasPreviousPage: page > 1,
      hasNextPage: false,
    },
  };
}
