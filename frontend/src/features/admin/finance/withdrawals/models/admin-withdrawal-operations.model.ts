
/**
 * SisiMove Admin — Withdrawal Operations
 *
 * Request and lifecycle operation payloads.
 * Mirrors the supplied NestJS controller contract.
 */

// =============================================================================
// Shared Command Metadata
// =============================================================================

export interface AdminWithdrawalCommandMetadata {
  correlationId?: string;

  causationId?: string;
}

// =============================================================================
// Request Withdrawal
// =============================================================================

import type {
  AdminWithdrawalDestinationType,
} from './admin-withdrawal.enums';

export interface AdminWithdrawalRequest
  extends AdminWithdrawalCommandMetadata {
  accountId: string;

  amount: number;

  currency: string;

  destinationType: AdminWithdrawalDestinationType;

  destinationValue: string;

  referenceType?: string;

  referencePublicId?: string;
}

// =============================================================================
// Process Withdrawal
// =============================================================================

export type AdminWithdrawalProcessRequest =
  AdminWithdrawalCommandMetadata;

// =============================================================================
// Complete Withdrawal
// =============================================================================

export interface AdminWithdrawalCompleteRequest
  extends AdminWithdrawalCommandMetadata {
  completedAt: string;
}

// =============================================================================
// Fail Withdrawal
// =============================================================================

export interface AdminWithdrawalFailRequest
  extends AdminWithdrawalCommandMetadata {
  reason: string;

  failedAt: string;
}

// =============================================================================
// Cancel Withdrawal
// =============================================================================

export interface AdminWithdrawalCancelRequest
  extends AdminWithdrawalCommandMetadata {
  reason: string;

  cancelledAt: string;
}

// =============================================================================
// Operation Payload Map
// =============================================================================

export interface AdminWithdrawalOperationPayloads {
  REQUEST: AdminWithdrawalRequest;

  PROCESS: AdminWithdrawalProcessRequest;

  COMPLETE: AdminWithdrawalCompleteRequest;

  FAIL: AdminWithdrawalFailRequest;

  CANCEL: AdminWithdrawalCancelRequest;
}

// =============================================================================
// Operation Result
// =============================================================================

import type { AdminWithdrawal } from './admin-withdrawal.model';

export type AdminWithdrawalOperationResult = AdminWithdrawal;
