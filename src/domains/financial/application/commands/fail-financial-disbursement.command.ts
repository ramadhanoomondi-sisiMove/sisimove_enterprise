// -----------------------------------------------------------------------------
// Financial Disbursement — Fail Command
// -----------------------------------------------------------------------------
//
// Application command for permanently failing an existing Financial
// Disbursement aggregate.
//
// Failure represents a terminal lifecycle transition to FAILED.
//
// The command carries:
//
// - the public identity of the Financial Disbursement;
// - the failure reason;
// - application-level correlation metadata.
//
// The application handler is responsible for:
//
// - loading the Financial Disbursement aggregate;
// - invoking the aggregate failure behavior;
// - persisting the aggregate;
// - publishing the resulting domain event.
//
// The aggregate is responsible for validating that:
//
// - the disbursement is not already terminal;
// - no execution attempt is currently processing;
// - all existing attempts are terminal;
// - no successful execution attempt exists;
// - the failure reason is non-empty;
// - the failure timestamp is valid.
//
// The aggregate then emits FinancialDisbursementFailedEvent.
//
// This command does NOT:
//
// - fail an individual execution attempt;
// - execute or cancel a provider request;
// - move funds;
// - create or post a Financial Transaction;
// - modify Financial Account balances;
// - create another execution attempt.
//
// Individual attempt failure is a separate execution-attempt lifecycle
// operation. Permanent parent failure is an operation on the
// FinancialDisbursementAggregate.
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
 * Command for permanently failing a Financial Disbursement.
 *
 * The command represents the intent to transition the Financial Disbursement
 * into its terminal FAILED state.
 *
 * The failure reason is supplied by the application workflow because the
 * reason explains why the parent disbursement is being permanently failed.
 *
 * The command intentionally does not carry:
 *
 * - lifecycle status;
 * - attempt identity;
 * - amount;
 * - currency;
 * - provider information;
 * - transaction identity.
 *
 * These values belong to the aggregate and are validated by the domain.
 */
export class FailFinancialDisbursementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Disbursement to fail.
     *
     * This is the externally meaningful aggregate identity and remains
     * separate from the internal persistence identity.
     */
    public readonly disbursementPublicId: FinancialDisbursementPublicId,

    /**
     * Reason for permanently failing the Financial Disbursement.
     *
     * The aggregate validates that the reason is not empty or whitespace-only.
     */
    public readonly reason: string,

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
