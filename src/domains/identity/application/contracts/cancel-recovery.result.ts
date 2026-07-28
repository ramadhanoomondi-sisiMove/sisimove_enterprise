// src/domains/identity/application/contracts/cancel-recovery.result.ts

export interface CancelRecoveryResult {
  /**
   * Public recovery identifier.
   */
  recoveryPublicId: string;

  /**
   * Internal Identity UUID.
   */
  identityId: string;

  /**
   * Indicates the recovery was successfully cancelled.
   */
  cancelled: true;

  /**
   * Timestamp when the recovery was cancelled.
   */
  cancelledAt: Date;
}
