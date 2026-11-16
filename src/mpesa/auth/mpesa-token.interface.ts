/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 Token Interfaces
 * -----------------------------------------------------------------------------
 *
 * Defines the OAuth access-token structure used internally by the M-PESA
 * authentication service and the safe authentication result returned by
 * the Financial Payment Provider connection-test workflow.
 *
 * Responsibilities:
 * - Store the access token in memory.
 * - Track token expiration.
 * - Determine token validity through its expiration timestamp.
 * - Define a safe authentication result for API consumers.
 *
 * Security:
 * - Access tokens must never be logged.
 * - Access tokens must never be returned to API consumers.
 * - Tokens must not be persisted as plaintext.
 *
 * -----------------------------------------------------------------------------
 */

/**
 * Internal Daraja OAuth access token.
 *
 * This interface is for internal service-to-service use only.
 */
export interface MpesaToken {
  /**
   * Daraja OAuth access token.
   */
  readonly accessToken: string;

  /**
   * Token lifetime in seconds, as returned by Daraja.
   */
  readonly expiresIn: number;

  /**
   * Absolute expiration time.
   * Unix timestamp in milliseconds.
   */
  readonly expiresAt: number;
}

/**
 * Safe authentication result returned by the M-PESA connection-test
 * application workflow.
 *
 * Deliberately excludes the OAuth access token.
 */
export interface MpesaOAuthAuthenticationResult {
  /**
   * Indicates whether OAuth authentication succeeded.
   */
  readonly authenticated: boolean;

  /**
   * Absolute token expiration time.
   * Unix timestamp in milliseconds.
   */
  readonly expiresAt: number;
}
