// -----------------------------------------------------------------------------
// Financial Account Hold — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating a Financial Account Hold aggregate.
//
// A Financial Account Hold represents a reservation of funds against a
// Financial Account.
//
// Aggregate:
//
// FinancialAccountHoldAggregate
// └── FinancialAccountHoldEntity
//
// The command carries domain-ready value objects rather than raw transport
// values.
//
// DTO-to-domain conversion belongs to the presentation/application boundary.
//
// This command represents the intent to establish a Financial Account Hold.
// It does NOT:
//
// - Modify Financial Account balances.
// - Create a Financial HOLD transaction.
// - Execute a Financial HOLD transaction.
// - Move money.
// - Communicate with payment providers.
//
// The application workflow is responsible for coordinating the hold creation
// with the associated Financial HOLD transaction.
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
  FinancialAccountHeldAmount,
  FinancialHoldReference,
  FinancialHoldExpiry,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for creating a Financial Account Hold aggregate.
 *
 * The command represents the application-level intent to establish a new
 * reservation against a Financial Account.
 *
 * Required domain inputs:
 *
 * - accountPublicId
 * - amount
 * - correlationId
 *
 * Optional domain inputs:
 *
 * - reference
 * - expiresAt
 * - causationId
 *
 * The initial lifecycle status is determined by the domain creation policy
 * and is therefore intentionally NOT supplied by the command.
 *
 * The hold-establishing Financial Transaction is also NOT supplied as a
 * transaction aggregate. Its creation/execution belongs to the appropriate
 * application workflow.
 */
export class CreateFinancialAccountHoldCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Account against which the funds are
     * reserved.
     *
     * This is an opaque cross-aggregate reference to the Financial Account
     * aggregate.
     */
    public readonly accountPublicId: FinancialAccountPublicId,

    /**
     * Amount to be reserved by the hold.
     *
     * Uses the specialized FinancialAccountHeldAmount value object because
     * Financial Account Holds model the held amount separately from generic
     * Money.
     */
    public readonly amount: FinancialAccountHeldAmount,

    /**
     * Optional business reference that caused the hold.
     *
     * Examples may include a Booking, Journey, payment obligation, or another
     * Financial-domain-supported business reference.
     */
    public readonly reference: FinancialHoldReference | undefined,

    /**
     * Optional expiry for the hold.
     *
     * When supplied, the hold becomes eligible for expiry processing after
     * this point in time.
     */
    public readonly expiresAt: FinancialHoldExpiry | undefined,

    /**
     * Correlation identifier for the command and resulting domain events.
     *
     * This parameter MUST precede causationId because causationId is optional.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {}
}
