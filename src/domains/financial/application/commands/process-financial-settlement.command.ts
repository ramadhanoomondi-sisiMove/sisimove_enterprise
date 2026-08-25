// -----------------------------------------------------------------------------
// Financial Settlement — Process Command
// -----------------------------------------------------------------------------
//
// Application command for beginning Financial Settlement processing.
//
// The command represents the intent to transition an existing Financial
// Settlement aggregate from PENDING to PROCESSING.
//
// Settlement processing is a lifecycle transition only.
//
// The command does NOT:
//
// - Allocate Settlement Items.
// - Create Financial Transactions.
// - Execute Financial Transactions.
// - Modify Financial Account balances.
// - Move money.
// - Execute disbursements.
// - Perform accounting.
// - Communicate with external financial providers.
//
// Those responsibilities belong to the respective settlement application,
// transaction, account, disbursement, accounting, and integration boundaries.
//
// The aggregate itself remains responsible for validating whether processing
// is allowed, including:
//
// - Current lifecycle status.
// - Presence of at least one Settlement Item.
// - Settlement aggregate invariants.
// - Processing timestamp validity.
//
// Correlation and causation identifiers are carried for application-level
// tracing and domain-event correlation.
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
 * Command for beginning Financial Settlement processing.
 *
 * The command identifies the Financial Settlement through its public
 * identity.
 *
 * The expected lifecycle transition is:
 *
 *     PENDING → PROCESSING
 *
 * The command does not supply the target status because that transition is
 * owned by the FinancialSettlementAggregate.
 */
export class ProcessFinancialSettlementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Settlement to process.
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
