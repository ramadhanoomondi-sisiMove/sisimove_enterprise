// -----------------------------------------------------------------------------
// Financial Payment Provider — Secure Configuration Service
// -----------------------------------------------------------------------------
//
// Application service responsible for:
// - encrypting configuration before persistence;
// - retrieving and decrypting stored configuration;
// - keeping plaintext credentials out of persistence and API responses.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../financial-payment-providers.tokens';

import type { FinancialPaymentProviderConfigurationPort } from '../ports/financial-payment-provider-configuration.port';

import type { EncryptionService } from '../../../../foundation/security/encryption.interface';

import { FinancialPaymentProviderEnvironment } from '../../domain/value-objects/financial-payment-provider-environment.vo';

// =============================================================================
// Types
// =============================================================================

export type FinancialPaymentProviderConfigurationPayload = Record<
  string,
  string
>;

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class FinancialPaymentProviderConfigurationService {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.CONFIGURATION_PORT)
    private readonly configurationPort: FinancialPaymentProviderConfigurationPort,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.ENCRYPTION_SERVICE)
    private readonly encryptionService: EncryptionService,
  ) {}

  // ===========================================================================
  // Save Configuration
  // ===========================================================================

  public async saveConfiguration(
    providerId: string,
    environment: FinancialPaymentProviderEnvironment,
    configuration: FinancialPaymentProviderConfigurationPayload,
  ): Promise<string> {
    if (!providerId.trim()) {
      throw new Error('Financial Payment Provider ID is required.');
    }

    this.validateConfiguration(configuration);

    const plaintext = JSON.stringify(configuration);

    const encryptedPayload = this.encryptionService.encrypt(plaintext);

    return this.configurationPort.save({
      providerId: providerId.trim(),
      environment,
      encryptedPayload,
    });
  }

  // ===========================================================================
  // Retrieve Configuration
  // ===========================================================================

  public async getConfiguration(
    providerId: string,
    environment: FinancialPaymentProviderEnvironment,
  ): Promise<FinancialPaymentProviderConfigurationPayload | null> {
    const stored = await this.configurationPort.findByProviderAndEnvironment(
      providerId,
      environment,
    );

    if (stored === null) {
      return null;
    }

    const plaintext = this.encryptionService.decrypt(stored.encryptedPayload);

    const parsed: unknown = JSON.parse(plaintext);

    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      throw new Error('Stored provider configuration has an invalid format.');
    }

    this.validateConfiguration(parsed as Record<string, string>);

    return parsed as FinancialPaymentProviderConfigurationPayload;
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  private validateConfiguration(
    configuration: FinancialPaymentProviderConfigurationPayload,
  ): void {
    if (
      configuration === null ||
      typeof configuration !== 'object' ||
      Array.isArray(configuration)
    ) {
      throw new Error('Provider configuration must be an object.');
    }

    const entries = Object.entries(configuration);

    if (entries.length === 0) {
      throw new Error('Provider configuration must not be empty.');
    }

    for (const [key, value] of entries) {
      if (!key.trim() || typeof value !== 'string' || !value.trim()) {
        throw new Error(
          'Provider configuration keys and values must not be empty.',
        );
      }
    }
  }
}

export default FinancialPaymentProviderConfigurationService;
