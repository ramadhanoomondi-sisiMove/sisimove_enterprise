// -----------------------------------------------------------------------------
// Admin Commission Rule — Enums
// -----------------------------------------------------------------------------

/**
 * Lifecycle states supported by the backend for commission rules.
 */
export const ADMIN_COMMISSION_RULE_STATUSES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type AdminCommissionRuleStatus =
  (typeof ADMIN_COMMISSION_RULE_STATUSES)[keyof typeof ADMIN_COMMISSION_RULE_STATUSES];