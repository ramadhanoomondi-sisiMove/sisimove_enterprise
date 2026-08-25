// -----------------------------------------------------------------------------
// Financial Account Hold — Capture Command
// -----------------------------------------------------------------------------
//
// Application command for capturing an existing Financial Account Hold.
//
// Capturing a hold represents the lifecycle transition:
//
//     ACTIVE -> CAPTURED
//
// The command identifies the hold and the Financial CAPTURE transaction that
// resolves the reserved funds.
//
// This command does NOT:
//
// - Execute the Financial CAPTURE transaction.
// - Modify Financial Account balances directly.
// - Move money.
// - Communicate with payment providers.
// - Mutate the Financial Account aggregate.
//
// The application workflow is responsible for coordinating the CAPTURE
// Financial Transaction with the Financial Account Hold lifecycle transition.
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
 * Command for capturing a Financial Account Hold.
 *
 * The command represents the application-level intent to resolve an ACTIVE
 * Financial Account Hold through capture.
 *
 * Required inputs:
 *
 * - publicId
 * - captureTransactionPublicId
 * - capturedAt
 * - correlationId
 *
 * Optional inputs:
 *
 * - causationId
 *
 * The FinancialAccountHoldAggregate owns the lifecycle transition:
 *
 *     ACTIVE -> CAPTURED
 *
 * The associated Financial CAPTURE transaction is a separate aggregate and
 * is coordinated by the application workflow.
 */
export class CaptureFinancialAccountHoldCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Account Hold being captured.
     */
    public readonly publicId: FinancialAccountHoldPublicId,

    /**
     * Public identity of the Financial CAPTURE transaction that resolves
     * the reserved funds.
     *
     * The transaction itself is a separate Financial aggregate.
     */
    public readonly captureTransactionPublicId: string,

    /**
     * Timestamp at which the Financial Account Hold enters CAPTURED state.
     */
    public readonly capturedAt: Date,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * capture command.
     */
    public readonly causationId?: string,
  ) {}
}
