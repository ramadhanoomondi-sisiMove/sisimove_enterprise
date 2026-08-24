// -----------------------------------------------------------------------------
// Financial Payment — Link Transaction Command
// -----------------------------------------------------------------------------
//
// Application command for linking a Financial Payment aggregate to the
// Financial Transaction that represents its resulting financial effect.
//
// The command represents the application intent to establish an opaque
// reference from the Financial Payment to a Financial Transaction.
//
// FinancialTransaction remains a separate aggregate. This command does NOT
// load it into the Financial Payment aggregate or embed it in the command.
//
// This command does NOT:
//
// - Create a Financial Transaction.
// - Post a Financial Transaction.
// - Modify Financial Account balances.
// - Perform accounting.
// - Perform settlement.
// - Persist either aggregate directly.
//
// Financial Transaction creation and posting belong to the Financial
// Transaction application boundary.
//
// The Financial Payment aggregate only stores the Financial Transaction's
// opaque public identity.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Foundation Value Objects
// -----------------------------------------------------------------------------

import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for linking a Financial Payment to a Financial Transaction.
 *
 * The command identifies:
 *
 * - the Financial Payment aggregate;
 * - the Financial Transaction through its opaque public identity.
 *
 * The current Financial Payment status is resolved from the aggregate and is
 * therefore intentionally NOT supplied by the command.
 *
 * Required domain inputs:
 *
 * - paymentPublicId
 * - transactionPublicId
 * - correlationId
 *
 * Optional application-level input:
 *
 * - causationId
 */
export class LinkFinancialPaymentTransactionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Payment aggregate.
     *
     * This is the payment aggregate to which the transaction reference will
     * be attached.
     */
    public readonly paymentPublicId: PublicEntityId,

    /**
     * Public identity of the Financial Transaction.
     *
     * This is an opaque cross-aggregate reference.
     *
     * The Financial Transaction aggregate itself is intentionally not embedded
     * in the command.
     */
    public readonly transactionPublicId: string,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {}
}
