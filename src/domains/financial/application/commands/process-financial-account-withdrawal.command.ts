// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Process Command
// -----------------------------------------------------------------------------
//
// Application command for processing a Financial Account Withdrawal.
//
// The command represents the application-level intent to transition an
// existing Financial Account Withdrawal from PENDING to PROCESSING.
//
// The withdrawal aggregate owns lifecycle validation and mutation.
//
// This command does NOT:
// - Create a Financial Account Withdrawal.
// - Create a Financial Disbursement.
// - Execute a disbursement provider.
// - Confirm external payout.
// - Complete the withdrawal.
// - Move funds.
// - Modify Financial Account balances.
// - Create a Financial Transaction.
// - Perform settlement.
// - Perform accounting.
//
// External disbursement execution belongs to the Financial Disbursement
// workflow and its corresponding integration boundary.
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
 * Command for processing a Financial Account Withdrawal.
 *
 * The command represents the intent to move an existing withdrawal through
 * the lifecycle transition:
 *
 *     PENDING -> PROCESSING
 *
 * The FinancialAccountWithdrawalAggregate owns the lifecycle invariant and
 * performs the actual state transition.
 *
 * Required domain input:
 *
 * - withdrawalId
 *
 * Correlation and causation identifiers are supplied for application-level
 * tracing and domain-event correlation.
 */
export class ProcessFinancialAccountWithdrawalCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Account Withdrawal to process.
     *
     * This is an opaque reference to the Financial Account Withdrawal
     * aggregate.
     */
    public readonly withdrawalId: FinancialAccountWithdrawalPublicId,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * processing command.
     */
    public readonly causationId?: string,
  ) {}
}
