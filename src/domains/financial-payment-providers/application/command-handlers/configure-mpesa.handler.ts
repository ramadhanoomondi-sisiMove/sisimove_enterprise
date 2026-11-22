import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../financial-payment-providers.tokens';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { ConfigureMpesaCommand } from '../commands/configure-mpesa.command';
import type { FinancialPaymentProviderRepository } from '../../domain/repositories/financial-payment-provider.repository';

import { FinancialPaymentProviderCode } from '../../domain/value-objects/financial-payment-provider-code.vo';
import { FinancialPaymentProviderConfigurationReference } from '../../domain/value-objects/financial-payment-provider-configuration-reference.vo';
import { FinancialPaymentProviderStatus } from '../../domain/value-objects/financial-payment-provider-status.vo';

import { FinancialPaymentProviderConfigurationService } from '../services/financial-payment-provider-configuration.service';
import { FinancialPaymentProviderException } from '../../domain/exceptions/financial-payment-provider.exception';

// =============================================================================
// Configure M-PESA Handler
// =============================================================================
//
// Configures SisiMove's Safaricom Daraja integration.
//
// Supported payment purposes:
//
// - STK PUSH:
//   Customer-initiated M-PESA payment into SisiMove.
//
// - C2B:
//   Customer manually pays SisiMove through the M-PESA menu.
//
// - B2C:
//   SisiMove initiates a payout to a customer's M-PESA phone number.
//
// This handler is responsible ONLY for provider configuration.
//
// FinancialModule remains responsible for:
//
// - Payment authorization and processing.
// - Withdrawal authorization and processing.
// - Customer account balance changes.
// - Ledger posting and reconciliation.
// - Payment and withdrawal lifecycle management.
//
// Configuration values are stored through the dedicated
// FinancialPaymentProviderConfigurationService.
//
// Sensitive values are encrypted at rest by that service.
//
// Environment is maintained separately as part of the
// provider configuration record identity.
//
// IMPORTANT B2C SECURITY CONTRACT:
//
// command.b2c.securityCredential represents the RSA-encrypted
// Safaricom B2C initiator credential.
//
// It is NOT the ordinary plaintext initiator password.
//
// It is NOT the STK Push Passkey.
//
// It must be stored under b2cSecurityCredential.
//
// The configuration service subsequently applies application-level
// encryption to the complete configuration payload.
//
// The B2C integration must not RSA-encrypt this credential again.
//
// =============================================================================

@Injectable()
export class ConfigureMpesaHandler implements CommandHandler<
  ConfigureMpesaCommand,
  string
