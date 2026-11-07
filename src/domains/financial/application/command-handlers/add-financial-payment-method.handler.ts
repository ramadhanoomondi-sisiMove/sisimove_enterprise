// -----------------------------------------------------------------------------
// Financial Payment Method — Add Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_METHOD_TOKENS } from '../financial-payment-method.tokens';
import { FINANCIAL_ACCOUNT_TOKENS } from '../../application/financial-account.tokens';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { AddFinancialPaymentMethodCommand } from '../commands/add-financial-payment-method.command';

import { FinancialPaymentMethodAggregate } from '../../domain/aggregates/financial-payment-method.aggregate';
import { FinancialPaymentMethodEntity } from '../../domain/entities/financial-payment-method.entity';

import { FinancialPaymentMethodException } from '../../domain/exceptions/financial-payment-method.exception';

import type { FinancialPaymentMethodRepository } from '../../domain/repositories/financial-payment-method.repository';
import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

@Injectable()
export class AddFinancialPaymentMethodHandler implements CommandHandler<
  AddFinancialPaymentMethodCommand,
  FinancialPaymentMethodAggregate
> {
  public constructor(
    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly financialAccountRepository: FinancialAccountRepository,

    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.REPOSITORY)
    private readonly financialPaymentMethodRepository: FinancialPaymentMethodRepository,
  ) {}

  public async execute(
    command: AddFinancialPaymentMethodCommand,
  ): Promise<FinancialPaymentMethodAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load owning Financial Account
    // -------------------------------------------------------------------------

    const account = await this.financialAccountRepository.findByPublicId(
      command.accountId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure Financial Account exists
    // -------------------------------------------------------------------------

    if (account === null) {
      throw new FinancialPaymentMethodException(
        `Financial Account "${command.accountId.value}" was not found`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Validate provider-reference uniqueness
    // -------------------------------------------------------------------------

    if (command.providerReference !== undefined) {
      const existing =
        await this.financialPaymentMethodRepository.findByProviderAndProviderReference(
          command.provider,
          command.providerReference,
        );

      if (existing !== null) {
        throw new FinancialPaymentMethodException(
          `Financial Payment Method with provider reference "${command.providerReference.value}" already exists`,
        );
      }
    }

    // -------------------------------------------------------------------------
    // 4. Coordinate account-level default invariant
    // -------------------------------------------------------------------------

    if (command.isDefault === true) {
      const existingDefault =
        await this.financialPaymentMethodRepository.findDefaultByAccountPublicId(
          command.accountId,
        );

      if (existingDefault !== null) {
        existingDefault.clearDefault();

        await this.financialPaymentMethodRepository.save(existingDefault);
      }
    }

    // -------------------------------------------------------------------------
    // 5. Create Financial Payment Method Entity
    // -------------------------------------------------------------------------

    const paymentMethod = FinancialPaymentMethodEntity.create(
      account.id,
      account.publicId,
      command.type,
      command.provider,
      command.providerReference,
      command.displayName,
      command.lastFour,
      command.isDefault ?? false,
      command.phoneNumber,
    );

    // -------------------------------------------------------------------------
    // 6. Create Financial Payment Method Aggregate
    // -------------------------------------------------------------------------

    const aggregate = FinancialPaymentMethodAggregate.create(paymentMethod);

    // -------------------------------------------------------------------------
    // 7. Record creation domain event
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 8. Persist new aggregate
    // -------------------------------------------------------------------------

    await this.financialPaymentMethodRepository.create(aggregate);

    // -------------------------------------------------------------------------
    // 9. Return created aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

export default AddFinancialPaymentMethodHandler;
