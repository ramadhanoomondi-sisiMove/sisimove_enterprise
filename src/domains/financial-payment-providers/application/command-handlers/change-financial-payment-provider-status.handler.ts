// -----------------------------------------------------------------------------
// Financial Payment Provider — Change Status Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../financial-payment-providers.tokens';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { ChangeFinancialPaymentProviderStatusCommand } from '../commands/change-financial-payment-provider-status.command';

import { FinancialPaymentProviderAggregate } from '../../domain/aggregates/financial-payment-provider.aggregate';
import type { FinancialPaymentProviderRepository } from '../../domain/repositories/financial-payment-provider.repository';
import { FinancialPaymentProviderException } from '../../domain/exceptions/financial-payment-provider.exception';

@Injectable()
export class ChangeFinancialPaymentProviderStatusHandler implements CommandHandler<
  ChangeFinancialPaymentProviderStatusCommand,
  FinancialPaymentProviderAggregate
> {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly repository: FinancialPaymentProviderRepository,
  ) {}

  public async execute(
    command: ChangeFinancialPaymentProviderStatusCommand,
  ): Promise<FinancialPaymentProviderAggregate> {
    const aggregate = await this.repository.findByPublicId(
      command.providerPublicId,
    );

    if (aggregate === null) {
      throw new FinancialPaymentProviderException(
        `Financial Payment Provider "${command.providerPublicId.value}" was not found.`,
      );
    }

    aggregate.changeStatus(
      command.status,
      command.changedAt,
      command.correlationId,
    );

    await this.repository.save(aggregate);

    return aggregate;
  }
}

export default ChangeFinancialPaymentProviderStatusHandler;
