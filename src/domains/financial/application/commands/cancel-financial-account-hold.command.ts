// -----------------------------------------------------------------------------
// Financial Account Hold — Cancel Command
// -----------------------------------------------------------------------------
//
// Application command for cancelling an existing Financial Account Hold.
//
// Cancellation represents business invalidation of the hold:
//
//     ACTIVE -> CANCELLED
//
// A cancelled hold must no longer reserve funds. Therefore, cancellation
// requires a Financial RELEASE transaction whose public identifier is recorded
// on the hold.
//
// This command does NOT:
//
// - Create the Financial RELEASE transaction.
// - Execute the Financial RELEASE transaction.
// - Modify Financial Account balances directly.
// - Move money.
// - Communicate with payment providers.
// - Mutate the Financial Account aggregate.
//
// The application workflow is responsible for coordinating the RELEASE
// Financial Transaction with the Financial Account Hold cancellation.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for cancelling a Financial Account Hold.
 *
 * The command represents the application-level intent to invalidate an ACTIVE
 * Financial Account Hold.
 *
 * Required inputs:
 *
 * - publicId
 * - releaseTransactionPublicId
 * - cancelledAt
 * - correlationId
 *
 * Optional inputs:
 *
 * - causationId
 *
 * The FinancialAccountHoldAggregate owns the lifecycle transition:
 *
 *     ACTIVE -> CANCELLED
 *
 * Cancellation also records the Financial RELEASE transaction that resolves
 * the reservation.
 *
 * The RELEASE transaction is a separate Financial aggregate and is coordinated
 * by the application workflow.
 */
export class CancelFinancialAccountHoldCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Account Hold being cancelled.
     */
    public readonly publicId: FinancialAccountHoldPublicId,

    /**
     * Public identity of the Financial RELEASE transaction that resolves
     * the reserved funds.
     *
     * Cancellation requires release because a cancelled hold must no longer
     * reserve funds.
     *
     * The transaction itself is a separate Financial aggregate.
     */
    public readonly releaseTransactionPublicId: string,

    /**
     * Timestamp at which the Financial Account Hold enters CANCELLED state.
     */
    public readonly cancelledAt: Date,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * cancellation command.
     */
    public readonly causationId?: string,
  ) {}
}
