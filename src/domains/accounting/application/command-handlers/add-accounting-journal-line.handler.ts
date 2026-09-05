// -----------------------------------------------------------------------------
// Accounting Journal — Add Line Handler
// -----------------------------------------------------------------------------
//
// Application handler for adding an Accounting Journal Line to an existing
// Accounting Journal Entry.
//
// Aggregate context:
//
// AccountingJournalAggregate
// └── AccountingJournalEntity
//     └── AccountingJournalEntryEntity
//         └── AccountingJournalLineEntity
//
// Responsibilities:
//
// - load the target Accounting Journal aggregate;
// - resolve the referenced Accounting Account;
// - construct the AccountingJournalLineEntity;
// - delegate the mutation to the AccountingJournalAggregate;
// - persist the modified Accounting Journal aggregate.
//
// This handler does NOT:
//
// - directly persist AccountingJournalLineEntity;
// - access Prisma;
// - validate journal balance;
// - validate journal posting state directly;
// - authorize the caller;
// - determine debit/credit accounting rules;
// - publish domain events directly.
//
// The AccountingJournalAggregate remains responsible for:
//
// - DRAFT-state mutation rules;
// - journal-line type validation;
// - journal-line currency consistency;
// - global journal-line identity uniqueness;
// - locating the target journal entry.
//
// Cross-aggregate account reference resolution belongs to the application
// layer.
//
// -----------------------------------------------------------------------------
//
// Flow:
//
// AddAccountingJournalLineCommand
//        │
//        ├── journalPublicId
//        │
//        └── accountPublicId
//                  │
//                  ▼
//        AccountingAccountRepository
//                  │
//                  ▼
//          AccountingAccountEntity
//                  │
//                  ▼
//             accountId
//                  │
//                  ▼
//        AccountingJournalRepository
//                  │
//                  ▼
//        AccountingJournalAggregate
//                  │
//                  ▼
//   AccountingJournalLineEntity.create(...)
//                  │
//                  ▼
//      aggregate.addLine(entryId, line)
//                  │
//                  ▼
//        AccountingJournalRepository.save(...)
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

import type { AddAccountingJournalLineCommand } from '../commands/add-accounting-journal-line.command';

// -----------------------------------------------------------------------------
// Accounting — Domain
// -----------------------------------------------------------------------------

import { AccountingJournalLineEntity } from '../../domain/entities/accounting-journal-line.entity';

import { AccountingException } from '../../domain/exceptions/accounting.exception';

import type { AccountingAccountRepository } from '../../domain/repositories/accounting-account.repository';

import type { AccountingJournalRepository } from '../../domain/repositories/accounting-journal.repository';

// -----------------------------------------------------------------------------

@Injectable()
export class AddAccountingJournalLineHandler implements CommandHandler<
  AddAccountingJournalLineCommand,
  AccountingJournalLineEntity
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_JOURNAL)
    private readonly accountingJournalRepository: AccountingJournalRepository,

    @Inject(ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_ACCOUNT)
    private readonly accountingAccountRepository: AccountingAccountRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(
    command: AddAccountingJournalLineCommand,
  ): Promise<AccountingJournalLineEntity> {
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
    // Resolve Accounting Account
    // -------------------------------------------------------------------------
    //
    // The command intentionally carries the public account identity.
    //
    // AccountingJournalLineEntity stores the internal account identity.
    //
    // Resolving that reference is an application-layer responsibility because
    // AccountingAccount is a separate aggregate.
    //
    // -------------------------------------------------------------------------

    const account = await this.accountingAccountRepository.findByPublicId(
      command.accountPublicId,
    );

    if (account === null) {
      throw new AccountingException('Accounting account does not exist.');
    }

    // -------------------------------------------------------------------------
    // Construct Accounting Journal Line
    // -------------------------------------------------------------------------

    const line = AccountingJournalLineEntity.create(
      account.id,
      command.type,
      command.amount,
      command.currency,
      command.description,
      command.createdAt,
    );

    // -------------------------------------------------------------------------
    // Delegate mutation to aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate is responsible for:
    //
    // - ensuring the journal is still in DRAFT state;
    // - locating the target entry;
    // - validating the line type;
    // - validating currency consistency;
    // - ensuring global line identity uniqueness.
    //
    // -------------------------------------------------------------------------

    aggregate.addLine(command.entryId, line);

    // -------------------------------------------------------------------------
    // Persist Accounting Journal aggregate
    // -------------------------------------------------------------------------
    //
    // AccountingJournalLineEntity is an aggregate-internal entity.
    //
    // Therefore it is persisted through the AccountingJournalRepository.
    //
    // There is intentionally no AccountingJournalLineRepository.
    //
    // -------------------------------------------------------------------------

    await this.accountingJournalRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return created line
    // -------------------------------------------------------------------------

    return line;
  }
}

export default AddAccountingJournalLineHandler;
