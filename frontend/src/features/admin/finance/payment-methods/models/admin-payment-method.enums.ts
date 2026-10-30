
/**
 * Admin Payment Method — Enums and shared literals.
 *
 * These are frontend presentation/filtering concepts, not replacements for
 * the authoritative domain value objects.
 */

/** Payment-method lifecycle filter. */
export const ADMIN_PAYMENT_METHOD_STATUS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type AdminPaymentMethodStatusFilter =
  (typeof ADMIN_PAYMENT_METHOD_STATUS)[keyof typeof ADMIN_PAYMENT_METHOD_STATUS];

/** Default-method filter. */
export const ADMIN_PAYMENT_METHOD_DEFAULT_FILTER = {
  ALL: 'all',
  DEFAULT: 'default',
  NON_DEFAULT: 'non-default',
} as const;

export type AdminPaymentMethodDefaultFilter =
  (typeof ADMIN_PAYMENT_METHOD_DEFAULT_FILTER)[keyof typeof ADMIN_PAYMENT_METHOD_DEFAULT_FILTER];

/** Supported directory sort directions. */
export const ADMIN_PAYMENT_METHOD_SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type AdminPaymentMethodSortDirection =
  (typeof ADMIN_PAYMENT_METHOD_SORT_DIRECTION)[keyof typeof ADMIN_PAYMENT_METHOD_SORT_DIRECTION];

/**
 * Fields available for directory sorting.
 *
 * Keep these aligned with the backend query contract.
 */
export const ADMIN_PAYMENT_METHOD_SORT_FIELD = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  TYPE: 'type',
  PROVIDER: 'provider',
  DISPLAY_NAME: 'displayName',
} as const;

export type AdminPaymentMethodSortField =
  (typeof ADMIN_PAYMENT_METHOD_SORT_FIELD)[keyof typeof ADMIN_PAYMENT_METHOD_SORT_FIELD];

/** Supported admin operations. */
export const ADMIN_PAYMENT_METHOD_OPERATION = {
  SET_DEFAULT: 'set-default',
  DEACTIVATE: 'deactivate',
} as const;

export type AdminPaymentMethodOperation =
  (typeof ADMIN_PAYMENT_METHOD_OPERATION)[keyof typeof ADMIN_PAYMENT_METHOD_OPERATION];

/** Operation execution state used by the UI. */
export const ADMIN_PAYMENT_METHOD_OPERATION_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type AdminPaymentMethodOperationStatus =
  (typeof ADMIN_PAYMENT_METHOD_OPERATION_STATUS)[keyof typeof ADMIN_PAYMENT_METHOD_OPERATION_STATUS];
