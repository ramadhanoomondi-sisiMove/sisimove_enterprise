import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_METHOD_TOKENS } from '../financial-payment-method.tokens';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { DeactivateFinancialPaymentMethodCommand } from '../commands/deactivate-financial-payment-method.command';

import { FinancialPaymentMethodAggregate } from '../../domain/aggregates/financial-payment-method.aggregate';

import type { FinancialPaymentMethodRepository } from '../../domain/repositories/financial-payment-method.repository';

import { FinancialPaymentMethodException } from '../../domain/exceptions/financial-payment-method.exception';

@Injectable()
export class DeactivateFinancialPaymentMethodHandler implements CommandHandler<
  DeactivateFinancialPaymentMethodCommand,
  FinancialPaymentMethodAggregate
> {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.REPOSITORY)
    private readonly repository: FinancialPaymentMethodRepository,
  ) {}

  public async execute(
    command: DeactivateFinancialPaymentMethodCommand,
  ): Promise<FinancialPaymentMethodAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load requested payment method
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.paymentMethodPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure payment method exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialPaymentMethodException(
        `Financial Payment Method "${command.paymentMethodPublicId.value}" was not found`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Verify authenticated account ownership
    // -------------------------------------------------------------------------

    if (aggregate.accountId.value !== command.accountPublicId.value) {
      throw new FinancialPaymentMethodException(
        'You are not authorized to deactivate this Financial Payment Method.',
      );
    }

    // -------------------------------------------------------------------------
    // 4. Deactivate through aggregate behaviour
    // -------------------------------------------------------------------------

    aggregate.deactivate(
      command.deactivatedAt ?? new Date(),
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 5. Persist updated aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // 6. Return updated aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

export default DeactivateFinancialPaymentMethodHandler;
