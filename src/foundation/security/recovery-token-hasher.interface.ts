// -----------------------------------------------------------------------------
// Foundation — Security — Recovery Token Hasher
// -----------------------------------------------------------------------------
//
// Hashes recovery tokens before persistence.
//
// Recovery tokens are bearer credentials and therefore plaintext tokens
// must never be stored in the database.
// -----------------------------------------------------------------------------

export interface RecoveryTokenHasher {
  /**
   * Produce a deterministic cryptographic digest suitable for persistence.
   */
  hash(token: string): string;

  /**
   * Safely compare a raw token against a persisted digest.
   */
  compare(token: string, tokenHash: string): boolean;
}
