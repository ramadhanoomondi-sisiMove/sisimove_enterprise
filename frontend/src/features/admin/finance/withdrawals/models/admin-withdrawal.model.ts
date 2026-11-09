
/**
 * SisiMove Admin — Financial Account Withdrawal Model
 *
 * Mirrors FinancialAccountWithdrawalResponse from the backend.
 */

import type {
  AdminWithdrawalDestinationType,
  AdminWithdrawalStatus,
} from './admin-withdrawal.enums';

// =============================================================================
// Core Response
// =============================================================================

export interface AdminWithdrawal {
  // Identity
  publicId: string;

  // Owning account
  accountPublicId: string;

  // Withdrawal amount
  amount: number;
  currency: string;

  // Immutable destination snapshot
  destinationType: AdminWithdrawalDestinationType;
  destinationValue: string;

  // Optional business reference
  referenceType?: string;
  referencePublicId?: string;

  // Associated disbursement
  disbursementPublicId?: string;

  // Lifecycle
  status: AdminWithdrawalStatus;

  // Lifecycle timestamps
  requestedAt: string;
  completedAt?: string;
  failedAt?: string;
  cancelledAt?: string;

  // Audit
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Collection Types
// =============================================================================

export type AdminWithdrawalCollection =
  readonly AdminWithdrawal[];

export type AdminWithdrawalId = AdminWithdrawal['publicId'];

// =============================================================================
// Type Guards
// =============================================================================

export function isAdminWithdrawal(
  value: unknown,
): value is AdminWithdrawal {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const withdrawal = value as Record<string, unknown>;

  return (
    typeof withdrawal.publicId === 'string' &&
    typeof withdrawal.accountPublicId === 'string' &&
    typeof withdrawal.amount === 'number' &&
    Number.isFinite(withdrawal.amount) &&
    typeof withdrawal.currency === 'string' &&
    typeof withdrawal.destinationType === 'string' &&
    typeof withdrawal.destinationValue === 'string' &&
    typeof withdrawal.status === 'string' &&
    typeof withdrawal.requestedAt === 'string' &&
    typeof withdrawal.createdAt === 'string' &&
    typeof withdrawal.updatedAt === 'string'
  );
}
