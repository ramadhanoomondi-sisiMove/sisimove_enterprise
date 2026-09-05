// -----------------------------------------------------------------------------
// Accounting Journal — Add Entry Command
// -----------------------------------------------------------------------------
//
// Application command for adding an Accounting Journal Entry to an existing
// Accounting Journal aggregate.
//
// Aggregate boundary:
//
// AccountingJournalAggregate
// └── AccountingJournalEntryEntity
//
// Responsibilities:
//
// - identify the target Accounting Journal;
// - carry the journal-entry date;
// - carry the optional journal-entry description;
// - carry correlation/causation metadata.
//
// This command does NOT:
//
// - access repositories;
// - access Prisma;
// - construct the journal entry entity;
// - validate journal status;
// - validate journal ownership outside the aggregate;
// - publish domain events;
// - authorize the caller.
//
// The application handler loads the AccountingJournalAggregate, constructs
// AccountingJournalEntryEntity, and delegates the mutation to:
//
//     aggregate.addEntry(entry)
//
// The journal aggregate remains responsible for:
// - DRAFT-state mutation rules;
// - entry identity uniqueness;
// - entry currency consistency;
// - global journal-line identity consistency.
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

export class AddAccountingJournalEntryCommand implements Command {
  public constructor(
    public readonly journalPublicId: AccountingJournalPublicId,
    public readonly entryDate: Date,
    public readonly correlationId: string,
    public readonly description?: string,
    public readonly createdAt?: Date,
    public readonly causationId?: string,
  ) {}
}

export default AddAccountingJournalEntryCommand;