> {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly configurationService: FinancialPaymentProviderConfigurationService,
  ) {}

  public async execute(command: ConfigureMpesaCommand): Promise<string> {
    this.validateCommand(command);

    // -------------------------------------------------------------------------
    // 1. Resolve the payment provider.
    // -------------------------------------------------------------------------

    const provider = await this.providerRepository.findByPublicId(
      command.providerPublicId,
    );

    if (provider === null) {
      throw new FinancialPaymentProviderException(
        'M-PESA payment provider was not found.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Ensure the selected provider is M-PESA.
    // -------------------------------------------------------------------------

    const mpesaCode = FinancialPaymentProviderCode.create('MPESA');

    if (!provider.code.equals(mpesaCode)) {
      throw new FinancialPaymentProviderException(
        'The selected payment provider is not M-PESA.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Prevent configuration changes while the provider is enabled.
    // -------------------------------------------------------------------------

    if (provider.isEnabled) {
      throw new FinancialPaymentProviderException(
        'Disable M-PESA before changing its configuration.',
      );
    }

    // -------------------------------------------------------------------------
    // 4. Validate the provider lifecycle state.
    // -------------------------------------------------------------------------

    const currentStatus = provider.status;

    if (currentStatus.isConfiguring() || currentStatus.isReady()) {
      throw new FinancialPaymentProviderException(
        `M-PESA cannot be configured while its status is ${currentStatus.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // 5. Build the Daraja configuration.
    //
    // STK PUSH:
    //   stkBusinessShortCode
    //   stkPasskey
    //
    // C2B:
    //   c2bShortCode
    //   c2bBusinessType
    //
    // B2C:
    //   b2cPartyA
    //   b2cInitiatorName
    //   b2cSecurityCredential
    //
    // Environment is supplied separately to saveConfiguration().
    // -------------------------------------------------------------------------

    const darajaConfiguration: Record<string, string> = {
      // Shared Daraja authentication.
      consumerKey: command.consumerKey.trim(),
      consumerSecret: command.consumerSecret.trim(),

      // STK Push configuration.
      stkBusinessShortCode: command.shortcode.trim(),
      stkPasskey: command.passkey.trim(),
    };

    // -------------------------------------------------------------------------
    // 6. Add optional C2B configuration.
    // -------------------------------------------------------------------------

    if (command.c2b !== undefined) {
      darajaConfiguration.c2bShortCode = command.c2b.shortcode.trim();

      darajaConfiguration.c2bBusinessType = command.c2b.businessType;
    }

    // -------------------------------------------------------------------------
    // 7. Add optional B2C configuration.
    //
    // SECURITY:
    //
    // securityCredential is already RSA-encrypted using the appropriate
    // Safaricom environment certificate.
    //
    // Store it directly under b2cSecurityCredential.
    //
    // Do not:
    // - Store it as b2cInitiatorPassword.
    // - Treat it as a plaintext password.
    // - RSA-encrypt it again.
    // - Substitute the STK Passkey.
    //
    // The configuration service applies separate application-level
    // encryption to the complete configuration payload.
    // -------------------------------------------------------------------------

    if (command.b2c !== undefined) {
      darajaConfiguration.b2cPartyA = command.b2c.shortcode.trim();

      darajaConfiguration.b2cInitiatorName = command.b2c.initiatorName.trim();

      darajaConfiguration.b2cSecurityCredential =
        command.b2c.securityCredential.trim();
    }

    // -------------------------------------------------------------------------
    // 8. Persist the configuration.
    //
    // The configuration service:
    //
    // - Retrieves existing configuration for this provider/environment.
    // - Merges the supplied configuration.
    // - Preserves optional settings not supplied in this update.
    // - Encrypts the complete configuration payload.
    // - Persists the encrypted payload.
    // - Returns the configuration reference.
    // -------------------------------------------------------------------------

    const reference = await this.configurationService.saveConfiguration(
      provider.id.toString(),
      command.environment,
      darajaConfiguration,
    );

    // -------------------------------------------------------------------------
    // 9. Update the provider aggregate.
    // -------------------------------------------------------------------------

    provider.updateEnvironment(
      command.environment,
      command.createdAt,
      command.correlationId,
    );

    provider.updateConfigurationReference(
      FinancialPaymentProviderConfigurationReference.create(reference),
      command.createdAt,
      command.correlationId,
    );

    provider.changeStatus(
      FinancialPaymentProviderStatus.configuring(),
      command.createdAt,
      command.correlationId,
    );

    // -------------------------------------------------------------------------
    // 10. Persist the aggregate.
    // -------------------------------------------------------------------------

    await this.providerRepository.save(provider);

    return reference;
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  private validateCommand(command: ConfigureMpesaCommand): void {
    // -------------------------------------------------------------------------
    // Required shared credentials and STK Push configuration.
    // -------------------------------------------------------------------------

    const requiredFields: Array<[string, string]> = [
      ['Consumer Key', command.consumerKey],
      ['Consumer Secret', command.consumerSecret],
      ['STK Business Shortcode', command.shortcode],
      ['STK Passkey', command.passkey],
    ];

    for (const [label, value] of requiredFields) {
      if (typeof value !== 'string' || !value.trim()) {
        throw new FinancialPaymentProviderException(`${label} is required.`);
      }
    }

    // -------------------------------------------------------------------------
    // C2B validation.
    // -------------------------------------------------------------------------

    if (command.c2b !== undefined) {
      if (
        typeof command.c2b.shortcode !== 'string' ||
        !command.c2b.shortcode.trim()
      ) {
        throw new FinancialPaymentProviderException(
          'C2B shortcode is required when C2B is configured.',
        );
      }

      if (command.c2b.shortcode.trim().length > 20) {
        throw new FinancialPaymentProviderException(
          'C2B shortcode must not exceed 20 characters.',
        );
      }

      if (
        command.c2b.businessType !== 'PAYBILL' &&
        command.c2b.businessType !== 'BUY_GOODS'
      ) {
        throw new FinancialPaymentProviderException(
          'C2B business type must be PAYBILL or BUY_GOODS.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // B2C validation.
    // -------------------------------------------------------------------------

    if (command.b2c !== undefined) {
      // B2C Party A shortcode.
      if (
        typeof command.b2c.shortcode !== 'string' ||
        !command.b2c.shortcode.trim()
      ) {
        throw new FinancialPaymentProviderException(
          'B2C Party A shortcode is required when B2C is configured.',
        );
      }

      if (command.b2c.shortcode.trim().length > 20) {
        throw new FinancialPaymentProviderException(
          'B2C Party A shortcode must not exceed 20 characters.',
        );
      }

      // B2C initiator name.
      if (
        typeof command.b2c.initiatorName !== 'string' ||
        !command.b2c.initiatorName.trim()
      ) {
        throw new FinancialPaymentProviderException(
          'B2C initiator name is required when B2C is configured.',
        );
      }

      if (command.b2c.initiatorName.trim().length > 100) {
        throw new FinancialPaymentProviderException(
          'B2C initiator name must not exceed 100 characters.',
        );
      }

      // RSA-encrypted B2C SecurityCredential.
      if (
        typeof command.b2c.securityCredential !== 'string' ||
        !command.b2c.securityCredential.trim()
      ) {
        throw new FinancialPaymentProviderException(
          'RSA-encrypted B2C security credential is required when B2C is configured.',
        );
      }

      if (command.b2c.securityCredential.trim().length > 4096) {
        throw new FinancialPaymentProviderException(
          'B2C security credential must not exceed 4096 characters.',
        );
      }
    }
  }
}

export default ConfigureMpesaHandler;
