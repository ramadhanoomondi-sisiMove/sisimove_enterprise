// -----------------------------------------------------------------------------
// Financial Transaction — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating a Financial Transaction aggregate.
//
// The command carries domain-ready value objects rather than raw transport
// values.
//
// DTO-to-domain conversion belongs to the presentation/application boundary.
//
// A newly created Financial Transaction consists of:
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// The transaction is created in PENDING state.
//
// Transaction entries are intentionally NOT part of this command because
// entries are added through FinancialTransactionAggregate.addEntry().
//
// Lifecycle transitions such as completion, failure, cancellation, and
// reversal are handled by their respective commands.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  FinancialTransactionType,
  FinancialAccountReference,
  FinancialTransactionReference,
  Money,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for creating a Financial Transaction aggregate.
 *
 * Required domain inputs:
 *
 * - transaction type
 * - transaction amount
 *
 * Optional domain inputs:
 *
 * - source account
 * - destination account
 * - business reference
 *
 * The initial lifecycle status is determined by the aggregate creation
 * policy and is therefore intentionally NOT supplied by the command.
 *
 * A newly-created transaction always starts in PENDING state.
 *
 * Transaction entries are intentionally excluded from this command and are
 * added through FinancialTransactionAggregate.addEntry().
 *
 * Correlation and causation identifiers are carried for application-level
 * tracing and domain-event correlation.
 */
export class CreateFinancialTransactionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Business classification of the financial transaction.
     */
    public readonly type: FinancialTransactionType,

    /**
     * Transaction amount.
     *
     * Money contains both the integer minor-unit amount and currency.
     */
    public readonly amount: Money,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Source Financial Account involved in the transaction.
     *
     * Optional because some transactions originate outside the platform.
     */
    public readonly sourceAccount?: FinancialAccountReference,

    /**
     * Destination Financial Account involved in the transaction.
     *
     * Optional because some transactions terminate outside the platform.
     */
    public readonly destinationAccount?: FinancialAccountReference,

    /**
     * Business reference identifying the operation that caused or is
     * associated with this transaction.
     */
    public readonly reference?: FinancialTransactionReference,

    /**
     * Optional identifier of the command or operation that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {}
}
