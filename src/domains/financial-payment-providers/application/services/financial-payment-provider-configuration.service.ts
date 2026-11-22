// src/domains/financial-payment-providers/application/services/financial-payment-provider-configuration.services.ts

import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../financial-payment-providers.tokens';

import type { FinancialPaymentProviderConfigurationPort } from '../ports/financial-payment-provider-configuration.port';

import type { EncryptionService } from '../../../../foundation/security/encryption.interface';

import { FinancialPaymentProviderEnvironment } from '../../domain/value-objects/financial-payment-provider-environment.vo';

// =============================================================================
// Types
// =============================================================================

/**
 * Decrypted provider configuration.
 *
 * Configuration is intentionally represented as a generic string map.
 *
 * The configuration service is responsible for secure persistence, not
 * interpreting provider-specific credentials or executing provider operations.
 *
 * Examples of Daraja configuration keys include:
 *
 * - consumerKey
 * - consumerSecret
 * - stkBusinessShortCode
 * - stkPasskey
 * - c2bShortCode
 * - c2bBusinessType
 * - b2cPartyA
 * - b2cInitiatorName
 * - b2cSecurityCredential
 *
 * Provider-specific application services own the interpretation of these keys.
 */
export type FinancialPaymentProviderConfigurationPayload = Record<
  string,
  string
>;

