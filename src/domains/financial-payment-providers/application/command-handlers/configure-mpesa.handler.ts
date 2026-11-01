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

    const reference = await this.configurationService.saveConfiguration(
      provider.id.toString(),
      command.environment,
      {
        consumerKey: command.consumerKey,
        consumerSecret: command.consumerSecret,
        shortcode: command.shortcode,
        passkey: command.passkey,
      },
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
}

export default ConfigureMpesaHandler;
