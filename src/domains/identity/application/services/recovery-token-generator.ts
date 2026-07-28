export interface GeneratedRecoveryToken {
  /**
   * Plaintext token sent to the user.
   */
  token: string;

  /**
   * SHA-256 (or equivalent) hash stored in the database.
   */
  hash: string;
}

export interface RecoveryTokenGenerator {
  generate(): Promise<GeneratedRecoveryToken>;
}
