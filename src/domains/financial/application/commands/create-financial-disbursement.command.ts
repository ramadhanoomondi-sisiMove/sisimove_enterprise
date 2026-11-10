// -----------------------------------------------------------------------------
// Financial Disbursement — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating a Financial Disbursement aggregate.
//
// The command carries domain-ready value objects rather than raw transport
// values.
//
// DTO-to-domain conversion belongs to the presentation/application boundary.
//
// A newly created Financial Disbursement consists of:
//
// FinancialDisbursementAggregate
// └── FinancialDisbursementEntity
//     └── FinancialAccountWithdrawalDestination (immutable snapshot)
//
// FinancialDisbursementAttemptEntity[] is NOT created by this command.
//
// Attempts belong to the Financial Disbursement lifecycle after processing
// begins.
//
// -----------------------------------------------------------------------------
//
// Creation responsibilities:
//
// - Identify the source Financial Account.
// - Carry the withdrawal destination snapshot.
// - Define the amount and currency to be disbursed.
// - Optionally associate an originating business reference.
// - Optionally associate the originating Financial Account Withdrawal.
//
// The originating withdrawal public ID provides an idempotent link between
// the withdrawal and the disbursement.
//
// The initial lifecycle status is determined by the domain creation policy
// and is therefore intentionally NOT supplied by the command.
//
// This command does NOT:
//
// - execute a provider;
// - create a disbursement attempt;
// - move funds;
// - create a Financial Transaction;
// - modify Financial Account balances;
// - modify a configured Financial Disbursement Destination;
// - select provider routing;
// - determine retry policy.
//
// Those responsibilities belong to their respective domain, application,
// integration, and account boundaries.
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
 * Command for creating a Financial Disbursement aggregate.
 *
 * The command represents the intent to create a new Financial Disbursement.
 *
 * Required domain inputs:
 *
 * - sourceAccountPublicId
 * - destination
 * - amount
 * - correlationId
 *
 * Optional domain inputs:
 *
 * - referenceType
 * - referencePublicId
 * - causationId
 * - withdrawalPublicId
 *
 * The destination is an immutable snapshot supplied with the withdrawal.
 * It does not identify or require a previously registered destination.
 *
 * withdrawalPublicId identifies the originating Financial Account Withdrawal
 * when this disbursement is created as part of a withdrawal workflow.
 *
 * It is persisted as an opaque public ID reference and must be unique when
 * supplied. It is not a configured destination ID or a database relation.
 *
 * The initial Financial Disbursement status is determined by the domain
 * creation policy and is therefore intentionally NOT supplied by the command.
 *
 * Execution attempts are also intentionally NOT supplied. They are created
 * later as part of the disbursement processing lifecycle.
 */
export class CreateFinancialDisbursementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the source Financial Account.
     *
     * This is an opaque Financial-domain identity and must not expose the
     * internal persistence identifier.
     */
    public readonly sourceAccountPublicId: FinancialAccountPublicId,

    /**
     * Immutable destination snapshot supplied with the withdrawal.
     *
     * The destination is not resolved through a configured destination
     * repository and is not required to belong to a registered destination
     * record.
     */
    public readonly destination: FinancialAccountWithdrawalDestination,

    /**
     * Monetary amount to be disbursed.
     *
     * Money keeps amount and currency inseparable inside the domain.
     */
    public readonly amount: Money,

    /**
     * Optional originating business reference type.
     *
     * When supplied, referencePublicId must also be supplied.
     */
    public readonly referenceType: FinancialReferenceType | undefined,

    /**
     * Optional public identity of the originating business object.
     *
     * When supplied, referenceType must also be supplied.
     */
    public readonly referencePublicId: FinancialReferencePublicId | undefined,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * command.
     */
    public readonly causationId?: string,

    /**
     * Optional public identity of the originating Financial Account Withdrawal.
     *
     * When supplied, this value links the disbursement to the withdrawal
     * that initiated its creation.
     *
     * The value is an opaque public ID, not a Prisma internal ID.
     *
     * It must be persisted on the disbursement and protected by a unique
     * database constraint to prevent duplicate disbursements for the same
     * withdrawal.
     */
    public readonly withdrawalPublicId?: string,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateFinancialDisbursementCommand;
