// -----------------------------------------------------------------------------
// Financial Payment — Post Successful Command
// -----------------------------------------------------------------------------
//
// Application command for posting a successfully completed Financial Payment
// into the Financial Transaction ledger.
//
// The command represents the application intent to post a Financial Payment
// whose provider execution and payment confirmation have already succeeded.
//
// The command identifies the Financial Payment aggregate that should be
// financially posted.
//
// This command does NOT:
//
// - Execute a payment provider.
// - Communicate with an external provider.
// - Create a Financial Payment Attempt.
// - Reconfirm provider payment success.
// - Perform settlement.
// - Perform accounting outside the Financial Transaction boundary.
//
// Payment confirmation belongs to the Financial Payment domain.
// Financial Transaction creation and posting belong to the transaction boundary.
//
// -----------------------------------------------------------------------------
//
// Foundation
//
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
 * Command for posting a successfully completed Financial Payment.
 *
 * The command identifies the Financial Payment aggregate whose successful
 * completion should trigger financial transaction posting.
 *
 * The payment amount, account identity, payment method and successful attempt
 * are resolved from the persisted Financial Payment aggregate.
 *
 * These values are deliberately not supplied as independent command inputs.
 * This prevents callers from introducing financial data that differs from
 * the confirmed payment.
 *
 * Required application inputs:
 *
 * - paymentPublicId
 * - correlationId
 *
 * Optional application-level input:
 *
 * - causationId
 */
export class PostSuccessfulFinancialPaymentCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Payment to post.
     *
     * This identifies the successfully completed payment aggregate.
     */
    public readonly paymentPublicId: PublicEntityId,

    /**
     * Correlation identifier for the posting command and resulting domain
     * events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the event or operation that caused this
     * posting command.
     */
    public readonly causationId?: string,
  ) {}
}
