// -----------------------------------------------------------------------------
// Accounting — Update Accounting Account Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { ACCOUNTING_TOKENS } from '../accounting.tokens';

import type { UpdateAccountingAccountCommand } from '../commands/update-accounting-account.command';

import { AccountingAccountAggregate } from '../../domain/aggregates/accounting-account.aggregate';

import type { AccountingAccountRepository } from '../../domain/repositories/accounting-account.repository';

import { AccountingAccountNotFoundException } from '../../domain/exceptions/accounting-account-not-found.exception';

import { AccountingAccountAlreadyExistsException } from '../../domain/exceptions/accounting-account-already-exists.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class UpdateAccountingAccountHandler implements CommandHandler<
  UpdateAccountingAccountCommand,
  AccountingAccountAggregate
> {
  public constructor(
    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_ACCOUNT)
    private readonly accountingAccountRepository: AccountingAccountRepository,
  ) {}

  public async execute(
    command: UpdateAccountingAccountCommand,
  ): Promise<AccountingAccountAggregate> {
    // -------------------------------------------------------------------------
    // Load aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.accountingAccountRepository.findByPublicId(
      command.publicId,
    );

    if (aggregate === null) {
      throw new AccountingAccountNotFoundException(
        `Accounting account with public ID ${command.publicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Update code
    // -------------------------------------------------------------------------
    //
    // Code uniqueness remains an application/persistence concern.
    //
    // -------------------------------------------------------------------------

    if (command.code !== undefined) {
      if (!aggregate.code.equals(command.code)) {
        const existingAccount =
          await this.accountingAccountRepository.findByCode(command.code);

        if (
          existingAccount !== null &&
          !existingAccount.id.equals(aggregate.id)
        ) {
          throw new AccountingAccountAlreadyExistsException(
            `Accounting account with code ${command.code.value} already exists.`,
          );
        }

        aggregate.changeCode(command.code);
      }
    }

    // -------------------------------------------------------------------------
    // Update name
    // -------------------------------------------------------------------------

    if (command.name !== undefined) {
      aggregate.changeName(command.name);
    }

    // -------------------------------------------------------------------------
    // Update type
    // -------------------------------------------------------------------------

    if (command.type !== undefined) {
      aggregate.changeType(command.type);
    }

    // -------------------------------------------------------------------------
    // Update parent account
    // -------------------------------------------------------------------------

    if (command.parentAccountId !== undefined) {
      aggregate.assignParentAccount(command.parentAccountId);
    }

    // -------------------------------------------------------------------------
    // Persist aggregate
    // -------------------------------------------------------------------------

    await this.accountingAccountRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return updated aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default UpdateAccountingAccountHandler;