// =============================================================================
// Secure Configuration Service
// =============================================================================
//
// Responsibilities:
//
// - Validate provider configuration payloads.
// - Retrieve existing configuration for the provider/environment.
// - Merge partial configuration updates with existing configuration.
// - Encrypt the complete configuration payload before persistence.
// - Decrypt configuration only when an integration needs it.
// - Return the stable configuration reference supplied by the persistence port.
//
// Security boundaries:
//
// - Credentials are never persisted in plaintext.
// - The service does not log configuration values.
// - The service does not return encrypted payloads to administrative clients.
// - The service does not execute Safaricom/Daraja requests.
// - The service does not authorize withdrawals.
// - The service does not credit/debit customer balances.
// - The service does not post financial ledger entries.
//
// Important Daraja credential distinction:
//
// b2cSecurityCredential represents the RSA-encrypted initiator credential
// supplied by the administrator.
//
// It is already encrypted for Safaricom's B2C API and must remain unchanged
// inside the decrypted configuration payload.
//
// The encryption performed here is a separate application-level encryption
// protecting the complete configuration payload at rest.
//
// Therefore:
//
// 1. The administrator supplies the RSA-encrypted B2C credential.
// 2. This service includes it in the configuration payload.
// 3. This service encrypts the complete payload for secure persistence.
// 4. The B2C integration retrieves and decrypts the payload.
// 5. The integration sends b2cSecurityCredential as Daraja SecurityCredential.
//
// Do not RSA-encrypt b2cSecurityCredential again in this service.
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

  // ===========================================================================
  // Save Configuration
  // ===========================================================================

  /**
   * Saves provider configuration for a specific environment.
   *
   * Partial update semantics:
   *
   * Incoming configuration is merged with the existing configuration for
   * the same provider and environment.
   *
   * This prevents an administrator updating STK Push credentials from
   * unintentionally removing previously configured C2B or B2C credentials.
   *
   * Existing configuration keys not included in the incoming payload remain
   * unchanged.
   *
   * Replacing an existing key requires supplying its new value.
   *
   * Removing configuration keys is intentionally not supported by this
   * method. Removal should be implemented as an explicit application
   * operation with its own authorization and audit requirements.
   *
   * @returns Stable configuration reference.
   */
  public async saveConfiguration(
    providerId: string,
    environment: FinancialPaymentProviderEnvironment,
    configuration: FinancialPaymentProviderConfigurationPayload,
  ): Promise<string> {
    // -------------------------------------------------------------------------
    // Validate provider identity.
    // -------------------------------------------------------------------------

    const normalizedProviderId = this.normalizeProviderId(providerId);

    // -------------------------------------------------------------------------
    // Validate incoming configuration before reading or changing persistence.
    // -------------------------------------------------------------------------

    this.validateConfiguration(configuration);

    // -------------------------------------------------------------------------
    // Retrieve the existing configuration for this exact provider/environment.
    //
    // Never merge configurations across different providers or environments.
    // -------------------------------------------------------------------------

    const existingConfiguration = await this.getConfiguration(
      normalizedProviderId,
      environment,
    );

    // -------------------------------------------------------------------------
    // Merge configuration.
    //
    // Incoming values replace existing values for matching keys.
    // Existing keys not supplied by the caller are retained.
    // -------------------------------------------------------------------------

    const mergedConfiguration: FinancialPaymentProviderConfigurationPayload = {
      ...(existingConfiguration ?? {}),
      ...configuration,
    };

    // Validate the complete configuration before encryption.
    this.validateConfiguration(mergedConfiguration);

    // -------------------------------------------------------------------------
    // Encrypt the complete configuration payload.
    //
    // EncryptionService is responsible for the application-level encryption
    // contract. Provider credentials must never be stored as plaintext.
    // -------------------------------------------------------------------------

    const encryptedPayload = this.encryptionService.encrypt(
      JSON.stringify(mergedConfiguration),
    );

    if (
      typeof encryptedPayload !== 'string' ||
      encryptedPayload.trim().length === 0
    ) {
      throw new Error(
        'Provider configuration encryption produced an invalid payload.',
      );
    }

    // -------------------------------------------------------------------------
    // Persist through the application-owned configuration port.
    //
    // Environment remains a value object here. The infrastructure adapter
    // is responsible for mapping it to the database representation.
    // -------------------------------------------------------------------------

    return this.configurationPort.save({
      providerId: normalizedProviderId,
      environment,
      encryptedPayload,
    });
  }

  // ===========================================================================
  // Retrieve Configuration
  // ===========================================================================

  /**
   * Retrieves and decrypts provider configuration.
   *
   * Returns null when the provider has no saved configuration for the
   * requested environment.
   *
   * The returned payload is intended for trusted backend integration
   * services. It must never be returned directly by an administrative
   * controller or exposed to a frontend.
   */
  public async getConfiguration(
    providerId: string,
    environment: FinancialPaymentProviderEnvironment,
  ): Promise<FinancialPaymentProviderConfigurationPayload | null> {
    const normalizedProviderId = this.normalizeProviderId(providerId);

    // -------------------------------------------------------------------------
    // Retrieve encrypted configuration from the persistence boundary.
    // -------------------------------------------------------------------------

    const stored = await this.configurationPort.findByProviderAndEnvironment(
      normalizedProviderId,
      environment,
    );

    if (stored === null) {
      return null;
    }

    // -------------------------------------------------------------------------
    // Decrypt the stored configuration.
    //
    // Decryption failures are allowed to propagate. Silently treating an
    // unreadable configuration as missing could hide corruption or key
    // management problems.
    // -------------------------------------------------------------------------

    const plaintext = this.encryptionService.decrypt(stored.encryptedPayload);

    if (typeof plaintext !== 'string' || plaintext.trim().length === 0) {
      throw new Error(
        'Stored provider configuration could not be decrypted into a valid payload.',
      );
    }

    // -------------------------------------------------------------------------
    // Parse the decrypted JSON.
    // -------------------------------------------------------------------------

    let parsed: unknown;

    try {
      parsed = JSON.parse(plaintext);
    } catch {
      throw new Error('Stored provider configuration is not valid JSON.');
    }

    // -------------------------------------------------------------------------
    // Validate the decrypted configuration structure.
    // -------------------------------------------------------------------------

    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      throw new Error('Stored provider configuration has an invalid format.');
    }

    const configuration = parsed as Record<string, unknown>;

    this.validateConfiguration(configuration);

    // -------------------------------------------------------------------------
    // Return only the validated configuration payload.
    //
    // The encrypted payload and persistence metadata remain inside the
    // infrastructure/application boundary.
    // -------------------------------------------------------------------------

    return configuration as FinancialPaymentProviderConfigurationPayload;
  }

  // ===========================================================================
  // Provider ID Validation
  // ===========================================================================

  /**
   * Normalizes and validates provider identity.
   *
   * Provider IDs must not be empty or contain surrounding whitespace.
   */
  private normalizeProviderId(providerId: string): string {
    if (typeof providerId !== 'string') {
      throw new Error('Financial Payment Provider ID must be a string.');
    }

    const normalizedProviderId = providerId.trim();

    if (normalizedProviderId.length === 0) {
      throw new Error('Financial Payment Provider ID is required.');
    }

    return normalizedProviderId;
  }

  // ===========================================================================
  // Configuration Validation
  // ===========================================================================

  /**
   * Validates the generic provider configuration payload.
   *
   * Rules:
   *
   * - Configuration must be a non-null object.
   * - Arrays are not valid configuration payloads.
   * - At least one configuration entry must exist.
   * - Configuration keys must not be empty.
   * - Configuration values must be non-empty strings.
   *
   * Values are not automatically trimmed or modified.
   *
   * This is intentional because the configuration service must preserve
   * credential values exactly as supplied. Provider-specific validation
   * belongs in the relevant application service.
   */
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
      if (typeof key !== 'string' || key.trim().length === 0) {
        throw new Error('Provider configuration keys must not be empty.');
      }

      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(
          'Provider configuration values must be non-empty strings.',
        );
      }
    }
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default FinancialPaymentProviderConfigurationService;
