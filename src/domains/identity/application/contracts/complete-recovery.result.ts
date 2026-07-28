// src/domains/identity/application/contracts/complete-recovery.result.ts

/**
 * Result returned after successfully completing a recovery request.
 */
export interface CompleteRecoveryResult {
  /**
   * Public recovery identifier.
   */
  recoveryPublicId: string;

  /**
   * Identity that completed the recovery.
   */
  identityId: string;

  /**
   * Whether the recovery completed successfully.
   */
  completed: true;

  /**
   * Timestamp when the recovery was completed.
   */
  completedAt: Date;
}
