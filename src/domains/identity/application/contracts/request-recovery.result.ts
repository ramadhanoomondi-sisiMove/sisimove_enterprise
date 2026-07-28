// src/domains/identity/application/dto/request-recovery.result.ts

export interface RequestRecoveryResult {
  /**
   * Public recovery identifier.
   */
  recoveryPublicId: string;

  /**
   * Plaintext recovery token.
   *
   * This value is NEVER persisted and should only be
   * used immediately by the notification layer.
   */
  recoveryToken: string;

  /**
   * Token expiration.
   */
  expiresAt: Date;
}
