// -----------------------------------------------------------------------------
// Financial Settlement — Complete Command
// -----------------------------------------------------------------------------
//
// Application command for completing a Financial Settlement aggregate.
//
// The command represents the intent to transition an existing Financial
// Settlement aggregate from PROCESSING to COMPLETED.
//
// Completion is permitted only when the FinancialSettlementAggregate confirms
// that:
//
// - The Settlement contains at least one Settlement Item.
// - Every Settlement Item has been allocated.
// - Every Settlement Item has been settled.
// - The full Settlement amount has been allocated.
// - The Settlement is currently PROCESSING.
//
// The aggregate remains responsible for enforcing these invariants.
//
// This command does NOT:
//
// - Allocate Settlement Items.
// - Create Financial Transactions.
// - Modify Financial Account balances.
// - Move money.
// - Execute disbursements.
// - Perform accounting.
// - Communicate with external financial providers.
// - Reverse or settle unrelated Financial Transactions.
//
// Completion records the successful conclusion of the Settlement lifecycle.
// Actual financial movement belongs to the appropriate Financial Transaction,
// Account, Disbursement, and Integration boundaries.
//
// Correlation and causation identifiers are carried for application-level
// tracing and domain-event correlation.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle transition:
//
//     PROCESSING → COMPLETED
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialSettlementPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for completing a Financial Settlement.
 *
 * The command identifies the Settlement through its public identity.
 *
 * The target lifecycle status is intentionally NOT supplied by the command.
 * The FinancialSettlementAggregate owns and validates the transition:
 *
 *     PROCESSING → COMPLETED
 *
 * Completion is only valid when the aggregate is fully settled and fully
 * allocated.
 */
export class CompleteFinancialSettlementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Settlement to complete.
     */
    public readonly settlementPublicId: FinancialSettlementPublicId,

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
