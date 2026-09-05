// -----------------------------------------------------------------------------
// Accounting Journal — Post Command
// -----------------------------------------------------------------------------
//
// Application command for posting an Accounting Journal aggregate.
//
// Posting lifecycle:
//
//     DRAFT → POSTED
//
// Responsibilities:
//
// - identify the Accounting Journal to post;
// - carry posting timestamp when explicitly supplied;
// - carry correlation/causation metadata.
//
// This command does NOT:
//
// - validate Accounting Account existence;
// - validate Accounting Account status;
// - validate Accounting Period existence;
// - validate whether the Accounting Period is open;
// - access Prisma;
// - access repositories;
// - authorize the caller;
// - publish domain events directly.
//
// The application/domain workflow is responsible for cross-aggregate
// validation. The AccountingJournalAggregate performs aggregate-local posting
// validation before transitioning the journal.
//
// The aggregate guarantees:
//
// - journal is DRAFT;
// - journal contains entries;
// - every entry contains lines;
// - all lines use the journal currency;
// - total debits equal total credits;
// - the journal transitions to POSTED;
// - AccountingJournalPostedEvent is recorded.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import type { AccountingJournalPublicId } from '../../domain/value-objects/accounting-journal-public-id.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class PostAccountingJournalCommand implements Command {
  public constructor(
    public readonly publicId: AccountingJournalPublicId,
    public readonly correlationId: string,
    public readonly postedAt?: Date,
    public readonly causationId?: string,
  ) {}
}

export default PostAccountingJournalCommand;
