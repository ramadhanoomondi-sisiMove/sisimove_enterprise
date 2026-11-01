// -----------------------------------------------------------------------------
// Financial Payment Provider Configuration Port
// -----------------------------------------------------------------------------
//
// Application contract for securely persisting and retrieving provider
// configuration.
//
// Responsibilities:
// - Save encrypted provider configuration.
// - Retrieve encrypted configuration by provider and environment.
// - Return configuration references without exposing plaintext credentials.
//
// This port does NOT:
// - Depend on Prisma or ORM models.
// - Encrypt or decrypt credentials.
// - Execute external provider APIs.
// -----------------------------------------------------------------------------

import type { FinancialPaymentProviderEnvironment } from '../../domain/value-objects/financial-payment-provider-environment.vo';

// =============================================================================
// Configuration Data
// =============================================================================

export interface FinancialPaymentProviderConfigurationData {
  providerId: string;
  environment: FinancialPaymentProviderEnvironment;
  encryptedPayload: string;
}

// =============================================================================
// Stored Configuration
// =============================================================================

export interface StoredFinancialPaymentProviderConfiguration {
  reference: string;
  providerId: string;
  environment: FinancialPaymentProviderEnvironment;
  encryptedPayload: string;
}

// =============================================================================
// Repository Port
// =============================================================================

export interface FinancialPaymentProviderConfigurationPort {
  /**
   * Saves or replaces the encrypted configuration for a provider
   * in the specified environment.
   *
   * Returns the stable configuration reference.
   */
  save(
    configuration: FinancialPaymentProviderConfigurationData,
  ): Promise<string>;

  /**
   * Retrieves encrypted configuration for a provider and environment.
   *
   * Returns null when no configuration exists.
   */
  findByProviderAndEnvironment(
    providerId: string,
    environment: FinancialPaymentProviderEnvironment,
  ): Promise<StoredFinancialPaymentProviderConfiguration | null>;
}
