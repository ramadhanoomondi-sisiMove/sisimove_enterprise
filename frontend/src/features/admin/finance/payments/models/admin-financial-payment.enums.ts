/**
 * Financial payment enum and shared literal types.
 *
 * Keep these values aligned with the backend domain enums.
 * If the backend uses different literal values, update these unions
 * to match the API contract.
 */

export const ADMIN_FINANCIAL_PAYMENT_STATUSES = [
  'pending',
  'processing',
  'succeeded',
  'failed',
  'cancelled',
  'expired',
] as const;

export type AdminFinancialPaymentStatus =
  (typeof ADMIN_FINANCIAL_PAYMENT_STATUSES)[number];

export const ADMIN_FINANCIAL_PAYMENT_ATTEMPT_STATUSES = [
  'pending',
  'processing',
  'succeeded',
  'failed',
  'cancelled',
  'expired',
] as const;

export type AdminFinancialPaymentAttemptStatus =
  (typeof ADMIN_FINANCIAL_PAYMENT_ATTEMPT_STATUSES)[number];

/**
 * Operations exposed by the supplied financial-payments controller.
 */
export const ADMIN_FINANCIAL_PAYMENT_OPERATIONS = [
  'process',
  'succeed',
  'fail',
  'cancel',
  'expire',
  'create-transaction',
] as const;

export type AdminFinancialPaymentOperation =
  (typeof ADMIN_FINANCIAL_PAYMENT_OPERATIONS)[number];

/**
 * Payment reference types are backend-defined.
 * Keep this open-ended until the backend publishes a fixed enum.
 */
export type AdminFinancialPaymentReferenceType = string;

/**
 * Providers may be added without requiring a frontend model change.
 */
export type AdminFinancialPaymentProvider = string;

export type AdminFinancialPaymentSortDirection = 'asc' | 'desc';

export type AdminFinancialPaymentSortField =
  | 'createdAt'
  | 'updatedAt'
  | 'initiatedAt'
  | 'completedAt'
  | 'amount'
  | 'status';