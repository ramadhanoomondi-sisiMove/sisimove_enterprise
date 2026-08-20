// -----------------------------------------------------------------------------
// Journey Settlement — Create Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for creating a Journey Settlement.
 *
 * Transport/application input remains primitive at the command boundary.
 * The handler is responsible for constructing validated domain value objects.
 */
export class CreateJourneySettlementCommand implements Command {
  // ===========================================================================

  constructor(
    /**
     * Internal identity of the owning Journey Completion aggregate.
     */
    public readonly completionId: UniqueEntityId,

    /**
     * Public identity of the Journey associated with the settlement.
     */
    public readonly journeyPublicId: string,

    /**
     * Public identity of the Provider associated with the settlement.
     */
    public readonly providerPublicId: string,

    /**
     * Correlation identifier for tracing.
     */
    public readonly correlationId: string,

    /**
     * Optional causation identifier.
     */
    public readonly causationId?: string,
  ) {}
}
