// -----------------------------------------------------------------------------
// Accounting — Close Accounting Period Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { ACCOUNTING_TOKENS } from '../accounting.tokens';

import type { CloseAccountingPeriodCommand } from '../commands/close-accounting-period.command';

import { AccountingPeriodAggregate } from '../../domain/aggregates/accounting-period.aggregate';

import type { AccountingPeriodRepository } from '../../domain/repositories/accounting-period.repository';

import { AccountingPeriodNotFoundException } from '../../domain/exceptions/accounting-period-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CloseAccountingPeriodHandler implements CommandHandler<
  CloseAccountingPeriodCommand,
  AccountingPeriodAggregate
> {
  public constructor(
    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_PERIOD)
    private readonly accountingPeriodRepository: AccountingPeriodRepository,
  ) {}

  public async execute(
    command: CloseAccountingPeriodCommand,
  ): Promise<AccountingPeriodAggregate> {
    // -------------------------------------------------------------------------
    // Find aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.accountingPeriodRepository.findByPublicId(
      command.publicId,
    );

    if (aggregate === null) {
      throw new AccountingPeriodNotFoundException(
        `Accounting period with public ID ${command.publicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Close period
    // -------------------------------------------------------------------------

    aggregate.close(
      command.closedAt,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist aggregate
    // -------------------------------------------------------------------------

    await this.accountingPeriodRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CloseAccountingPeriodHandler;
