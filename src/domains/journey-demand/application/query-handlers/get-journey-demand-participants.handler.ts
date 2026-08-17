// src/domains/journey-demand/application/handlers/get-journey-demand-participants.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyDemandParticipantsQuery } from '../queries/get-journey-demand-participants.query';

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

export class GetJourneyDemandParticipantsQueryHandler implements QueryHandler<
  GetJourneyDemandParticipantsQuery,
  JourneyDemandParticipantEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyDemandRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyDemandParticipantsQuery,
  ): Promise<JourneyDemandParticipantEntity[]> {
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
    // Load Participants
    //
    // The query does not define a participant status filter. Therefore this
    // handler returns all participants belonging to the Journey Demand.
    // -------------------------------------------------------------------------

    return this.repository.findParticipants(aggregate.aggregateId);
  }
}
