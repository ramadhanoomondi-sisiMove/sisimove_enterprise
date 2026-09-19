// src/domains/journey-demand/application/handlers/get-my-journey-demands.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get My Journey Demands Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer query handler for retrieving Journey Demands belonging to
// the authenticated requester.
//
// Responsibilities:
// - delegate the requester-based read operation to the
//   JourneyDemandRepository application port;
// - apply offset and limit pagination to the repository result;
// - return the JourneyDemandEntity collection.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - resolve the authenticated identity;
// - perform authentication;
// - perform authorization;
// - instantiate a repository;
// - expose Prisma models.
//
// The presentation layer determines the requester public ID from the
// authenticated JWT identity and passes it into the application query.
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

import type { GetMyJourneyDemandsQuery } from '../queries/get-my-journey-demands.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandEntity } from '../../domain/entities/journey-demand.entity';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Journey Demand Application
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetMyJourneyDemandsQueryHandler implements QueryHandler<
  GetMyJourneyDemandsQuery,
  JourneyDemandEntity[]
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
    query: GetMyJourneyDemandsQuery,
  ): Promise<JourneyDemandEntity[]> {
    // -------------------------------------------------------------------------
    // Load Journey Demands belonging to requester
    // -------------------------------------------------------------------------

    const demands = await this.repository.findJourneyDemandsByRequesterPublicId(
      query.requesterPublicId,
    );

    // -------------------------------------------------------------------------
    // Pagination
    // -------------------------------------------------------------------------

    const offset = Math.max(0, query.offset ?? 0);

    if (query.limit === undefined) {
      return demands.slice(offset);
    }

    const limit = Math.max(0, query.limit);

    return demands.slice(offset, offset + limit);
  }
}
