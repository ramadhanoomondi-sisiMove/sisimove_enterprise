
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Methods Feature
 * -----------------------------------------------------------------------------
 *
 * Public entry point for the admin payment-methods feature.
 *
 * Responsibilities:
 * - Expose the feature's public API.
 * - Expose payment-method query and operation hooks.
 * - Expose payment-method models, enums, filters, and metrics.
 * - Expose payment-method response mappers.
 *
 * Internal modules should be imported directly within this feature when
 * appropriate. Consumers outside this feature should prefer these exports.
 * -----------------------------------------------------------------------------
 */

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export {
  AdminPaymentMethodsApi,
  adminPaymentMethodsApi,
  ADMIN_PAYMENT_METHODS_ENDPOINTS,
  defaultAdminPaymentMethodsEndpoints,
} from './api';

export type {
  AddAdminPaymentMethodPayload,
  AdminSetDefaultPaymentMethodPayload,
  AdminDeactivatePaymentMethodPayload,
} from './api';

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

export {
  useAdminPaymentMethods,
  adminPaymentMethodKeys,
  filterAdminPaymentMethods,
  useAdminPaymentMethod,
  useAdminPaymentMethodMetrics,
  useAdminPaymentMethodOperations,
  useAdminPaymentMethodFilters,
} from './hooks';

export type {
  AdminPaymentMethodFilters,
  AdminPaymentMethodPagination,
  AdminPaymentMethodSort,
  AdminPaymentMethodSortBy,
  AdminPaymentMethodSortDirection,
} from './hooks';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export * from './models';

// -----------------------------------------------------------------------------
// Mappers
// -----------------------------------------------------------------------------

export {
  AdminPaymentMethodMapper,
  defaultAdminPaymentMethodMapper,
} from './mappers';
