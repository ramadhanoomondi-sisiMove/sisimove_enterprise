// -----------------------------------------------------------------------------
// Financial Account — Close Command
// -----------------------------------------------------------------------------
//
// Application command for permanently closing an existing Financial Account
// aggregate.
//
// The command carries domain-ready identifiers rather than raw transport
// values.
//
// Lifecycle rules remain inside FinancialAccountAggregate:
// - CLOSED accounts are already closed and closing is idempotent;
// - ACTIVE accounts may be closed;
// - SUSPENDED accounts may be closed;
// - CLOSED is terminal and cannot be reactivated.
//
// Remaining funds are intentionally NOT handled by this command.
// Any required movement of funds belongs to the appropriate financial
// workflow/aggregate.
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
 * Command for permanently closing a Financial Account aggregate.
 *
 * The application handler is responsible for:
 *
 * - loading the Financial Account aggregate;
 * - invoking aggregate.close();
 * - persisting the aggregate;
 * - dispatching resulting domain events.
 *
 * The aggregate remains responsible for enforcing lifecycle invariants.
 */
export class CloseFinancialAccountCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Account to close.
     */
    public readonly accountPublicId: FinancialAccountPublicId,

    /**
     * Timestamp at which the account is closed.
     */
    public readonly closedAt: Date,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * closure command.
     */
    public readonly causationId?: string,
  ) {}
}
