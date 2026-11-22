import type { FinancialPaymentProviderEnvironment } from '../../domain/value-objects/financial-payment-provider-environment.vo';

// =============================================================================
// Financial Payment Provider Configuration Port
// =============================================================================
//
// Application-layer contract for securely persisting provider configuration.
//
// Responsibilities:
// - Save encrypted configuration for a provider/environment.
// - Retrieve encrypted configuration by provider/environment.
// - Return a stable configuration reference.
// - Preserve environment isolation between Sandbox and Production.
//
// Security boundaries:
// - The port persists application-encrypted configuration payloads.
// - Encryption and decryption belong to the application configuration service.
// - The port must never receive plaintext provider credentials.
// - The port must never interpret provider-specific configuration keys.
//
// Daraja B2C credential distinction:
//
// b2cSecurityCredential is the RSA-encrypted initiator credential
// generated using the appropriate Safaricom environment certificate.
//
// It is stored inside the application-encrypted configuration payload.
// The application configuration service handles application-level
// encryption and decryption.
//
// This port must not:
// - RSA-encrypt or decrypt Daraja credentials.
// - Interpret b2cSecurityCredential as a plaintext initiator password.
// - Execute Safaricom/Daraja API requests.
// - Authorize customer withdrawals.
// - Credit/debit customer balances.
// - Post financial ledger entries.
//
// FinancialModule retains responsibility for financial decisions.
// M-PESA integration services handle provider communication.
//
// =============================================================================

export interface FinancialPaymentProviderConfigurationData {
  providerId: string;
  environment: FinancialPaymentProviderEnvironment;

  /**
   * Complete application-encrypted configuration payload.
   *
   * Contains serialized provider configuration.
   * Individual credentials must never be persisted in plaintext.
   */
  encryptedPayload: string;
}

export interface StoredFinancialPaymentProviderConfiguration {
  /**
   * Stable configuration reference.
   */
  reference: string;

  providerId: string;

  environment: FinancialPaymentProviderEnvironment;

  /**
   * Application-encrypted configuration payload retrieved from storage.
   *
   * Decryption is performed by the application configuration service,
   * never by this persistence port.
   */
  encryptedPayload: string;
}

export interface FinancialPaymentProviderConfigurationPort {
  /**
   * Saves or replaces the encrypted configuration for a provider
   * in the specified environment.
   *
   * Configuration identity is determined by:
   * - providerId
   * - environment
   *
   * Saving one environment must never overwrite another environment.
   *
   * @returns Stable configuration reference.
   */
  save(
    configuration: FinancialPaymentProviderConfigurationData,
  ): Promise<string>;

  /**
   * Retrieves encrypted configuration for a specific provider
   * and environment.
   *
   * Returns null when no configuration exists.
   *
   * The returned payload remains application-encrypted.
   * The caller is responsible for passing it to the application
   * configuration service for decryption.
   */
  findByProviderAndEnvironment(
    providerId: string,
    environment: FinancialPaymentProviderEnvironment,
  ): Promise<StoredFinancialPaymentProviderConfiguration | null>;
}
