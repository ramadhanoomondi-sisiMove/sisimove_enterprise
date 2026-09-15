// src/domains/journey-demand/application/handlers/get-journey-demands.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demands Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for Journey Demand collection discovery.
//
// Query flow:
//
//   GetJourneyDemandsQuery
//             ↓
//   JourneyDemandRepository
//             ↓
//   JourneyDemandEntity[]
//
// JourneyDemandRepository is a TypeScript interface and therefore does not
// exist as a runtime JavaScript value. NestJS must resolve it through the
// explicit Journey Demand repository DI token.
//
// This handler owns only application-level orchestration:
//
// - receives the collection query;
// - delegates persistence to the repository;
// - applies offset/limit pagination;
// - returns Journey Demand domain entities.
//
// It deliberately contains no HTTP, Prisma, authorization, or infrastructure
// concerns.
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

import type { GetJourneyDemandsQuery } from '../queries/get-journey-demands.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandEntity } from '../../domain/entities/journey-demand.entity';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// =============================================================================
// Query Handler
// =============================================================================

/**
 * Handles collection retrieval of Journey Demands.
 *
 * This is the plural collection handler and is intentionally distinct from
 * GetJourneyDemandQueryHandler, which handles a single Journey Demand.
 */
export class GetJourneyDemandsQueryHandler implements QueryHandler<
  GetJourneyDemandsQuery,
  JourneyDemandEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Journey Demand persistence boundary.
     *
     * JourneyDemandRepository is a TypeScript interface and therefore cannot
     * serve as a runtime NestJS dependency-injection token.
     *
     * JOURNEY_DEMAND_TOKENS.REPOSITORY is the runtime token registered by the
     * Journey Demand module and resolved to the infrastructure repository
     * implementation.
     */
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Retrieves the Journey Demand collection and applies query pagination.
   *
   * Pagination is kept at the application boundary because the query contract
   * should not depend on the underlying persistence implementation.
   */
  public async execute(
    query: GetJourneyDemandsQuery,
  ): Promise<JourneyDemandEntity[]> {
    // -------------------------------------------------------------------------
    // Load Journey Demands
    // -------------------------------------------------------------------------
    //
    // Persistence remains behind the repository abstraction. The handler does
    // not know whether the implementation uses Prisma or another datastore.
    //

    const demands = await this.repository.findJourneyDemands();

    // -------------------------------------------------------------------------
    // Normalize Offset
    // -------------------------------------------------------------------------
    //
    // A negative offset has no meaningful collection semantics, so normalize it
    // to zero at the application boundary.
    //

    const offset = Math.max(0, query.offset ?? 0);

    // -------------------------------------------------------------------------
    // Apply Pagination
    // -------------------------------------------------------------------------
    //
    // An omitted limit means:
    //
    //   return everything from the requested offset onward.
    //
    // A supplied limit is normalized to a non-negative value before slicing.
    //

    if (query.limit === undefined) {
      return demands.slice(offset);
    }

    const limit = Math.max(0, query.limit);

    return demands.slice(offset, offset + limit);
  }
}
