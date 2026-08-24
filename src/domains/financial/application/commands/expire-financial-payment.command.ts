// -----------------------------------------------------------------------------
// Financial Payment — Expire Command
// -----------------------------------------------------------------------------
//
// Application command for transitioning a Financial Payment aggregate into
// the EXPIRED terminal state.
//
// The command represents the application intent to expire a Financial Payment.
//
// Expiration is a Financial Payment lifecycle operation. Provider-side
// expiration or cancellation, when required, is handled separately by the
// appropriate integration boundary.
//
// This command does NOT:
//
// - Communicate directly with an external payment provider.
// - Perform provider-side cancellation.
// - Modify Financial Account balances.
// - Create or post a Financial Transaction.
// - Perform settlement.
// - Perform accounting.
// - Retry the payment.
//
// The aggregate remains responsible for enforcing the Financial Payment
// expiration invariants.
//
// Expiration may be initiated by an application workflow, scheduled process,
// timeout handler, or other orchestration mechanism.
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
 * Command for expiring a Financial Payment.
 *
 * The command identifies the Financial Payment aggregate that should
 * transition into EXPIRED.
 *
 * The expiration timestamp is determined by the application/domain operation
 * and is therefore intentionally NOT supplied by the command.
 *
 * The aggregate enforces that an active Financial Payment Attempt must not
 * exist when the payment is expired.
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
export class ExpireFinancialPaymentCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Payment to expire.
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
