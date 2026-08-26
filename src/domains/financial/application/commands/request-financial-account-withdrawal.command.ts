// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Request Command
// -----------------------------------------------------------------------------
//
// Application command for requesting a Financial Account Withdrawal.
//
// The command carries domain-ready value objects rather than raw transport
// values.
//
// DTO-to-domain conversion belongs to the presentation/application boundary.
//
// A newly requested Financial Account Withdrawal consists of:
//
// FinancialAccountWithdrawalAggregate
// └── FinancialAccountWithdrawalEntity
//
// The command establishes:
//
// - source Financial Account;
// - withdrawal amount;
// - selected withdrawal destination;
// - optional originating business reference.
//
// Destination policy:
//
// The withdrawal must always have a destination.
//
// The application layer may obtain that destination from:
//
// - an explicitly selected destination; or
// - the Financial Account's configured/default destination.
//
// By the time this command is constructed, the destination has already been
// selected and is therefore required.
//
// FinancialAccountWithdrawalDestination is a domain value object owned by the
// Financial domain.
//
// There is intentionally NO FinancialDisbursementDestinationRepository in
// this command.
//
// The destination value object represents the selected destination snapshot
// carried by the withdrawal request. The later Financial Disbursement workflow
// consumes that information when executing the external payout.
//
// This command does NOT:
//
// - Process the withdrawal.
// - Create a Financial Disbursement.
// - Execute a disbursement provider.
// - Move funds.
// - Modify Financial Account balances.
// - Create a Financial Transaction.
// - Perform settlement.
// - Perform accounting.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  FinancialAccountPublicId,
  FinancialAccountWithdrawalDestination,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for requesting a Financial Account Withdrawal.
 *
 * The command contains all domain information required to create the
 * withdrawal request.
 */
export class RequestFinancialAccountWithdrawalCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the source Financial Account.
     */
    public readonly accountId: FinancialAccountPublicId,

    /**
     * Monetary amount requested for withdrawal.
     *
     * Money owns both amount and currency.
     */
    public readonly amount: Money,

    /**
     * Selected external withdrawal destination.
     *
     * The destination is a domain value object representing the destination
     * snapshot captured by the withdrawal request.
     *
     * It is required because every withdrawal must identify where the funds
     * are intended to be sent.
     *
     * If the user has a configured/default destination, the application
     * boundary must resolve and convert it into this value object before
     * constructing the command.
     */
    public readonly destination: FinancialAccountWithdrawalDestination,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional type of the originating business reference.
     *
     * When supplied, referencePublicId must also be supplied.
     */
    public readonly referenceType?: FinancialReferenceType,

    /**
     * Optional public identity of the originating business object.
     *
     * When supplied, referenceType must also be supplied.
     */
    public readonly referencePublicId?: FinancialReferencePublicId,

    /**
     * Optional identifier of the command or operation that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RequestFinancialAccountWithdrawalCommand;
