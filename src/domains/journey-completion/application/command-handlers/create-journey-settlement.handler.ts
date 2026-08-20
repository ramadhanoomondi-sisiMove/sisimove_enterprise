// -----------------------------------------------------------------------------
// Journey Settlement — Create Handler
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

import type { CreateJourneySettlementCommand } from '../commands/create-journey-settlement.command';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import { JourneySettlementAggregate } from '../../domain/aggregates/journey-settlement.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { JourneySettlementEntity } from '../../domain/entities/journey-settlement.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyCompletionJourneyPublicId,
  JourneyCompletionProviderPublicId,
  JourneySettlementPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { JourneySettlementRepository } from '../../domain/repositories/journey-settlement.repository';

// =============================================================================
// Handler
// =============================================================================

/**
 * Application handler for creating a Journey Settlement.
 *
 * Responsibilities:
 *
 * - verify that the Journey Completion does not already have a settlement;
 * - construct settlement-owned value objects from command primitives;
 * - create the Journey Settlement entity;
 * - create the Journey Settlement aggregate;
 * - persist the aggregate;
 * - return the created aggregate.
 *
 * The handler does not perform lifecycle transitions. A newly created
 * Journey Settlement always starts in its domain-defined initial state.
 */
@Injectable()
export class CreateJourneySettlementHandler {
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
    command: CreateJourneySettlementCommand,
  ): Promise<JourneySettlementAggregate> {
    // -------------------------------------------------------------------------
    // Prevent Duplicate Settlement
    // -------------------------------------------------------------------------

    const alreadyExists =
      await this.journeySettlementRepository.existsByCompletionId(
        command.completionId,
      );

    if (alreadyExists) {
      throw new Error(
        `A Journey Settlement already exists for Journey Completion "${command.completionId.toString()}".`,
      );
    }

    // -------------------------------------------------------------------------
    // Construct Domain Value Objects
    // -------------------------------------------------------------------------

    const journeyPublicId = new JourneyCompletionJourneyPublicId(
      command.journeyPublicId,
    );

    const providerPublicId = new JourneyCompletionProviderPublicId(
      command.providerPublicId,
    );

    const settlementPublicId = new JourneySettlementPublicId();

    // -------------------------------------------------------------------------
    // Create Entity
    // -------------------------------------------------------------------------

    const settlement = JourneySettlementEntity.create({
      publicId: settlementPublicId,
      completionId: command.completionId,
      journeyPublicId,
      providerPublicId,
    });

    // -------------------------------------------------------------------------
    // Create Aggregate
    // -------------------------------------------------------------------------

    const aggregate = JourneySettlementAggregate.create(
      settlement,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist
    // -------------------------------------------------------------------------

    await this.journeySettlementRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateJourneySettlementHandler;
