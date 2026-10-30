// -----------------------------------------------------------------------------
// Financial Payment Provider — Disable Capability Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../financial-payment-providers.tokens';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { DisableFinancialPaymentProviderCapabilityCommand } from '../commands/disable-financial-payment-provider-capability.command';

import { FinancialPaymentProviderAggregate } from '../../domain/aggregates/financial-payment-provider.aggregate';
import type { FinancialPaymentProviderRepository } from '../../domain/repositories/financial-payment-provider.repository';
import { FinancialPaymentProviderException } from '../../domain/exceptions/financial-payment-provider.exception';

@Injectable()
export class DisableFinancialPaymentProviderCapabilityHandler implements CommandHandler<
  DisableFinancialPaymentProviderCapabilityCommand,
  FinancialPaymentProviderAggregate
> {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly repository: FinancialPaymentProviderRepository,
  ) {}

  public async execute(
    command: DisableFinancialPaymentProviderCapabilityCommand,
  ): Promise<FinancialPaymentProviderAggregate> {
    const aggregate = await this.repository.findByPublicId(
      command.providerPublicId,
    );

    if (aggregate === null) {
      throw new FinancialPaymentProviderException(
        `Financial Payment Provider "${command.providerPublicId.value}" was not found.`,
      );
    }

    aggregate.disableCapability(
      command.capabilityType,
      command.disabledAt,
      command.correlationId,
      command.reason,
    );

    await this.repository.save(aggregate);

    return aggregate;
  }
}

export default DisableFinancialPaymentProviderCapabilityHandler;
