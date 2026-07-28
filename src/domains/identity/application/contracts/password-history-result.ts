// src/domains/identity/application/contracts/password-history-result.ts

export interface PasswordHistoryResult {
  /**
   * Internal password history identifier.
   */
  passwordHistoryId: string;

  /**
   * Authentication identifier.
   */
  authenticationId: string;

  /**
   * Password version.
   */
  version: number;

  /**
   * When this password became active.
   */
  createdAt: Date;
}
