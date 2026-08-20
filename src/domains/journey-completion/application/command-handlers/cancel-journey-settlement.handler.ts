// -----------------------------------------------------------------------------
// Journey Settlement — Cancel Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_SETTLEMENT_TOKENS } from '../journey-settlement.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CancelJourneySettlementCommand } from '../commands/cancel-journey-settlement.command';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { JourneySettlementRepository } from '../../domain/repositories/journey-settlement.repository';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { JourneySettlementInvariantException } from '../../domain/exceptions';

// =============================================================================
// Handler
// =============================================================================

/**
 * Application handler for cancelling a Journey Settlement.
 *
 * Responsibilities:
 *
 * - locate the Journey Settlement aggregate;
 * - delegate the cancellation transition to the aggregate;
 * - persist the changed aggregate.
 *
 * The aggregate remains responsible for validating whether the settlement
 * can transition to CANCELLED.
 */
@Injectable()
export class CancelJourneySettlementHandler {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_SETTLEMENT_TOKENS.REPOSITORY)
    private readonly journeySettlementRepository: JourneySettlementRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(command: CancelJourneySettlementCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.journeySettlementRepository.findByPublicId(
      command.journeySettlementPublicId,
    );

    if (aggregate === null) {
      throw new JourneySettlementInvariantException(
        `Journey Settlement "${command.journeySettlementPublicId.value}" was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Cancel Settlement
    // -------------------------------------------------------------------------

    aggregate.cancel(
      command.correlationId,
      command.causationId,
      command.cancelledAt,
    );

    // -------------------------------------------------------------------------
    // Persist
    // -------------------------------------------------------------------------

    await this.journeySettlementRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CancelJourneySettlementHandler;
