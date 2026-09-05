// -----------------------------------------------------------------------------
// Accounting Journal — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating an Accounting Journal aggregate.
//
// The command expresses the intent to create a new Accounting Journal.
//
// Responsibilities:
//
// - carry the journal currency;
// - optionally carry the Accounting Period reference;
// - carry correlation/causation metadata.
//
// This command does NOT:
//
// - create entities;
// - access repositories;
// - access Prisma;
// - validate Accounting Period existence;
// - validate Accounting Period state;
// - authorize the caller;
// - publish domain events.
//
// Entity construction and aggregate creation belong to the application
// handler and domain model.
//
// The Accounting Period reference remains opaque to this command. Cross-
// aggregate validation belongs to the application/domain workflow.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import type { AccountingCurrency } from '../../domain/value-objects/accounting-currency.vo';

import type { AccountingPeriodPublicId } from '../../domain/value-objects/accounting-period-public-id.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class CreateAccountingJournalCommand implements Command {
  public constructor(
    public readonly currency: AccountingCurrency,
    public readonly correlationId: string,
    public readonly periodId: UniqueEntityId | undefined = undefined,
    public readonly periodPublicId:
      AccountingPeriodPublicId | undefined = undefined,
    public readonly createdAt: Date | undefined = undefined,
    public readonly causationId?: string,
  ) {}
}

export default CreateAccountingJournalCommand;
