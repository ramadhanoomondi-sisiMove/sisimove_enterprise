import type { AdminAccountHoldStatus } from './admin-account-hold.enums';

export interface AdminAccountHold {
  publicId: string;
  accountPublicId: string;

  amount: number;
  currency: string;

  status: AdminAccountHoldStatus;

  isActive: boolean;
  isReleased: boolean;
  isCaptured: boolean;
  isCancelled: boolean;
  isTerminal: boolean;

  referenceType?: string;
  referencePublicId?: string;

  expiresAt?: string | Date;
  hasExpiry: boolean;
  isExpired: boolean;
  isCurrentlyActive: boolean;

  holdTransactionPublicId?: string;
  releaseTransactionPublicId?: string;
  captureTransactionPublicId?: string;

  releasedAt?: string | Date;
  capturedAt?: string | Date;
  cancelledAt?: string | Date;

  createdAt: string | Date;
  updatedAt: string | Date;
}