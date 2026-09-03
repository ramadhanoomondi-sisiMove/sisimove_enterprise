// -----------------------------------------------------------------------------
// Foundation — Security — Encryption Service
// -----------------------------------------------------------------------------
//
// Application/domain-facing abstraction for authenticated encryption.
//
// Infrastructure implementations may use AES-GCM, another authenticated
// encryption algorithm, or an external key-management system.
//
// IMPORTANT:
//
// - callers must never depend on Node.js crypto directly;
// - plaintext encryption keys must never be persisted by the domain;
// - authenticated encryption must provide confidentiality + integrity;
// - implementations must fail closed when configuration is invalid.
// -----------------------------------------------------------------------------

export interface EncryptionService {
  /**
   * Encrypt plaintext into an authenticated ciphertext representation.
   */
  encrypt(plaintext: string): string;

  /**
   * Decrypt ciphertext and authenticate its integrity.
   *
   * Implementations MUST throw when authentication fails.
   */
  decrypt(ciphertext: string): string;
}
