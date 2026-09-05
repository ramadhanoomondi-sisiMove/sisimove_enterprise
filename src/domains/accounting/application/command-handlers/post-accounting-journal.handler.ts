// -----------------------------------------------------------------------------
// Accounting Journal — Post Command Handler
// -----------------------------------------------------------------------------
//
// Handles posting of an Accounting Journal aggregate.
//
// Posting lifecycle:
//
//     DRAFT → POSTED
//
// Responsibilities:
//
// - load the Accounting Journal aggregate;
// - delegate posting to the aggregate;
// - persist the updated aggregate.
//
// The handler does NOT:
//
// - perform aggregate-local posting validation;
// - mutate journal state directly;
// - publish domain events directly;
// - access Prisma;
// - persist journal entries or lines independently;
// - authorize the caller.
//
// The AccountingJournalAggregate is responsible for:
//
// - validating posting readiness;
// - validating journal-local invariants;
// - transitioning DRAFT → POSTED;
// - recording AccountingJournalPostedEvent.
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

import type PostAccountingJournalCommand from '../commands/post-accounting-journal.command';

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
export class PostAccountingJournalHandler implements CommandHandler<
  PostAccountingJournalCommand,
  AccountingJournalAggregate
> {
  public constructor(
    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_JOURNAL)
    private readonly accountingJournalRepository: AccountingJournalRepository,
  ) {}

  public async execute(
    command: PostAccountingJournalCommand,
  ): Promise<AccountingJournalAggregate> {
    const aggregate = await this.accountingJournalRepository.findByPublicId(
      command.publicId,
    );

    if (aggregate === null) {
      throw new AccountingException('Accounting journal does not exist.');
    }

    aggregate.post(
      command.correlationId,
      command.causationId,
      command.postedAt,
    );

    await this.accountingJournalRepository.save(aggregate);

    return aggregate;
  }
}

export default PostAccountingJournalHandler;
