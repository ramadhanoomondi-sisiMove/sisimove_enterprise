// -----------------------------------------------------------------------------
// Journey Settlement — Complete Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneySettlementFinancialTransactionPublicId,
  JourneySettlementPublicId,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for completing a Journey Settlement.
 *
 * The Journey Settlement aggregate is responsible for determining whether
 * the settlement is currently in PROCESSING state and whether a valid
 * Financial Transaction public identity has been supplied.
 *
 * The command carries the settlement identity, the Financial Transaction
 * reference, and execution metadata only.
 *
 * Lifecycle validation remains inside the aggregate.
 */
export class CompleteJourneySettlementCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    public readonly journeySettlementPublicId: JourneySettlementPublicId,
    public readonly financialTransactionPublicId: JourneySettlementFinancialTransactionPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
    public readonly completedAt?: Date,
  ) {}
}
