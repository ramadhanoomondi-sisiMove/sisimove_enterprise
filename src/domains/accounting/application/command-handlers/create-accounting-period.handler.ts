// -----------------------------------------------------------------------------
// Accounting — Create Accounting Period Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { ACCOUNTING_TOKENS } from '../accounting.tokens';

import type { CreateAccountingPeriodCommand } from '../commands/create-accounting-period.command';

import { AccountingPeriodAggregate } from '../../domain/aggregates/accounting-period.aggregate';

import { AccountingPeriodEntity } from '../../domain/entities/accounting-period.entity';

import type { AccountingPeriodRepository } from '../../domain/repositories/accounting-period.repository';

import { AccountingException } from '../../domain/exceptions/accounting.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CreateAccountingPeriodHandler implements CommandHandler<
  CreateAccountingPeriodCommand,
  AccountingPeriodAggregate
> {
  public constructor(
    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_PERIOD)
    private readonly accountingPeriodRepository: AccountingPeriodRepository,
  ) {}

  public async execute(
    command: CreateAccountingPeriodCommand,
  ): Promise<AccountingPeriodAggregate> {
    // -------------------------------------------------------------------------
    // Verify overlapping periods
    // -------------------------------------------------------------------------

    const overlappingPeriods =
      await this.accountingPeriodRepository.findOverlapping(
        command.startsAt,
        command.endsAt,
      );

    if (overlappingPeriods.length > 0) {
      throw new AccountingException(
        'An accounting period already exists within the requested date range.',
      );
    }

    // -------------------------------------------------------------------------
    // Create entity
    // -------------------------------------------------------------------------

    const period = AccountingPeriodEntity.create(
      command.name,
      command.startsAt,
      command.endsAt,
    );

    // -------------------------------------------------------------------------
    // Create aggregate
    // -------------------------------------------------------------------------

    const aggregate = AccountingPeriodAggregate.create(period);

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

export default CreateAccountingPeriodHandler;
