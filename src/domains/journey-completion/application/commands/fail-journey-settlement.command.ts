// -----------------------------------------------------------------------------
// Journey Settlement — Fail Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneySettlementFailureReason,
  JourneySettlementPublicId,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for marking a Journey Settlement as failed.
 *
 * The Journey Settlement aggregate is responsible for determining whether
 * the settlement can transition to FAILED and whether a valid failure reason
 * has been supplied.
 *
 * The command carries the settlement identity, failure reason, and execution
 * metadata only.
 *
 * Lifecycle validation remains inside the aggregate.
 */
export class FailJourneySettlementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    public readonly journeySettlementPublicId: JourneySettlementPublicId,
    public readonly failureReason: JourneySettlementFailureReason,
    public readonly correlationId: string,
    public readonly causationId?: string,
    public readonly failedAt?: Date,
  ) {}
}
