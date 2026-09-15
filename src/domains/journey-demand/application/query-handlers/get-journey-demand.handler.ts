// src/domains/journey-demand/application/handlers/get-journey-demand.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving a single Journey Demand.
//
// The handler coordinates the application-level query:
//
//   GetJourneyDemandQuery
//             ↓
//   JourneyDemandRepository
//             ↓
//   JourneyDemandAggregate | null
//
// The query carries the internal JourneyDemandId value object. The handler
// passes that domain identifier to the repository without converting it into
// an HTTP parameter or persistence-specific representation.
//
// The repository is a domain interface and therefore has no runtime JavaScript
// representation. NestJS must consequently resolve it through the explicit
// Journey Demand repository DI token.
//
// This handler deliberately contains only application orchestration:
//
// - receives the single Journey Demand query;
// - delegates retrieval to the repository;
// - returns the Journey Demand aggregate or null.
//
// It does not contain HTTP concerns, authorization rules, Prisma logic, or
// presentation concerns.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyDemandQuery } from '../queries/get-journey-demand.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandAggregate } from '../../domain/aggregates/journey-demand.aggregate';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// =============================================================================
// Query Handler
// =============================================================================

export class GetJourneyDemandQueryHandler implements QueryHandler<
  GetJourneyDemandQuery,
  JourneyDemandAggregate | null
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Journey Demand persistence boundary.
     *
     * JourneyDemandRepository is a TypeScript interface and therefore cannot
     * be used directly as a runtime NestJS dependency-injection token.
     *
     * JOURNEY_DEMAND_TOKENS.REPOSITORY is the explicit runtime token that
     * connects this application handler to the infrastructure repository
     * implementation registered by JourneyDemandModule.
     */
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyDemandQuery,
  ): Promise<JourneyDemandAggregate | null> {
    // -------------------------------------------------------------------------
    // Load Journey Demand
    // -------------------------------------------------------------------------
    //
    // The query already contains the validated domain identifier as a value
    // object. Pass it directly to the repository boundary.
    //
    // The handler does not unwrap the value object or construct a persistence
    // identifier. That responsibility belongs to the repository implementation.
    //

    return this.repository.findById(query.journeyDemandId);
  }
}
