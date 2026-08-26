// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Complete Command
// -----------------------------------------------------------------------------
//
// Application command for completing a Financial Account Withdrawal.
//
// The command represents the application-level intent to transition an
// existing Financial Account Withdrawal from PROCESSING to COMPLETED.
//
// The withdrawal aggregate owns lifecycle validation and mutation.
//
// This command does NOT:
// - Create a Financial Account Withdrawal.
// - Create a Financial Disbursement.
// - Execute an external provider.
// - Move funds.
// - Modify Financial Account balances.
// - Create a Financial Transaction.
// - Perform settlement.
// - Perform accounting.
//
// Completion represents successful resolution of the withdrawal workflow.
// The actual external disbursement execution belongs to the Financial
// Disbursement workflow.
//
// The command carries the public identity of the withdrawal aggregate rather
// than the aggregate instance itself.
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

import type { FinancialAccountWithdrawalPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for completing a Financial Account Withdrawal.
 *
 * The command represents the intent to move an existing withdrawal through
 * the lifecycle transition:
 *
 *     PROCESSING -> COMPLETED
 *
 * The FinancialAccountWithdrawalAggregate owns the lifecycle invariant and
 * performs the actual state transition.
 *
 * Required domain inputs:
 *
 * - withdrawalId
 * - completedAt
 *
 * Correlation and causation identifiers are supplied for application-level
 * tracing and domain-event correlation.
 */
export class CompleteFinancialAccountWithdrawalCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Account Withdrawal to complete.
     *
     * This is an opaque reference to the Financial Account Withdrawal
     * aggregate.
     */
    public readonly withdrawalId: FinancialAccountWithdrawalPublicId,

    /**
     * Timestamp at which the withdrawal was successfully completed.
     *
     * The application workflow supplies this timestamp to the aggregate.
     */
    public readonly completedAt: Date,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * completion command.
     */
    public readonly causationId?: string,
  ) {}
}
