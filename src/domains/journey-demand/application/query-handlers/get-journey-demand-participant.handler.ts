// src/domains/journey-demand/application/handlers/get-journey-demand-participant.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyDemandParticipantQuery } from '../queries/get-journey-demand-participant.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandParticipantEntity } from '../../domain/entities/journey-demand-participant.entity';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneyDemandParticipantQueryHandler implements QueryHandler<
  GetJourneyDemandParticipantQuery,
  JourneyDemandParticipantEntity
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyDemandRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyDemandParticipantQuery,
  ): Promise<JourneyDemandParticipantEntity> {
    // -------------------------------------------------------------------------
    // Load Journey Demand Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.journeyDemandPublicId,
    );

    // -------------------------------------------------------------------------
    // Validate Journey Demand
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Load Participant
    //
    // JourneyDemandAggregate exposes its internal aggregate identity through
    // aggregateId. There is intentionally no journeyDemandId property.
    // -------------------------------------------------------------------------

    const participant = await this.repository.findParticipantByPublicId(
      aggregate.aggregateId,
      query.participantPublicId,
    );

    // -------------------------------------------------------------------------
    // Validate Participant
    // -------------------------------------------------------------------------

    if (participant === null) {
      throw new JourneyDemandNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return participant;
  }
}
