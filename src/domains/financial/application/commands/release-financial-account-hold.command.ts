// -----------------------------------------------------------------------------
// Financial Account Hold — Release Command
// -----------------------------------------------------------------------------
//
// Application command for releasing an existing Financial Account Hold.
//
// Release represents the lifecycle transition:
//
//     ACTIVE -> RELEASED
//
// A released hold no longer reserves funds.
//
// The release requires a Financial RELEASE transaction whose public identifier
// is recorded on the hold.
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
// The application workflow is responsible for coordinating the Financial
// RELEASE transaction with the Financial Account Hold lifecycle transition.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for releasing a Financial Account Hold.
 *
 * Represents the application-level intent to release an ACTIVE hold.
 *
 * Lifecycle transition:
 *
 *     ACTIVE -> RELEASED
 */
export class ReleaseFinancialAccountHoldCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Financial Account Hold being released.
     */
    public readonly publicId: FinancialAccountHoldPublicId,

    /**
     * Public identity of the Financial RELEASE transaction that resolves
     * the reserved funds.
     *
     * The transaction itself is a separate Financial aggregate.
     */
    public readonly releaseTransactionPublicId: string,

    /**
     * Timestamp at which the Financial Account Hold enters RELEASED state.
     */
    public readonly releasedAt: Date,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * release command.
     */
    public readonly causationId?: string,
  ) {}
}
