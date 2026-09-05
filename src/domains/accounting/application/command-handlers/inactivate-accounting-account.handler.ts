// -----------------------------------------------------------------------------
// Accounting — Inactivate Accounting Account Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { ACCOUNTING_TOKENS } from '../accounting.tokens';

import type { InactivateAccountingAccountCommand } from '../commands/inactivate-accounting-account.command';

import { AccountingAccountAggregate } from '../../domain/aggregates/accounting-account.aggregate';

import type { AccountingAccountRepository } from '../../domain/repositories/accounting-account.repository';

import { AccountingAccountNotFoundException } from '../../domain/exceptions/accounting-account-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class InactivateAccountingAccountHandler implements CommandHandler<
  InactivateAccountingAccountCommand,
  AccountingAccountAggregate
> {
  public constructor(
    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_ACCOUNT)
    private readonly accountingAccountRepository: AccountingAccountRepository,
  ) {}

  public async execute(
    command: InactivateAccountingAccountCommand,
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
    // Inactivate aggregate
    // -------------------------------------------------------------------------

    aggregate.inactivate(command.correlationId, command.causationId);

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

export default InactivateAccountingAccountHandler;
