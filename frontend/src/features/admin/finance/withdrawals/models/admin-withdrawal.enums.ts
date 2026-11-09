
/**
 * SisiMove Admin — Financial Account Withdrawal Enums
 *
 * Frontend-owned representations of backend enum values.
 * No backend or Prisma dependencies.
 */

export const ADMIN_WITHDRAWAL_STATUSES = [
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
] as const;

export type AdminWithdrawalStatus =
  (typeof ADMIN_WITHDRAWAL_STATUSES)[number];

export const ADMIN_WITHDRAWAL_DESTINATION_TYPES = [
  'MOBILE_MONEY',
  'BANK_ACCOUNT',
  'OTHER',
] as const;

export type AdminWithdrawalDestinationType =
  (typeof ADMIN_WITHDRAWAL_DESTINATION_TYPES)[number];

/**
 * Terminal withdrawal states cannot undergo further lifecycle transitions.
 */
export const ADMIN_WITHDRAWAL_TERMINAL_STATUSES = [
  'COMPLETED',
  'FAILED',
  'CANCELLED',
] as const satisfies readonly AdminWithdrawalStatus[];

/**
 * Lifecycle actions supported by the backend controller.
 */
export const ADMIN_WITHDRAWAL_ACTIONS = [
  'PROCESS',
  'COMPLETE',
  'FAIL',
  'CANCEL',
] as const;

export type AdminWithdrawalAction =
  (typeof ADMIN_WITHDRAWAL_ACTIONS)[number];

/**
 * Status transition configuration.
 *
 * This represents the lifecycle documented by the backend controller.
 */
export const ADMIN_WITHDRAWAL_TRANSITIONS = {
  PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['COMPLETED', 'FAILED', 'CANCELLED'],
  COMPLETED: [],
  FAILED: [],
  CANCELLED: [],
} as const satisfies Record<
  AdminWithdrawalStatus,
  readonly AdminWithdrawalStatus[]
>;

/**
 * Derives the actions available for a withdrawal status.
 */
export function getAdminWithdrawalActions(
  status: AdminWithdrawalStatus,
): AdminWithdrawalAction[] {
  switch (status) {
    case 'PENDING':
      return ['PROCESS', 'CANCEL'];

    case 'PROCESSING':
      return ['COMPLETE', 'FAIL', 'CANCEL'];

    case 'COMPLETED':
    case 'FAILED':
    case 'CANCELLED':
      return [];

    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}

/**
 * Type guard for withdrawal status values received from REST responses.
 */
export function isAdminWithdrawalStatus(
  value: unknown,
): value is AdminWithdrawalStatus {
  return (
    typeof value === 'string' &&
    ADMIN_WITHDRAWAL_STATUSES.some((status) => status === value)
  );
}

/**
 * Type guard for destination types received from REST responses.
 */
export function isAdminWithdrawalDestinationType(
  value: unknown,
): value is AdminWithdrawalDestinationType {
  return (
    typeof value === 'string' &&
    ADMIN_WITHDRAWAL_DESTINATION_TYPES.some(
      (type) => type === value,
    )
  );
}
