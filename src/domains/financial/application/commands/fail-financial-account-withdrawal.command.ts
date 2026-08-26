// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Fail Command
// -----------------------------------------------------------------------------
//
// Application command for failing a Financial Account Withdrawal.
//
// Lifecycle transition:
//
//     PROCESSING -> FAILED
//
// Failure represents unsuccessful resolution of the withdrawal workflow.
//
// The failure reason is carried by the command because it describes the
// failure context that is emitted with the domain event.
//
// The withdrawal entity intentionally does not persist the failure reason.
//
// This command does NOT:
// - Create or execute a Financial Disbursement.
// - Call an external provider.
// - Move money.
// - Modify Financial Account balances directly.
// - Create a Financial Transaction.
//
// Those operations belong to their respective workflows.
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
 * Command for failing a Financial Account Withdrawal.
 *
 * Lifecycle transition:
 *
 *     PROCESSING -> FAILED
 *
 * The aggregate validates the lifecycle transition and emits the corresponding
 * FinancialAccountWithdrawalFailedEvent.
 */
export class FailFinancialAccountWithdrawalCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Account Withdrawal to fail.
     */
    public readonly withdrawalPublicId: FinancialAccountWithdrawalPublicId,

    /**
     * Business/technical reason explaining why the withdrawal failed.
     *
     * The reason is not persisted on the withdrawal entity. It is carried
     * through the domain event as failure context.
     */
    public readonly reason: string,

    /**
     * Timestamp at which the withdrawal failure occurred.
     *
     * The application workflow supplies this value.
     */
    public readonly failedAt: Date,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * failure request.
     */
    public readonly causationId?: string,
  ) {}
}
