// -----------------------------------------------------------------------------
// Foundation — Security — Password Hasher
// -----------------------------------------------------------------------------

export interface PasswordHasher {
  /**
   * Hash a plaintext password.
   *
   * The plaintext password MUST NOT be persisted or logged.
   */
  hash(password: string): Promise<string>;

  /**
   * Compare a plaintext password against a persisted password hash.
   *
   * Implementations MUST perform the comparison safely.
   */
  compare(password: string, passwordHash: string): Promise<boolean>;
}
