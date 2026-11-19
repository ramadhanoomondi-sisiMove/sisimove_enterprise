//src/domains/financial-payment-providers/application/services/financial-payment-provider-configuration.services.ts
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
// Secure Configuration Service
// =============================================================================
//
// Encrypts provider credentials before persistence and decrypts them only when
// the integration needs them. Updates merge with the existing configuration
// for the same provider/environment so that configuring one Daraja capability
// does not accidentally erase another.
//
// This service does not execute Daraja requests and does not apply financial
// consequences to customer accounts.
//
// =============================================================================

@Injectable()
export class FinancialPaymentProviderConfigurationService {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.CONFIGURATION_PORT)
    private readonly configurationPort: FinancialPaymentProviderConfigurationPort,
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.ENCRYPTION_SERVICE)
    private readonly encryptionService: EncryptionService,
  ) {}

  public async saveConfiguration(
    providerId: string,
    environment: FinancialPaymentProviderEnvironment,
    configuration: FinancialPaymentProviderConfigurationPayload,
  ): Promise<string> {
    if (!providerId.trim()) {
      throw new Error('Financial Payment Provider ID is required.');
    }

    this.validateConfiguration(configuration);

    const normalizedProviderId = providerId.trim();

    const existingConfiguration = await this.getConfiguration(
      normalizedProviderId,
      environment,
    );

    const mergedConfiguration: FinancialPaymentProviderConfigurationPayload = {
      ...(existingConfiguration ?? {}),
      ...configuration,
    };

    this.validateConfiguration(mergedConfiguration);

    const encryptedPayload = this.encryptionService.encrypt(
      JSON.stringify(mergedConfiguration),
    );

    return this.configurationPort.save({
      providerId: normalizedProviderId,
      environment,
      encryptedPayload,
    });
  }

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
    let parsed: unknown;

    try {
      parsed = JSON.parse(plaintext);
    } catch {
      throw new Error('Stored provider configuration is not valid JSON.');
    }

    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      throw new Error('Stored provider configuration has an invalid format.');
    }

    const configuration = parsed as Record<string, unknown>;
    this.validateConfiguration(configuration);

    return configuration as FinancialPaymentProviderConfigurationPayload;
  }

  private validateConfiguration(configuration: Record<string, unknown>): void {
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
          'Provider configuration keys and values must not be empty strings.',
        );
      }
    }
  }
}

export default FinancialPaymentProviderConfigurationService;
