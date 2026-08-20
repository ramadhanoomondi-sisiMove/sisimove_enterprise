// -----------------------------------------------------------------------------
// Journey Settlement — Submit Handler
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

import type { SubmitJourneySettlementCommand } from '../commands/submit-journey-settlement.command';

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
 * Application handler for submitting a Journey Settlement.
 *
 * Responsibilities:
 *
 * - locate the Journey Settlement aggregate;
 * - delegate the lifecycle transition to the aggregate;
 * - persist the changed aggregate.
 *
 * The aggregate remains responsible for validating whether the settlement
 * can transition from PENDING to SUBMITTED.
 */
@Injectable()
export class SubmitJourneySettlementHandler {
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

  public async execute(command: SubmitJourneySettlementCommand): Promise<void> {
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
    // Submit
    // -------------------------------------------------------------------------

    aggregate.submit(
      command.correlationId,
      command.causationId,
      command.submittedAt,
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

export default SubmitJourneySettlementHandler;
