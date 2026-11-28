// -----------------------------------------------------------------------------
// Admin Commission — Enums
// -----------------------------------------------------------------------------

/**
 * Commercial commission categories supported by the backend.
 */
export const ADMIN_COMMISSION_TYPES = {
  BOOKING: 'BOOKING',
  EARNING: 'EARNING',
} as const;

export type AdminCommissionType =
  (typeof ADMIN_COMMISSION_TYPES)[keyof typeof ADMIN_COMMISSION_TYPES];

/**
 * Lifecycle states shared by booking and earning commissions.
 */
export const ADMIN_COMMISSION_STATUSES = {
  PENDING: 'PENDING',
  ASSESSED: 'ASSESSED',
  CANCELLED: 'CANCELLED',
} as const;

export type AdminCommissionStatus =
  (typeof ADMIN_COMMISSION_STATUSES)[keyof typeof ADMIN_COMMISSION_STATUSES];