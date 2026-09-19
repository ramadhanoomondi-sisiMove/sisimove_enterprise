// src/domains/journey-demand/application/handlers/find-journey-demands-by-requester.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Find Journey Demands By Requester Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer query handler for retrieving Journey Demands created by a
// specific requester.
//
// Responsibilities:
// - validate pagination parameters;
// - delegate the requester-based read operation to the
//   JourneyDemandRepository application port;
// - apply offset and limit pagination;
// - return the JourneyDemandEntity collection.
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

import type { FindJourneyDemandsByRequesterQuery } from '../queries/find-journey-demands-by-requester.query';

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
export class FindJourneyDemandsByRequesterQueryHandler implements QueryHandler<
  FindJourneyDemandsByRequesterQuery,
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
    query: FindJourneyDemandsByRequesterQuery,
  ): Promise<JourneyDemandEntity[]> {
    // -------------------------------------------------------------------------
    // Validate Pagination
    // -------------------------------------------------------------------------

    const offset = query.offset ?? 0;
    const limit = query.limit;

    if (!Number.isInteger(offset) || offset < 0) {
      throw new Error(
        'Journey Demand query offset must be a non-negative integer.',
      );
    }

    if (limit !== undefined && (!Number.isInteger(limit) || limit <= 0)) {
      throw new Error('Journey Demand query limit must be a positive integer.');
    }

    // -------------------------------------------------------------------------
    // Query Repository
    // -------------------------------------------------------------------------

    const demands = await this.repository.findJourneyDemandsByRequesterPublicId(
      query.requesterPublicId,
    );

    // -------------------------------------------------------------------------
    // Pagination
    // -------------------------------------------------------------------------

    if (limit === undefined) {
      return demands.slice(offset);
    }

    return demands.slice(offset, offset + limit);
  }
}
