// src/domains/identity/application/contracts/change-password.result.ts

export interface ChangePasswordResult {
  /**
   * Public Authentication identifier.
   */
  authenticationPublicId: string;

  /**
   * Current password version after the change.
   */
  passwordVersion: number;

  /**
   * Password change timestamp.
   */
  changedAt: Date;

  /**
   * Password expiration timestamp.
   */
  expiresAt: Date | null;
}
