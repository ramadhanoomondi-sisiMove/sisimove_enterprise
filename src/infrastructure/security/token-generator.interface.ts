// src/infrastructure/security/token-generator.interface.ts

export interface TokenGenerator {
  /**
   * Generates a cryptographically secure random token.
   *
   * @param bytes Number of random bytes to generate.
   * @returns Plaintext token.
   */
  generate(bytes?: number): Promise<string>;
}
