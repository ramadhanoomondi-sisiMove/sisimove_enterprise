// -----------------------------------------------------------------------------
// Financial Payment — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating a Financial Payment aggregate.
//
// The command carries domain-ready value objects rather than raw transport
// values.
//
// DTO-to-domain conversion belongs to the presentation/application boundary.
//
// A newly created Financial Payment consists of:
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// Payment attempts are intentionally NOT created by this command.
// Provider execution attempts are created later through the payment lifecycle.
//
// The command establishes the payment intent and its originating business
// reference, when applicable.
//
// This command does NOT:
// - Execute a payment provider.
// - Create a payment attempt.
// - Move funds.
// - Create a Financial Transaction.
// - Modify Financial Account balances.
// - Perform settlement.
// - Perform accounting.
//
// Those responsibilities belong to their respective application,
// integration, transaction, settlement, and accounting boundaries.
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
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
  FinancialPaymentMethodPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Foundation Value Objects
// -----------------------------------------------------------------------------

import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for creating a Financial Payment aggregate.
 *
 * The command represents the intent to create a Financial Payment.
 *
 * Required domain inputs:
 *
 * - accountId
 * - amount
 *
 * Optional domain inputs:
 *
 * - payment method
 * - originating business reference
 *
 * The initial Financial Payment lifecycle status is determined by the domain
 * creation policy and is therefore intentionally NOT supplied by the command.
 *
 * Payment attempts are also intentionally excluded. An attempt represents an
 * actual provider execution and belongs to a subsequent application workflow.
 *
 * Correlation and causation identifiers are carried for application-level
 * tracing and domain-event correlation.
 */
export class CreateFinancialPaymentCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Account receiving the payment.
     *
     * This is an opaque reference to the Financial Account aggregate.
     */
    public readonly accountId: PublicEntityId,

    /**
     * Monetary amount of the Financial Payment.
     */
    public readonly amount: Money,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional Financial Payment Method selected for this payment.
     */
    public readonly methodId?: FinancialPaymentMethodPublicId,

    /**
     * Optional type of the originating business reference.
     */
    public readonly referenceType?: FinancialReferenceType,

    /**
     * Optional public identity of the originating business object.
     */
    public readonly referencePublicId?: FinancialReferencePublicId,

    /**
     * Optional identifier of the command or operation that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {}
}
