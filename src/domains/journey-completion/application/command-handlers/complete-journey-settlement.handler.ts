// -----------------------------------------------------------------------------
// Journey Settlement — Complete Handler
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

import type { CompleteJourneySettlementCommand } from '../commands/complete-journey-settlement.command';

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
 * Application handler for completing a Journey Settlement.
 *
 * Responsibilities:
 *
 * - locate the Journey Settlement aggregate;
 * - delegate completion to the aggregate;
 * - persist the changed aggregate.
 *
 * The aggregate remains responsible for:
 *
 * - validating the PROCESSING state;
 * - preventing completion of an already completed settlement;
 * - preventing completion of a failed settlement;
 * - preventing completion of a cancelled settlement;
 * - requiring a Financial Transaction public identity.
 */
@Injectable()
export class CompleteJourneySettlementHandler {
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

  public async execute(
    command: CompleteJourneySettlementCommand,
  ): Promise<void> {
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
    // Complete Settlement
    // -------------------------------------------------------------------------

    aggregate.complete(
      command.financialTransactionPublicId,
      command.correlationId,
      command.causationId,
      command.completedAt,
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

export default CompleteJourneySettlementHandler;
