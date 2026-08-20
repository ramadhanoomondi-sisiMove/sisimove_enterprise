// -----------------------------------------------------------------------------
// Journey Settlement — Submit Command
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
 * Command for submitting a Journey Settlement for financial processing.
 *
 * The Journey Settlement aggregate is responsible for validating that the
 * settlement is currently in the PENDING state before transitioning it to
 * SUBMITTED.
 *
 * The command carries the settlement identity and execution metadata only.
 * Lifecycle validation remains inside the aggregate.
 */
export class SubmitJourneySettlementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    public readonly journeySettlementPublicId: JourneySettlementPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
    public readonly submittedAt?: Date,
  ) {}
}
