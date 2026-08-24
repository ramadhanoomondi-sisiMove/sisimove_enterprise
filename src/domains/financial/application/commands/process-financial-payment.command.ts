// -----------------------------------------------------------------------------
// Financial Payment — Process Command
// -----------------------------------------------------------------------------
//
// Application command for transitioning a Financial Payment aggregate into
// PROCESSING.
//
// The command represents the application intent to begin payment processing.
//
// Processing itself does NOT execute an external provider operation. The
// application/integration workflow reacts to the resulting lifecycle event and
// performs provider execution separately.
//
// Responsibilities:
//
// - Identify the Financial Payment to process.
// - Carry correlation and causation metadata.
// - Request the aggregate to transition into PROCESSING.
//
// This command does NOT:
//
// - Execute provider APIs.
// - Communicate directly with payment providers.
// - Create a Financial Payment Attempt.
// - Move funds.
// - Create a Financial Transaction.
// - Modify Financial Account balances.
// - Perform settlement.
// - Perform accounting.
//
// Those responsibilities belong to the appropriate application,
// integration, transaction, settlement, and accounting boundaries.
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
 * Command for processing a Financial Payment.
 *
 * The command identifies the Financial Payment aggregate that should transition
 * into PROCESSING.
 *
 * The actual lifecycle transition is enforced by the
 * FinancialPaymentAggregate.
 *
 * Provider execution is intentionally outside the aggregate and is performed
 * by the appropriate application/integration workflow after processing has
 * begun.
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
export class ProcessFinancialPaymentCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Payment to process.
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
