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
// Configures the shared Safaricom Daraja integration.
//
// Supported capabilities:
//
// - STK Push: customer payments into SisiMove.
// - C2B: customer payments into SisiMove through PayBill or Buy Goods.
// - B2C Disbursement: payments from SisiMove to beneficiaries.
//
// Shared authentication:
// - Consumer Key
// - Consumer Secret
//
// STK Push:
// - Business Shortcode
// - Passkey
//
// Optional C2B configuration:
// - C2B Business Shortcode
// - Business Type (PAYBILL or BUY_GOODS)
//
// Optional B2C configuration:
// - B2C Party A Shortcode
// - Initiator Name
// - Security Credential
//
// Important:
// - C2B and B2C configurations are optional.
// - Existing STK Push configuration remains unchanged.
// - C2B shortcode is independently configurable.
// - B2C shortcode remains separate from the STK shortcode.
// - C2B business type is explicitly persisted.
// - B2C credentials are saved only when supplied.
// - All plaintext credentials are encrypted before persistence.
// - Callback URLs are managed separately.
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

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(command: ConfigureMpesaCommand): Promise<string> {
    // -------------------------------------------------------------------------
    // 1. Retrieve M-PESA provider
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
    // 2. Verify provider identity
    // -------------------------------------------------------------------------

    const mpesaCode = FinancialPaymentProviderCode.create('MPESA');

    if (!provider.code.equals(mpesaCode)) {
      throw new FinancialPaymentProviderException(
        'The selected payment provider is not M-PESA.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Ensure provider can be configured
    // -------------------------------------------------------------------------

    if (provider.isEnabled) {
      throw new FinancialPaymentProviderException(
        'Disable M-PESA before changing its configuration.',
      );
    }

    const currentStatus = provider.status;

    if (currentStatus.isConfiguring() || currentStatus.isReady()) {
      throw new FinancialPaymentProviderException(
        `M-PESA cannot be configured while its status is ${currentStatus.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // 4. Build Daraja configuration
    // -------------------------------------------------------------------------
    //
    // Preserve the existing STK Push configuration.
    //
    // C2B and B2C configurations are added independently and only when supplied.
    // -------------------------------------------------------------------------

    const darajaConfiguration = {
      // Shared authentication.
      consumerKey: command.consumerKey,
      consumerSecret: command.consumerSecret,

      // Existing STK Push configuration.
      shortcode: command.shortcode,
      passkey: command.passkey,

      // Optional C2B customer payment configuration.
      ...(command.c2b
        ? {
            c2bShortcode: command.c2b.shortcode,
            c2bBusinessType: command.c2b.businessType,
          }
        : {}),

      // Optional B2C disbursement configuration.
      ...(command.b2c
        ? {
            b2cShortcode: command.b2c.shortcode,
            initiatorName: command.b2c.initiatorName,
            securityCredential: command.b2c.securityCredential,
          }
        : {}),
    };

    // -------------------------------------------------------------------------
    // 5. Save encrypted Daraja configuration
    // -------------------------------------------------------------------------

    const reference = await this.configurationService.saveConfiguration(
      provider.id.toString(),
      command.environment,
      darajaConfiguration,
    );

    // -------------------------------------------------------------------------
    // 6. Update provider environment
    // -------------------------------------------------------------------------

    provider.updateEnvironment(
      command.environment,
      command.createdAt,
      command.correlationId,
    );

    // -------------------------------------------------------------------------
    // 7. Update configuration reference
    // -------------------------------------------------------------------------

    provider.updateConfigurationReference(
      FinancialPaymentProviderConfigurationReference.create(reference),
      command.createdAt,
      command.correlationId,
    );

    // -------------------------------------------------------------------------
    // 8. Move provider into configuring state
    // -------------------------------------------------------------------------

    provider.changeStatus(
      FinancialPaymentProviderStatus.configuring(),
      command.createdAt,
      command.correlationId,
    );

    // -------------------------------------------------------------------------
    // 9. Persist provider
    // -------------------------------------------------------------------------

    await this.providerRepository.save(provider);

    return reference;
  }
}

export default ConfigureMpesaHandler;
