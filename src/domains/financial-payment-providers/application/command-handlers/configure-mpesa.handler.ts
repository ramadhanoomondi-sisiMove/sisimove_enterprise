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
// Configures the Daraja connection for SisiMove's two M-PESA purposes:
//
// - TOP-UP: STK Push and C2B customer payments.
// - WITHDRAWAL: B2C payout of a customer's available funds.
//
// This handler stores provider configuration only.
//
// FinancialModule remains responsible for:
// - Payment authorization and processing.
// - Withdrawal authorization and processing.
// - Customer account balance changes.
// - Ledger posting and reconciliation.
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

    const provider = await this.providerRepository.findByPublicId(
      command.providerPublicId,
    );

    if (provider === null) {
      throw new FinancialPaymentProviderException(
        'M-PESA payment provider was not found.',
      );
    }

    const mpesaCode = FinancialPaymentProviderCode.create('MPESA');

    if (!provider.code.equals(mpesaCode)) {
      throw new FinancialPaymentProviderException(
        'The selected payment provider is not M-PESA.',
      );
    }

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

    // Shared Daraja authentication and STK Push configuration.
    const darajaConfiguration: Record<string, string> = {
      consumerKey: command.consumerKey.trim(),
      consumerSecret: command.consumerSecret.trim(),
      shortcode: command.shortcode.trim(),
      passkey: command.passkey.trim(),

      // Optional C2B top-up configuration.
      ...(command.c2b
        ? {
            c2bShortcode: command.c2b.shortcode.trim(),
            c2bBusinessType: command.c2b.businessType,
          }
        : {}),

      // Optional B2C available-funds withdrawal configuration.
      ...(command.b2c
        ? {
            b2cShortcode: command.b2c.shortcode.trim(),
            initiatorName: command.b2c.initiatorName.trim(),
            securityCredential: command.b2c.securityCredential.trim(),
          }
        : {}),
    };

    // saveConfiguration merges these values with existing configuration
    // for this provider and environment before encrypting and persisting.
    const reference = await this.configurationService.saveConfiguration(
      provider.id.toString(),
      command.environment,
      darajaConfiguration,
    );

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

    await this.providerRepository.save(provider);

    return reference;
  }

  private validateCommand(command: ConfigureMpesaCommand): void {
    const requiredFields: Array<[string, string]> = [
      ['Consumer Key', command.consumerKey],
      ['Consumer Secret', command.consumerSecret],
      ['STK Shortcode', command.shortcode],
      ['STK Passkey', command.passkey],
    ];

    for (const [label, value] of requiredFields) {
      if (typeof value !== 'string' || !value.trim()) {
        throw new FinancialPaymentProviderException(`${label} is required.`);
      }
    }

    if (command.c2b) {
      if (
        typeof command.c2b.shortcode !== 'string' ||
        !command.c2b.shortcode.trim()
      ) {
        throw new FinancialPaymentProviderException(
          'C2B shortcode is required when C2B is configured.',
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

    if (command.b2c) {
      if (
        typeof command.b2c.shortcode !== 'string' ||
        !command.b2c.shortcode.trim()
      ) {
        throw new FinancialPaymentProviderException(
          'B2C shortcode is required when B2C is configured.',
        );
      }

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

      if (
        typeof command.b2c.securityCredential !== 'string' ||
        !command.b2c.securityCredential.trim()
      ) {
        throw new FinancialPaymentProviderException(
          'B2C security credential is required when B2C is configured.',
        );
      }
    }
  }
}

export default ConfigureMpesaHandler;
