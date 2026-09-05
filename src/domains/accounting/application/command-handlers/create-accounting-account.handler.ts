// -----------------------------------------------------------------------------
// Accounting — Create Accounting Account Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { ACCOUNTING_TOKENS } from '../accounting.tokens';

import type { CreateAccountingAccountCommand } from '../commands/create-accounting-account.command';

import { AccountingAccountAggregate } from '../../domain/aggregates/accounting-account.aggregate';

import { AccountingAccountEntity } from '../../domain/entities/accounting-account.entity';

import type { AccountingAccountRepository } from '../../domain/repositories/accounting-account.repository';

import { AccountingAccountAlreadyExistsException } from '../../domain/exceptions/accounting-account-already-exists.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CreateAccountingAccountHandler implements CommandHandler<
  CreateAccountingAccountCommand,
  AccountingAccountAggregate
> {
  public constructor(
    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_ACCOUNT)
    private readonly accountingAccountRepository: AccountingAccountRepository,
  ) {}

  public async execute(
    command: CreateAccountingAccountCommand,
  ): Promise<AccountingAccountAggregate> {
    // -------------------------------------------------------------------------
    // Verify uniqueness
    // -------------------------------------------------------------------------

    const existingAccount = await this.accountingAccountRepository.findByCode(
      command.code,
    );

    if (existingAccount !== null) {
      throw new AccountingAccountAlreadyExistsException(
        `Accounting account with code ${command.code.value} already exists.`,
      );
    }

    // -------------------------------------------------------------------------
    // Create entity
    // -------------------------------------------------------------------------

    const account = AccountingAccountEntity.create(
      command.code,
      command.name,
      command.type,
      command.parentAccountId,
    );

    // -------------------------------------------------------------------------
    // Create aggregate
    // -------------------------------------------------------------------------

    const aggregate = AccountingAccountAggregate.create(account);

    // -------------------------------------------------------------------------
    // Record creation event
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persist aggregate
    // -------------------------------------------------------------------------

    await this.accountingAccountRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateAccountingAccountHandler;
