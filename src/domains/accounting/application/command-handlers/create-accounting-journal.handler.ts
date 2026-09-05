// -----------------------------------------------------------------------------
// Accounting — Create Accounting Journal Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for creating an Accounting Journal aggregate.
//
// Responsibilities:
//
// - create the Accounting Journal entity;
// - create the Accounting Journal aggregate;
// - record the journal-created domain event;
// - persist the aggregate.
//
// This handler does NOT:
//
// - add journal entries;
// - add journal lines;
// - balance the journal;
// - post the journal;
// - reverse the journal;
// - validate Accounting Accounts;
// - validate Accounting Period state;
// - access Prisma or other persistence technology.
//
// The Accounting Period reference is already represented by the command as
// opaque value objects/identifiers. Cross-aggregate validation, when required
// by the use case, belongs to the application workflow.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Accounting — Application
// -----------------------------------------------------------------------------

import type { CreateAccountingJournalCommand } from '../commands/create-accounting-journal.command';

// -----------------------------------------------------------------------------
// Accounting — Domain
// -----------------------------------------------------------------------------

import { AccountingJournalAggregate } from '../../domain/aggregates/accounting-journal.aggregate';

import { AccountingJournalEntity } from '../../domain/entities/accounting-journal.entity';

import type { AccountingJournalRepository } from '../../domain/repositories/accounting-journal.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class CreateAccountingJournalHandler implements CommandHandler<
  CreateAccountingJournalCommand,
  AccountingJournalAggregate
> {
  public constructor(
    private readonly accountingJournalRepository: AccountingJournalRepository,
  ) {}

  public async execute(
    command: CreateAccountingJournalCommand,
  ): Promise<AccountingJournalAggregate> {
    // =========================================================================
    // Create Accounting Journal Entity
    // =========================================================================

    const journal = AccountingJournalEntity.create(
      command.currency,
      command.periodId,
      command.periodPublicId,
      command.createdAt,
    );

    // =========================================================================
    // Create Accounting Journal Aggregate
    // =========================================================================

    const aggregate = AccountingJournalAggregate.create(journal);

    // =========================================================================
    // Record Domain Event
    // =========================================================================

    aggregate.recordCreated(command.correlationId, command.causationId);

    // =========================================================================
    // Persist Aggregate
    // =========================================================================

    await this.accountingJournalRepository.save(aggregate);

    // =========================================================================
    // Return
    // =========================================================================

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateAccountingJournalHandler;
