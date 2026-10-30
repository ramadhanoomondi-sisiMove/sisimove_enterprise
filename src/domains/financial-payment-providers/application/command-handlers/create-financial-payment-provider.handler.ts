// -----------------------------------------------------------------------------
// Financial Payment Provider — Create Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../financial-payment-providers.tokens';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { CreateFinancialPaymentProviderCommand } from '../commands/create-financial-payment-provider.command';

import { FinancialPaymentProviderAggregate } from '../../domain/aggregates/financial-payment-provider.aggregate';
import type { FinancialPaymentProviderRepository } from '../../domain/repositories/financial-payment-provider.repository';
import { FinancialPaymentProviderException } from '../../domain/exceptions/financial-payment-provider.exception';

/**
 * Creates and persists a Financial Payment Provider aggregate.
 *
 * Business rules remain inside the aggregate. The handler checks whether
 * the provider code already exists before creating the aggregate.
 */
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
    const codeExists = await this.repository.existsByCode(command.code);

    if (codeExists) {
      throw new FinancialPaymentProviderException(
        `Financial Payment Provider code "${command.code.toString()}" already exists.`,
      );
    }

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
      },
      command.correlationId,
      command.createdAt,
    );

    await this.repository.create(aggregate);

    return aggregate;
  }
}

export default CreateFinancialPaymentProviderHandler;
