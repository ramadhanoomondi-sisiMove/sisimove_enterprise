// -----------------------------------------------------------------------------
// Financial Account — Create Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_ACCOUNT_TOKENS } from '../financial-account.tokens';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { CreateFinancialAccountCommand } from '../commands/create-financial-account.command';

import { FinancialAccountAggregate } from '../../domain/aggregates/financial-account.aggregate';

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

import { FinancialAccountAlreadyExistsException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class CreateFinancialAccountHandler implements CommandHandler<
  CreateFinancialAccountCommand,
  FinancialAccountAggregate
> {
  public constructor(
    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly repository: FinancialAccountRepository,
  ) {}

  public async execute(
    command: CreateFinancialAccountCommand,
  ): Promise<FinancialAccountAggregate> {
    // -------------------------------------------------------------------------
    // Application-level uniqueness check
    // -------------------------------------------------------------------------

    const alreadyExists = await this.repository.existsByOwnerPublicId(
      command.ownerPublicId,
    );

    if (alreadyExists) {
      throw new FinancialAccountAlreadyExistsException(
        command.ownerPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Domain creation
    // -------------------------------------------------------------------------
    //
    // The handler does NOT create:
    //
    // - FinancialAccountEntity
    // - FinancialAccountBalanceEntity
    // - FinancialAccountPublicId
    // - FinancialAccountBalancePublicId
    // - initial status
    // - initial balance
    //
    // The aggregate owns all of that.
    // -------------------------------------------------------------------------

    const aggregate = FinancialAccountAggregate.create(
      {
        ownerPublicId: command.ownerPublicId,
        type: command.type,
        currency: command.currency,
      },
      command.correlationId,
    );

    // -------------------------------------------------------------------------
    // Persist aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateFinancialAccountHandler;
