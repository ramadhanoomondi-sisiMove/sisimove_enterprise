// -----------------------------------------------------------------------------
// Add Accounting Journal Line — Command
// -----------------------------------------------------------------------------
//
// Application command for adding a debit or credit line to an existing
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
// - identify the target Accounting Journal;
// - identify the target Journal Entry;
// - identify the referenced Accounting Account;
// - carry the debit/credit direction;
// - carry the non-negative accounting amount;
// - carry the currency;
// - carry optional line description;
// - carry command correlation metadata.
//
// This command does NOT:
//
// - load the Accounting Journal;
// - load the Accounting Journal Entry;
// - load the Accounting Account;
// - validate cross-aggregate references;
// - determine whether the journal is balanced;
// - persist the journal;
// - access Prisma;
// - authorize the operation.
//
// Those responsibilities belong to the application layer and the
// AccountingJournalAggregate.
//
// -----------------------------------------------------------------------------
//

import type { Command } from '../../../../foundation/kernel/application/command';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import type { AccountingJournalPublicId } from '../../domain/value-objects/accounting-journal-public-id.vo';
import type { AccountingAccountPublicId } from '../../domain/value-objects/accounting-account-public-id.vo';
import type { AccountingJournalLineType } from '../../domain/value-objects/accounting-journal-line-type.vo';
import type { AccountingAmount } from '../../domain/value-objects/accounting-amount.vo';
import type { AccountingCurrency } from '../../domain/value-objects/accounting-currency.vo';

export class AddAccountingJournalLineCommand implements Command {
  public constructor(
    public readonly journalPublicId: AccountingJournalPublicId,
    public readonly entryId: UniqueEntityId,
    public readonly accountPublicId: AccountingAccountPublicId,
    public readonly type: AccountingJournalLineType,
    public readonly amount: AccountingAmount,
    public readonly currency: AccountingCurrency,
    public readonly correlationId: string,
    public readonly description?: string,
    public readonly createdAt?: Date,
    public readonly causationId?: string,
  ) {}
}

export default AddAccountingJournalLineCommand;
