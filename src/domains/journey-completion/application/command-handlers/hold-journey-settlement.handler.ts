// -----------------------------------------------------------------------------
// Journey Settlement — Hold Handler
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

import type { HoldJourneySettlementCommand } from '../commands/hold-journey-settlement.command';

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
 * Application handler for placing a Journey Settlement on hold.
 *
 * Responsibilities:
 *
 * - locate the Journey Settlement aggregate;
 * - delegate the hold transition to the aggregate;
 * - persist the changed aggregate.
 *
 * The aggregate remains responsible for validating whether the settlement
 * can transition to HELD.
 */
@Injectable()
export class HoldJourneySettlementHandler {
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

  public async execute(command: HoldJourneySettlementCommand): Promise<void> {
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
    // Hold Settlement
    // -------------------------------------------------------------------------

    aggregate.hold(command.correlationId, command.causationId, command.heldAt);

    // -------------------------------------------------------------------------
    // Persist
    // -------------------------------------------------------------------------

    await this.journeySettlementRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default HoldJourneySettlementHandler;
