// -----------------------------------------------------------------------------
// Journey Settlement — Process Command
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
 * Command for marking a Journey Settlement as being processed.
 *
 * The Journey Settlement aggregate is responsible for determining whether
 * the settlement can transition from SUBMITTED to PROCESSING.
 *
 * The command carries the settlement identity and execution metadata only.
 * Lifecycle validation remains inside the aggregate.
 */
export class ProcessJourneySettlementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    public readonly journeySettlementPublicId: JourneySettlementPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
    public readonly processingAt?: Date,
  ) {}
}
