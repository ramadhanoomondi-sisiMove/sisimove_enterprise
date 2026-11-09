
/**
 * SisiMove Admin — Financial Account Withdrawal Models
 *
 * Public exports for the withdrawal feature.
 */

// =============================================================================
// Enums
// =============================================================================

export {
  ADMIN_WITHDRAWAL_STATUSES,
  ADMIN_WITHDRAWAL_DESTINATION_TYPES,
  ADMIN_WITHDRAWAL_TERMINAL_STATUSES,
  ADMIN_WITHDRAWAL_ACTIONS,
  ADMIN_WITHDRAWAL_TRANSITIONS,
  getAdminWithdrawalActions,
  isAdminWithdrawalStatus,
  isAdminWithdrawalDestinationType,
} from './admin-withdrawal.enums';

export type {
  AdminWithdrawalStatus,
  AdminWithdrawalDestinationType,
  AdminWithdrawalAction,
} from './admin-withdrawal.enums';

// =============================================================================
// Core Models
// =============================================================================

export {
  isAdminWithdrawal,
} from './admin-withdrawal.model';

export type {
  AdminWithdrawal,
  AdminWithdrawalCollection,
  AdminWithdrawalId,
} from './admin-withdrawal.model';

// =============================================================================
// Filters
// =============================================================================

export {
  DEFAULT_ADMIN_WITHDRAWAL_FILTERS,
} from './admin-withdrawal-filters.model';

export type {
  AdminWithdrawalFilters,
  AdminWithdrawalFilterKey,
  AdminWithdrawalFilterValue,
} from './admin-withdrawal-filters.model';

// =============================================================================
// Queries
// =============================================================================

export type {
  AdminWithdrawalDateRange,
  AdminWithdrawalSortDirection,
  AdminWithdrawalSortField,
  AdminWithdrawalQuery,
  AdminAccountWithdrawalsQuery,
  AdminAccountWithdrawalsByStatusQuery,
  AdminWithdrawalDetailQuery,
} from './admin-withdrawal-query.model';

// =============================================================================
// Pagination
// =============================================================================

export {
  DEFAULT_ADMIN_WITHDRAWAL_PAGE,
  calculateAdminPageMetadata,
} from './admin-withdrawal-page.model';

export type {
  AdminPageMetadata,
  AdminPage,
  AdminPageParameters,
} from './admin-withdrawal-page.model';

// =============================================================================
// Metrics
// =============================================================================

export {
  EMPTY_ADMIN_WITHDRAWAL_METRICS,
  calculateAdminWithdrawalMetrics,
} from './admin-withdrawal-metrics.model';

export type {
  AdminWithdrawalStatusCounts,
  AdminWithdrawalAmountMetrics,
  AdminWithdrawalMetrics,
} from './admin-withdrawal-metrics.model';

// =============================================================================
// Operations
// =============================================================================

export type {
  AdminWithdrawalCommandMetadata,
  AdminWithdrawalRequest,
  AdminWithdrawalProcessRequest,
  AdminWithdrawalCompleteRequest,
  AdminWithdrawalFailRequest,
  AdminWithdrawalCancelRequest,
  AdminWithdrawalOperationPayloads,
  AdminWithdrawalOperationResult,
} from './admin-withdrawal-operations.model';
