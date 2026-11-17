import type { FinancialPaymentProviderEnvironment } from '../../domain/value-objects/financial-payment-provider-environment.vo';

// =============================================================================
// Financial Payment Provider Configuration Port
// =============================================================================
//
// Application-layer contract for persisting encrypted provider configuration.
//
// Responsibilities:
// - Save encrypted configuration for a provider/environment.
// - Retrieve encrypted configuration by provider/environment.
// - Return a stable configuration reference.
//
// This port does not:
// - Depend on Prisma or ORM models.
// - Encrypt or decrypt credentials.
// - Execute Safaricom/Daraja API calls.
// - Authorize customer withdrawals.
// - Credit/debit customer balances or post ledger entries.
//
// =============================================================================

export interface FinancialPaymentProviderConfigurationData {
  providerId: string;
  environment: FinancialPaymentProviderEnvironment;
  encryptedPayload: string;
}

export interface StoredFinancialPaymentProviderConfiguration {
  reference: string;
  providerId: string;
  environment: FinancialPaymentProviderEnvironment;
  encryptedPayload: string;
}

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
   * Returns null when no configuration exists.
   */
  findByProviderAndEnvironment(
    providerId: string,
    environment: FinancialPaymentProviderEnvironment,
  ): Promise<StoredFinancialPaymentProviderConfiguration | null>;
}
