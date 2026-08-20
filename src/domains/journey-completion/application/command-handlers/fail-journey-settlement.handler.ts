// -----------------------------------------------------------------------------
// Journey Settlement — Fail Handler
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

import type { FailJourneySettlementCommand } from '../commands/fail-journey-settlement.command';

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
 * Application handler for failing a Journey Settlement.
 *
 * Responsibilities:
 *
 * - locate the Journey Settlement aggregate;
 * - delegate the failure transition to the aggregate;
 * - persist the changed aggregate.
 *
 * The aggregate remains responsible for:
 *
 * - validating the current lifecycle state;
 * - preventing failure after completion;
 * - preventing duplicate failure;
 * - requiring a failure reason;
 * - applying the FAILED lifecycle transition.
 */
@Injectable()
export class FailJourneySettlementHandler {
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

  public async execute(command: FailJourneySettlementCommand): Promise<void> {
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
    // Fail Settlement
    // -------------------------------------------------------------------------

    aggregate.fail(
      command.failureReason,
      command.correlationId,
      command.causationId,
      command.failedAt,
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

export default FailJourneySettlementHandler;
