// -----------------------------------------------------------------------------
// Financial Account — Activate Command
// -----------------------------------------------------------------------------
//
// Application command for activating an existing Financial Account aggregate.
//
// The command carries domain-ready identifiers rather than raw transport
// values.
//
// Lifecycle rules remain inside FinancialAccountAggregate:
// - CLOSED accounts cannot be reactivated;
// - SUSPENDED accounts may be activated;
// - ACTIVE accounts are already active and activation is idempotent.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for activating a Financial Account aggregate.
 *
 * The application handler is responsible for:
 *
 * - loading the Financial Account aggregate;
 * - invoking aggregate.activate();
 * - persisting the aggregate;
 * - dispatching resulting domain events.
 *
 * The aggregate remains responsible for enforcing lifecycle invariants.
 */
export class ActivateFinancialAccountCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Account to activate.
     */
    public readonly accountPublicId: FinancialAccountPublicId,

    /**
     * Timestamp at which the activation is performed.
     */
    public readonly activatedAt: Date,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * activation command.
     */
    public readonly causationId?: string,
  ) {}
}
