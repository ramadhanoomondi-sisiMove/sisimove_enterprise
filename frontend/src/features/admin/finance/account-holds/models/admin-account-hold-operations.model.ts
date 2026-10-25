import type { AdminAccountHoldOperation } from './admin-account-hold.enums';

export interface CreateAdminAccountHoldRequest {
  accountPublicId: string;
  amount: number;

  referenceType?: string;
  referencePublicId?: string;

  expiresAt?: string;

  correlationId?: string;
  causationId?: string;
}

export interface CaptureAdminAccountHoldRequest {
  captureTransactionPublicId: string;
  capturedAt?: string;

  correlationId?: string;
  causationId?: string;
}

export interface ReleaseAdminAccountHoldRequest {
  releaseTransactionPublicId: string;
  releasedAt?: string;

  correlationId?: string;
  causationId?: string;
}

export interface CancelAdminAccountHoldRequest {
  releaseTransactionPublicId: string;
  cancelledAt?: string;

  correlationId?: string;
  causationId?: string;
}

export interface AdminAccountHoldOperationContext {
  holdPublicId: string;
  operation: AdminAccountHoldOperation;
}

export interface AdminAccountHoldOperationResult {
  hold: import('./admin-account-hold.model').AdminAccountHold;
  message?: string;
}