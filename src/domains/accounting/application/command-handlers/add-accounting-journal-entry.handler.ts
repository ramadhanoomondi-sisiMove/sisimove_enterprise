// -----------------------------------------------------------------------------
// Accounting Journal — Add Entry Handler
// -----------------------------------------------------------------------------
//
// Application handler for adding an Accounting Journal Entry to an existing
// Accounting Journal aggregate.
//
// Aggregate boundary:
//
// AccountingJournalAggregate
// └── AccountingJournalEntryEntity
//
// Responsibilities:
//
// - load the target Accounting Journal aggregate;
// - construct the AccountingJournalEntryEntity;
// - delegate the mutation to the aggregate;
// - persist the modified Accounting Journal aggregate.
//
// This handler does NOT:
//
// - directly persist AccountingJournalEntryEntity;
// - access Prisma;
// - use an AccountingJournalEntryRepository;
// - validate journal status directly;
// - validate entry currency directly;
// - validate entry identity uniqueness directly;
// - publish domain events directly;
// - authorize the caller.
//
// Those responsibilities belong to the appropriate architectural layer.
//
// The aggregate remains responsible for:
//
// - DRAFT-state mutation rules;
// - entry identity uniqueness;
// - entry currency consistency;
// - global journal-line identity consistency.
//
// -----------------------------------------------------------------------------
//
// Flow:
//
// AddAccountingJournalEntryCommand
//        │
//        ▼
// AccountingJournalRepository
//        │
//        ▼
// AccountingJournalAggregate
//        │
//        ├── AccountingJournalEntryEntity.create(...)
//        │
//        └── aggregate.addEntry(entry)
//                    │
//                    ▼
//              aggregate validation
//                    │
//                    ▼
//          AccountingJournalRepository.save(...)
//
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

import type { AddAccountingJournalEntryCommand } from '../commands/add-accounting-journal-entry.command';

// -----------------------------------------------------------------------------
// Accounting — Domain
// -----------------------------------------------------------------------------

import { AccountingJournalEntryEntity } from '../../domain/entities/accounting-journal-entry.entity';

import { AccountingException } from '../../domain/exceptions/accounting.exception';

import type { AccountingJournalRepository } from '../../domain/repositories/accounting-journal.repository';

// -----------------------------------------------------------------------------

@Injectable()
export class AddAccountingJournalEntryHandler implements CommandHandler<
  AddAccountingJournalEntryCommand,
  AccountingJournalEntryEntity
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_JOURNAL)
    private readonly accountingJournalRepository: AccountingJournalRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(
    command: AddAccountingJournalEntryCommand,
  ): Promise<AccountingJournalEntryEntity> {
    // -------------------------------------------------------------------------
    // Load Accounting Journal aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.accountingJournalRepository.findByPublicId(
      command.journalPublicId,
    );

    if (aggregate === null) {
      throw new AccountingException('Accounting journal does not exist.');
    }

    // -------------------------------------------------------------------------
    // Construct journal entry entity
    // -------------------------------------------------------------------------
    //
    // The entry starts without journal lines.
    //
    // Lines are added through the journal aggregate after the entry has been
    // created.
    //
    // -------------------------------------------------------------------------

    const entry = AccountingJournalEntryEntity.create(
      command.entryDate,
      command.description,
      [],
      command.createdAt,
    );

    // -------------------------------------------------------------------------
    // Delegate mutation to aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate enforces:
    //
    // - journal DRAFT status;
    // - entry type validity;
    // - entry identity uniqueness;
    // - entry currency consistency;
    // - global journal-line identity uniqueness.
    //
    // -------------------------------------------------------------------------

    aggregate.addEntry(entry);

    // -------------------------------------------------------------------------
    // Persist aggregate
    // -------------------------------------------------------------------------
    //
    // AccountingJournalEntryEntity is an aggregate-internal entity.
    //
    // Therefore the journal aggregate is persisted through the journal
    // repository. There is intentionally no separate journal-entry repository.
    //
    // -------------------------------------------------------------------------

    await this.accountingJournalRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return created entry
    // -------------------------------------------------------------------------

    return entry;
  }
}

export default AddAccountingJournalEntryHandler;
