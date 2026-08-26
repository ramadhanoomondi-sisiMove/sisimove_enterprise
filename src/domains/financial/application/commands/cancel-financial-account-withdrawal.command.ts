// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Cancel Command
// -----------------------------------------------------------------------------
//
// Application command for cancelling a Financial Account Withdrawal.
//
// Valid lifecycle transitions:
//
//     PENDING    -> CANCELLED
//     PROCESSING -> CANCELLED
//
// Cancellation represents the explicit termination of the withdrawal workflow
// before successful completion.
//
// This command does NOT:
// - Move money.
// - Modify Financial Account balances directly.
// - Create or execute a Financial Transaction.
// - Create or execute a Financial Disbursement.
// - Call an external provider.
//
// The aggregate owns lifecycle validation and cancellation state transition.
//
// The cancellation reason is carried by the command because it describes the
// business/contextual reason for the cancellation and is emitted through the
// corresponding domain event.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for cancelling a Financial Account Withdrawal.
 *
 * Valid lifecycle transitions:
 *
 *     PENDING    -> CANCELLED
 *     PROCESSING -> CANCELLED
 *
 * The aggregate validates the lifecycle transition and emits the corresponding
 * FinancialAccountWithdrawalCancelledEvent.
 */
export class CancelFinancialAccountWithdrawalCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Account Withdrawal to cancel.
     *
     * This is the opaque identity of the withdrawal aggregate.
     */
    public readonly withdrawalPublicId: FinancialAccountWithdrawalPublicId,

    /**
     * Business/technical reason explaining why the withdrawal was cancelled.
     *
     * The reason is not persisted on the withdrawal entity. It is carried
     * through the domain event as cancellation context.
     */
    public readonly reason: string,

    /**
     * Timestamp at which the withdrawal cancellation occurred.
     *
     * The application workflow supplies this value.
     */
    public readonly cancelledAt: Date,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * cancellation request.
     */
    public readonly causationId?: string,
  ) {}
}
