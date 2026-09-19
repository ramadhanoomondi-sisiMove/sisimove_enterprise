// src/domains/journey-demand/application/handlers/get-journey-demand-participant.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Participant Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer query handler for retrieving a specific Participant
// belonging to a Journey Demand.
//
// Responsibilities:
// - resolve the Journey Demand aggregate from its public identifier;
// - use the aggregate identity to retrieve the Participant by public ID;
// - translate missing Journey Demand or Participant into the appropriate
//   domain-level not-found exception;
// - return the JourneyDemandParticipantEntity.
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
// Journey Demand Application
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetJourneyDemandParticipantQueryHandler implements QueryHandler<
  GetJourneyDemandParticipantQuery,
  JourneyDemandParticipantEntity
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
