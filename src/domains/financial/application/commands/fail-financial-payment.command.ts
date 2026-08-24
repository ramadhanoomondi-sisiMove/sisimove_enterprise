// -----------------------------------------------------------------------------
// Financial Payment — Fail Command
// -----------------------------------------------------------------------------
//
// Application command for transitioning a Financial Payment aggregate into
// the FAILED terminal state.
//
// The command represents the application intent to mark a Financial Payment
// as failed.
//
// Failure information is intentionally NOT supplied by this command.
// FinancialPaymentAggregate.fail() derives the failure information from the
// latest Financial Payment Attempt when one is available.
//
// This preserves the aggregate as the authoritative source of payment
// lifecycle state and prevents callers from arbitrarily supplying failure
// state.
//
// This command does NOT:
//
// - Communicate with an external payment provider.
// - Execute provider operations.
// - Create a Financial Payment Attempt.
// - Modify Financial Account balances.
// - Create or post a Financial Transaction.
// - Retry payment execution.
// - Perform settlement.
// - Perform accounting.
//
// Provider communication belongs to the integration boundary.
// Retry orchestration belongs to the application/orchestration boundary.
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
 * Command for marking a Financial Payment as failed.
 *
 * The command identifies the Financial Payment aggregate that should
 * transition into FAILED.
 *
 * The aggregate determines the applicable failure information from its latest
 * Payment Attempt when available.
 *
 * The aggregate also enforces that an active Payment Attempt must not exist
 * when the payment is failed.
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
export class FailFinancialPaymentCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Payment to mark as failed.
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
