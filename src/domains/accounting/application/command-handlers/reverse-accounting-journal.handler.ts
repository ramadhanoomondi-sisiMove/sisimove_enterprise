// -----------------------------------------------------------------------------
// Accounting Journal — Reverse Command Handler
// -----------------------------------------------------------------------------
//
// Handles reversal of an Accounting Journal aggregate.
//
// Posting lifecycle:
//
//     DRAFT → POSTED → REVERSED
//
// Reversal is terminal.
//
// Responsibilities:
//
// - load the Accounting Journal aggregate;
// - delegate reversal to the aggregate;
// - persist the updated aggregate.
//
// The handler does NOT:
//
// - create reversal journal lines;
// - mutate existing journal entries;
// - mutate existing journal lines;
// - perform aggregate-local lifecycle validation;
// - publish domain events directly;
// - access Prisma;
// - persist entries or lines independently;
// - authorize the caller.
//
// The AccountingJournalAggregate is responsible for:
//
// - validating that the journal is POSTED;
// - preserving the original journal entries and lines;
// - transitioning POSTED → REVERSED;
// - recording AccountingJournalReversedEvent.
//
// Cross-aggregate validation belongs to the appropriate application/domain
// workflow and is intentionally not performed by this handler.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Accounting — Application
// -----------------------------------------------------------------------------

import { ACCOUNTING_TOKENS } from '../accounting.tokens';

import type ReverseAccountingJournalCommand from '../commands/reverse-accounting-journal.command';

// -----------------------------------------------------------------------------
// Accounting — Domain
// -----------------------------------------------------------------------------

import { AccountingException } from '../../domain/exceptions/accounting.exception';

import type { AccountingJournalAggregate } from '../../domain/aggregates/accounting-journal.aggregate';

import type { AccountingJournalRepository } from '../../domain/repositories/accounting-journal.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class ReverseAccountingJournalHandler implements CommandHandler<
  ReverseAccountingJournalCommand,
  AccountingJournalAggregate
> {
  public constructor(
    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_JOURNAL)
    private readonly accountingJournalRepository: AccountingJournalRepository,
  ) {}

  public async execute(
    command: ReverseAccountingJournalCommand,
  ): Promise<AccountingJournalAggregate> {
    const aggregate = await this.accountingJournalRepository.findByPublicId(
      command.publicId,
    );

    if (aggregate === null) {
      throw new AccountingException('Accounting journal does not exist.');
    }

    aggregate.reverse(
      command.correlationId,
      command.causationId,
      command.reversedAt,
    );

    await this.accountingJournalRepository.save(aggregate);

    return aggregate;
  }
}

export default ReverseAccountingJournalHandler;
