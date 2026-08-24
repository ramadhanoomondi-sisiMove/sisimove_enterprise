// -----------------------------------------------------------------------------
// Financial Payment — Succeed Command
// -----------------------------------------------------------------------------
//
// Application command for successfully completing a Financial Payment
// aggregate.
//
// The command represents the application intent to transition a Financial
// Payment into its successful terminal state.
//
// A Financial Payment can only succeed when the aggregate has a successful
// Financial Payment Attempt.
//
// The aggregate validates that invariant.
//
// This command does NOT:
//
// - Execute a payment provider.
// - Communicate with an external provider.
// - Create a Financial Payment Attempt.
// - Create or post a Financial Transaction.
// - Modify Financial Account balances.
// - Perform settlement.
// - Perform accounting.
//
// Provider execution belongs to the integration boundary.
// Financial Transaction creation/posting belongs to the transaction boundary.
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
 * Command for successfully completing a Financial Payment.
 *
 * The command identifies the Financial Payment aggregate that should transition
 * into SUCCEEDED.
 *
 * The successful Payment Attempt is resolved from the aggregate rather than
 * supplied as mutable state by the command. This preserves the aggregate
 * invariant that a payment cannot succeed without a successful attempt.
 *
 * The resulting Financial Transaction is also not supplied by this command.
 * Transaction creation/linking belongs to the appropriate transaction
 * application boundary.
 *
 * Required domain inputs:
 *
 * - paymentPublicId
 * - correlationId
 *
 * Optional application-level input:
 *
 * - causationId
 */
export class SucceedFinancialPaymentCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Payment to complete successfully.
     *
     * This is the externally meaningful identity of the payment aggregate.
     */
    public readonly paymentPublicId: PublicEntityId,

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
