// -----------------------------------------------------------------------------
// Financial Disbursement — Cancel Command
// -----------------------------------------------------------------------------
//
// Application command for cancelling an existing Financial Disbursement
// aggregate.
//
// Cancellation represents an internal Financial-domain lifecycle transition
// to the terminal CANCELLED state.
//
// Cancellation does NOT claim that an external provider cancelled an already-
// submitted request.
//
// The command carries:
//
// - the public identity of the Financial Disbursement;
// - application-level correlation metadata.
//
// The application handler is responsible for:
//
// - loading the Financial Disbursement aggregate;
// - resolving its associated destination;
// - invoking the aggregate cancellation behavior;
// - persisting the aggregate;
// - publishing the resulting domain event.
//
// The aggregate is responsible for validating that:
//
// - the disbursement is not already terminal;
// - no execution attempt is currently processing;
// - all existing attempts are terminal;
// - no successful execution attempt exists;
// - the cancellation timestamp is valid.
//
// The aggregate then emits FinancialDisbursementCancelledEvent.
//
// This command does NOT:
//
// - cancel an individual execution attempt;
// - call an external provider;
// - claim provider-side cancellation;
// - move funds;
// - create or post a Financial Transaction;
// - modify Financial Account balances;
// - create another execution attempt.
//
// Provider communication belongs to the Integration boundary.
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
 * Command for cancelling a Financial Disbursement.
 *
 * The command represents the intent to transition the Financial Disbursement
 * into its terminal CANCELLED state.
 *
 * Cancellation is an internal Financial-domain lifecycle decision and does
 * not represent a provider-side cancellation.
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
export class CancelFinancialDisbursementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Disbursement to cancel.
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
