// src/domains/journey/application/query-handlers/journey/get-journey-waypoint.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';
import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyWaypointQuery } from '../../queries/journey/get-journey-waypoint.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyWaypointEntity } from '../../../domain/entities/journey-waypoint.entity';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetJourneyWaypointQueryHandler implements QueryHandler<
  GetJourneyWaypointQuery,
  JourneyWaypointEntity | null
> {
  constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  async execute(
    query: GetJourneyWaypointQuery,
  ): Promise<JourneyWaypointEntity | null> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Waypoint
    //
    // Waypoints belong to the Journey corridor and are therefore resolved
    // within the Journey aggregate boundary.
    // -------------------------------------------------------------------------

    return this.repository.findWaypointByPublicId(
      aggregate.journeyId,
      query.waypointPublicId,
    );
  }
}
