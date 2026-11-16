/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 Configuration
 * -----------------------------------------------------------------------------
 *
 * Defines the configuration contracts required by the Safaricom Daraja API.
 *
 * Responsibilities:
 * - Sandbox and production environment identification.
 * - OAuth 2.0 consumer credentials.
 * - STK Push configuration.
 * - C2B payment configuration.
 * - B2C business payment configuration.
 * - Daraja callback URL configuration.
 *
 * Architecture:
 * - This file defines configuration contracts only.
 * - Configuration loading and validation belong to the configuration layer.
 * - Environment-specific values must be supplied externally.
 * - Payment execution belongs to the respective M-PESA services.
 *
 * Security:
 * - Never hardcode credentials in this file.
 * - Retrieve credentials through the secure configuration layer.
 * - Never expose secrets through API responses or application logs.
 * - Sandbox and production credentials must remain separate.
 * - Never store plaintext B2C initiator passwords in application configuration.
 *
 * Dependencies:
 * - No NestJS dependencies.
 * - No HTTP client dependencies.
 * - No database dependencies.
 *
 * -----------------------------------------------------------------------------
 */

// =============================================================================
// Environment
// =============================================================================

/**
 * Supported Safaricom Daraja environments.
 */
export type MpesaEnvironment = 'sandbox' | 'production';

// =============================================================================
// Shared Types
// =============================================================================

/**
 * Public HTTPS callback endpoint.
 *
 * The actual URL must be validated by the configuration layer.
 */
export type MpesaCallbackUrl = string;

/**
 * Daraja business shortcode.
 */
export type MpesaShortcode = string;

/**
 * C2B URL registration response handling preference.
 */
export type MpesaC2BResponseType = 'Completed' | 'Cancelled';

// =============================================================================
// OAuth Credentials
// =============================================================================

/**
 * Safaricom Daraja application credentials.
 *
 * Used to obtain OAuth 2.0 access tokens.
 */
export interface MpesaCredentials {
  /**
   * Daraja consumer key.
   */
  readonly consumerKey: string;

  /**
   * Daraja consumer secret.
   */
  readonly consumerSecret: string;
}

// =============================================================================
// STK Push Configuration
// =============================================================================

/**
 * Lipa na M-PESA Online configuration.
 */
export interface MpesaStkPushConfiguration {
  /**
   * Daraja business shortcode.
   */
  readonly shortcode: MpesaShortcode;

  /**
   * Lipa na M-PESA Online passkey.
   *
   * Used when generating the STK Push password.
   */
  readonly passkey: string;

  /**
   * Public HTTPS endpoint receiving STK Push callbacks.
   */
  readonly callbackUrl: MpesaCallbackUrl;
}

// =============================================================================
// C2B Configuration
// =============================================================================

/**
 * Customer-to-Business payment configuration.
 */
export interface MpesaC2BConfiguration {
  /**
   * C2B-enabled business shortcode.
   */
  readonly shortcode: MpesaShortcode;

  /**
   * Public HTTPS endpoint receiving C2B validation requests.
   */
  readonly validationUrl: MpesaCallbackUrl;

  /**
   * Public HTTPS endpoint receiving C2B confirmation requests.
   */
  readonly confirmationUrl: MpesaCallbackUrl;

  /**
   * Safaricom callback response preference.
   *
   * Completed:
   * Accept transactions unless validation explicitly rejects them.
   *
   * Cancelled:
   * Cancel transactions that cannot be validated.
   */
  readonly responseType: MpesaC2BResponseType;
}

// =============================================================================
// B2C Configuration
// =============================================================================

/**
 * Business-to-Customer payment configuration.
 *
 * Used for SisiMove business payouts, including:
 * - Journey earnings.
 * - Commissions.
 * - Settlements.
 *
 * Employee salaries and promotional rewards are outside
 * the scope of this B2C integration.
 */
export interface MpesaB2CConfiguration {
  /**
   * B2C-enabled business shortcode.
   */
  readonly shortcode: MpesaShortcode;

  /**
   * Daraja B2C initiator name.
   */
  readonly initiatorName: string;

  /**
   * Encrypted Daraja security credential.
   *
   * Generated from the initiator password using the
   * appropriate Safaricom public certificate.
   *
   * Never store or expose the plaintext initiator password.
   */
  readonly securityCredential: string;

  /**
   * Public HTTPS endpoint receiving B2C transaction results.
   */
  readonly resultUrl: MpesaCallbackUrl;

  /**
   * Public HTTPS endpoint receiving B2C queue-timeout notifications.
   */
  readonly queueTimeoutUrl: MpesaCallbackUrl;
}

// =============================================================================
// Complete M-PESA Configuration
// =============================================================================

/**
 * Complete Safaricom Daraja configuration.
 *
 * The payment-flow configurations are optional because an application
 * may enable and configure individual payment capabilities independently.
 *
 * The configuration layer is responsible for validating the required
 * properties before a payment service is used.
 */
export interface MpesaConfiguration {
  /**
   * Selected Daraja environment.
   */
  readonly environment: MpesaEnvironment;

  /**
   * OAuth consumer credentials.
   */
  readonly credentials: MpesaCredentials;

  /**
   * STK Push configuration.
   */
  readonly stkPush?: MpesaStkPushConfiguration;

  /**
   * C2B configuration.
   */
  readonly c2b?: MpesaC2BConfiguration;

  /**
   * B2C configuration.
   */
  readonly b2c?: MpesaB2CConfiguration;
}
