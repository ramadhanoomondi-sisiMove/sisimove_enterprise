import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../financial-payment-providers.tokens';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { CreateFinancialPaymentProviderCommand } from '../commands/create-financial-payment-provider.command';

import { FinancialPaymentProviderAggregate } from '../../domain/aggregates/financial-payment-provider.aggregate';

import type { FinancialPaymentProviderRepository } from '../../domain/repositories/financial-payment-provider.repository';

import { FinancialPaymentProviderException } from '../../domain/exceptions/financial-payment-provider.exception';

@Injectable()
export class CreateFinancialPaymentProviderHandler implements CommandHandler<
  CreateFinancialPaymentProviderCommand,
  FinancialPaymentProviderAggregate
> {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly repository: FinancialPaymentProviderRepository,
  ) {}

  public async execute(
    command: CreateFinancialPaymentProviderCommand,
  ): Promise<FinancialPaymentProviderAggregate> {
    // -------------------------------------------------------------------------
    // Check for duplicate provider code
    // -------------------------------------------------------------------------

    const codeExists = await this.repository.existsByCode(command.code);

    if (codeExists) {
      throw new FinancialPaymentProviderException(
        `Financial Payment Provider code "${command.code.toString()}" already exists.`,
      );
    }

    // -------------------------------------------------------------------------
    // Map capabilities
    // -------------------------------------------------------------------------

    const capabilities = command.capabilities.map((capability) => ({
      type: capability.type,
      isSupported: capability.isSupported,
    }));

    // -------------------------------------------------------------------------
    // Create provider aggregate with capabilities
    // -------------------------------------------------------------------------

    const aggregate = FinancialPaymentProviderAggregate.create(
      {
        code: command.code,
        name: command.name,
        type: command.type,
        environment: command.environment,

        ...(command.description !== undefined && {
          description: command.description,
        }),

        ...(command.configurationReference !== undefined && {
          configurationReference: command.configurationReference,
        }),

        capabilities,
      },
      command.correlationId,
      command.createdAt,
    );

    // -------------------------------------------------------------------------
    // Persist complete aggregate
    // -------------------------------------------------------------------------

    await this.repository.create(aggregate);

    return aggregate;
  }
}

export default CreateFinancialPaymentProviderHandler;
