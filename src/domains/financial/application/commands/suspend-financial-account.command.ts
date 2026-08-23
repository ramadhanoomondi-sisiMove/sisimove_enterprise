// -----------------------------------------------------------------------------
// Financial Account — Suspend Command
// -----------------------------------------------------------------------------
//
// Application command for suspending an existing Financial Account aggregate.
//
// The command carries domain-ready identifiers rather than raw transport
// values.
//
// Lifecycle rules remain inside FinancialAccountAggregate:
// - CLOSED accounts cannot be suspended;
// - ACTIVE accounts may be suspended;
// - SUSPENDED accounts are already suspended and suspension is idempotent.
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
 * Command for suspending a Financial Account aggregate.
 *
 * The application handler is responsible for:
 *
 * - loading the Financial Account aggregate;
 * - invoking aggregate.suspend();
 * - persisting the aggregate;
 * - dispatching resulting domain events.
 *
 * The aggregate remains responsible for enforcing lifecycle invariants.
 */
export class SuspendFinancialAccountCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Account to suspend.
     */
    public readonly accountPublicId: FinancialAccountPublicId,

    /**
     * Timestamp at which the suspension is performed.
     */
    public readonly suspendedAt: Date,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * suspension command.
     */
    public readonly causationId?: string,
  ) {}
}
