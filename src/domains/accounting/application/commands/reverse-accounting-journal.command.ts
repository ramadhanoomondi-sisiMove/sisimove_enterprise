// -----------------------------------------------------------------------------
// Accounting Journal — Reverse Command
// -----------------------------------------------------------------------------
//
// Application command for reversing an Accounting Journal aggregate.
//
// Posting lifecycle:
//
//     DRAFT → POSTED → REVERSED
//
// Reversal is terminal.
//
// Responsibilities:
//
// - identify the Accounting Journal to reverse;
// - carry reversal timestamp when explicitly supplied;
// - carry correlation/causation metadata.
//
// This command does NOT:
//
// - create reversal journal lines;
// - mutate existing journal entries;
// - mutate existing journal lines;
// - access repositories;
// - access Prisma;
// - validate external aggregates;
// - authorize the caller;
// - publish domain events directly.
//
// The AccountingJournalAggregate is responsible for determining whether the
// journal is POSTED and performing the lifecycle transition.
//
// Reversal preserves the original journal historically. It does not remove
// or mutate its entries or lines.
//
// The aggregate records AccountingJournalReversedEvent after the successful
// lifecycle transition.
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

export class ReverseAccountingJournalCommand implements Command {
  public constructor(
    public readonly publicId: AccountingJournalPublicId,
    public readonly correlationId: string,
    public readonly reversedAt?: Date,
    public readonly causationId?: string,
  ) {}
}

export default ReverseAccountingJournalCommand;
