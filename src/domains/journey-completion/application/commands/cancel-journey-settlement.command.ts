// -----------------------------------------------------------------------------
// Journey Settlement — Cancel Command
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
 * Command for cancelling a Journey Settlement.
 *
 * The Journey Settlement aggregate is responsible for determining whether
 * the settlement can transition to CANCELLED.
 *
 * The command carries the settlement identity and execution metadata only.
 * Lifecycle validation remains inside the aggregate.
 */
export class CancelJourneySettlementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    public readonly journeySettlementPublicId: JourneySettlementPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
    public readonly cancelledAt?: Date,
  ) {}
}
