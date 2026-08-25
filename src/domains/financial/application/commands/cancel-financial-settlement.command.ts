// -----------------------------------------------------------------------------
// Financial Settlement — Cancel Command
// -----------------------------------------------------------------------------
//
// Application command for cancelling a Financial Settlement aggregate.
//
// The command represents the intent to transition an existing Financial
// Settlement aggregate into the CANCELLED lifecycle state.
//
// A Financial Settlement may be cancelled from any non-terminal state:
//
//     PENDING    → CANCELLED
//     PROCESSING → CANCELLED
//
// The FinancialSettlementAggregate remains responsible for validating the
// lifecycle transition and applying the cancellation timestamp.
//
// Cancellation records the Settlement lifecycle outcome only.
//
// This command does NOT:
//
// - Reverse previously executed Financial Transactions.
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Execute disbursements.
// - Perform accounting.
// - Communicate with external financial providers.
// - Automatically refund or reverse financial movements.
//
// Any required financial reversal must be performed explicitly through the
// Financial Transaction lifecycle and appropriate application orchestration.
//
// The cancellation reason is optional because cancellation may be initiated
// by a workflow where the reason is not required by the domain.
//
// Correlation and causation identifiers are carried for application-level
// tracing and domain-event correlation.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle transitions:
//
//     PENDING    → CANCELLED
//     PROCESSING → CANCELLED
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
 * Command for cancelling a Financial Settlement.
 *
 * The command identifies the Settlement through its public identity.
 *
 * The target lifecycle status is intentionally NOT supplied by the command.
 * The FinancialSettlementAggregate owns and validates the transition:
 *
 *     PENDING    → CANCELLED
 *     PROCESSING → CANCELLED
 *
 * The aggregate is also responsible for determining whether the Settlement
 * is currently non-terminal and therefore eligible for cancellation.
 */
export class CancelFinancialSettlementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Settlement to cancel.
     */
    public readonly settlementPublicId: FinancialSettlementPublicId,

    /**
     * Optional reason explaining why the Financial Settlement was cancelled.
     */
    public readonly reason: string | undefined,

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
