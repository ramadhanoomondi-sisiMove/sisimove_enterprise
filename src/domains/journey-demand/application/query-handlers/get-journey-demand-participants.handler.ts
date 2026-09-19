// src/domains/journey-demand/application/handlers/get-journey-demand-participants.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Participants Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer query handler for retrieving all Participants belonging
// to a Journey Demand.
//
// Responsibilities:
// - resolve the Journey Demand aggregate from its public identifier;
// - use the aggregate identity to retrieve its Participants;
// - translate a missing Journey Demand into the appropriate domain-level
//   not-found exception;
// - return the JourneyDemandParticipantEntity collection.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - perform authentication;
// - perform authorization;
// - instantiate a repository;
// - expose Prisma models.
//
// Dependency injection is resolved through Journey Demand application tokens.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

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
// Journey Demand Application
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetJourneyDemandParticipantsQueryHandler implements QueryHandler<
  GetJourneyDemandParticipantsQuery,
  JourneyDemandParticipantEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

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
