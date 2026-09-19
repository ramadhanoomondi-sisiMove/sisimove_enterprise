// src/domains/journey-demand/application/handlers/find-matchable-journey-demands.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Find Matchable Journey Demands Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer query handler for retrieving Journey Demands that are
// currently eligible for matching.
//
// A Journey Demand is considered matchable at this query boundary when its
// lifecycle status is OPEN.
//
// Responsibilities:
// - validate pagination parameters;
// - construct the domain status value object representing OPEN;
// - delegate the status-based read operation to the
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

import type { FindMatchableJourneyDemandsQuery } from '../queries/find-matchable-journey-demands.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandEntity } from '../../domain/entities/journey-demand.entity';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Journey Demand Status
// -----------------------------------------------------------------------------

import {
  JourneyDemandStatus,
  JourneyDemandStatusValueObject,
} from '../../domain/value-objects/journey-demand-status.vo';

// -----------------------------------------------------------------------------
// Journey Demand Application
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

@Injectable()
export class FindMatchableJourneyDemandsQueryHandler implements QueryHandler<
  FindMatchableJourneyDemandsQuery,
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
    query: FindMatchableJourneyDemandsQuery,
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
    // Matchable Status
    // -------------------------------------------------------------------------
    //
    // OPEN is the lifecycle state in which a Journey Demand can participate
    // in the matching process.
    //
    // The domain value object is constructed here rather than passing the
    // primitive status value directly to the repository. This preserves the
    // application/domain boundary used by the repository contract.
    //
    const openStatus = new JourneyDemandStatusValueObject(
      JourneyDemandStatus.OPEN,
    );

    // -------------------------------------------------------------------------
    // Query Repository
    // -------------------------------------------------------------------------

    const demands =
      await this.repository.findJourneyDemandsByStatus(openStatus);

    // -------------------------------------------------------------------------
    // Pagination
    // -------------------------------------------------------------------------

    if (limit === undefined) {
      return demands.slice(offset);
    }

    return demands.slice(offset, offset + limit);
  }
}
