// -----------------------------------------------------------------------------
// Journey Settlement — Hold Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneySettlementPublicId } from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for placing a Journey Settlement on hold.
 *
 * The Journey Settlement aggregate is responsible for determining whether
 * the settlement can transition to HELD.
 *
 * The command carries the settlement identity and execution metadata only.
 * Lifecycle validation remains inside the aggregate.
 */
export class HoldJourneySettlementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    public readonly journeySettlementPublicId: JourneySettlementPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
    public readonly heldAt?: Date,
  ) {}
}
