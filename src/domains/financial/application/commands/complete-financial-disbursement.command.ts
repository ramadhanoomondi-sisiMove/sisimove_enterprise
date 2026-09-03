// -----------------------------------------------------------------------------
// Financial Disbursement — Complete Command
// -----------------------------------------------------------------------------
//
// Application command for completing an existing Financial Disbursement
// aggregate.
//
// Completion represents the final successful lifecycle transition:
//
// PROCESSING → COMPLETED
//
// The command carries the identity of the Financial Disbursement to complete
// together with application-level correlation metadata.
//
// The application handler is responsible for:
//
// - loading the Financial Disbursement aggregate;
// - invoking the aggregate completion behavior;
// - persisting the aggregate;
// - publishing the resulting domain event.
//
// Before completion, the aggregate itself verifies that:
//
// - the Financial Disbursement is PROCESSING;
// - a successful Financial Disbursement Attempt exists;
// - the successful attempt belongs to the disbursement;
// - the attempt amount and currency match;
// - the attempt provider matches the selected destination;
// - all attempts are terminal;
// - a Financial Transaction reference exists.
//
// The aggregate then emits FinancialDisbursementCompletedEvent.
//
// This command does NOT:
//
// - execute a provider API;
// - create or post a Financial Transaction;
// - modify Financial Account balances;
// - create another execution attempt;
// - perform accounting;
// - persist itself.
//
// Financial Transaction creation/posting belongs to the Financial Transaction
// boundary.
// Financial Account balance mutation belongs to the Financial Account
// boundary.
// Persistence belongs to the application/infrastructure boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialDisbursementPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for completing a Financial Disbursement.
 *
 * The command represents the intent to transition an existing Financial
 * Disbursement from PROCESSING to COMPLETED.
 *
 * Completion is permitted only when the aggregate's completion invariants
 * are satisfied.
 *
 * The command intentionally does not carry:
 *
 * - transactionPublicId;
 * - attemptPublicId;
 * - amount;
 * - currency;
 * - provider information;
 * - lifecycle status.
 *
 * These values belong to aggregate state and are validated by the domain.
 */
export class CompleteFinancialDisbursementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Disbursement to complete.
     *
     * This is the externally meaningful aggregate identity and remains
     * separate from the internal persistence identity.
     */
    public readonly disbursementPublicId: FinancialDisbursementPublicId,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {}
}
