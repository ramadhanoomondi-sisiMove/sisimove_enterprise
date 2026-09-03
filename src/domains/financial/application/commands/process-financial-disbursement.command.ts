// -----------------------------------------------------------------------------
// Financial Disbursement — Process Command
// -----------------------------------------------------------------------------
//
// Application command for beginning processing of an existing Financial
// Disbursement aggregate.
//
// Processing represents the domain lifecycle transition:
//
// PENDING → PROCESSING
//
// The command carries the identity of the Financial Disbursement to process
// together with application-level correlation metadata.
//
// The application handler is responsible for:
//
// - loading the Financial Disbursement aggregate;
// - resolving its associated Financial Disbursement Destination;
// - invoking the aggregate lifecycle behavior;
// - persisting the aggregate;
// - publishing the resulting domain event.
//
// The aggregate is responsible for:
//
// - validating that the disbursement is currently PENDING;
// - validating destination ownership;
// - validating destination eligibility;
// - transitioning the disbursement to PROCESSING;
// - emitting FinancialDisbursementProcessingEvent.
//
// This command does NOT:
//
// - execute a provider API;
// - create a Financial Disbursement Attempt;
// - select a provider;
// - perform provider routing;
// - move funds;
// - create a Financial Transaction;
// - modify Financial Account balances.
//
// Provider communication belongs to the Integration boundary.
// Financial Transaction creation/posting belongs to the Financial Transaction
// boundary.
// Financial Account balance mutation belongs to the Financial Account
// boundary.
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
 * Command for beginning processing of a Financial Disbursement.
 *
 * The command represents the intent to transition an existing Financial
 * Disbursement from PENDING to PROCESSING.
 *
 * The command intentionally contains only the public identity required to
 * resolve the aggregate. All lifecycle validation and state mutation remain
 * inside FinancialDisbursementAggregate.
 *
 * No internal persistence identifier is supplied.
 */
export class ProcessFinancialDisbursementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Disbursement to process.
     *
     * This is the externally meaningful identity of the aggregate and must
     * remain separate from its internal persistence identity.
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
