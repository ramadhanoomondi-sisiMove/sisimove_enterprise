// src/domains/journey-demand/application/handlers/get-my-journey-demand.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get My Journey Demand Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving one Journey Demand belonging to the
// authenticated requester.
//
// Query flow:
//
//   GetMyJourneyDemandQuery
//             ↓
//   JourneyDemandRepository
//             ↓
//   JourneyDemandEntity | null
//
// Ownership is enforced by the repository lookup:
//
//   requesterPublicId + journeyDemandPublicId
//
// The handler therefore never loads an arbitrary Journey Demand and performs
// an ownership check afterward.
//
// This handler owns only application-level orchestration:
//
// - receives the owner-detail query;
// - delegates the ownership-scoped lookup to the repository;
// - returns the Journey Demand root entity or null.
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

import type { GetMyJourneyDemandQuery } from '../queries/get-my-journey-demand.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandEntity } from '../../domain/entities/journey-demand.entity';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// =============================================================================
// Query Handler
// =============================================================================

/**
 * Handles retrieval of one Journey Demand belonging to the authenticated
 * requester.
 *
 * This is the singular owner-detail handler and is intentionally distinct from
 * GetMyJourneyDemandsQueryHandler, which handles the authenticated collection.
 */
export class GetMyJourneyDemandQueryHandler implements QueryHandler<
  GetMyJourneyDemandQuery,
  JourneyDemandEntity | null
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
   * Retrieves one Journey Demand belonging to the requester.
   *
   * The requester identity and Journey Demand public ID are both supplied to
   * the repository so ownership is enforced as part of the lookup.
   *
   * A null result intentionally represents both:
   *
   * - a missing Journey Demand; and
   * - a Journey Demand that does not belong to the requester.
   *
   * The application boundary therefore does not disclose ownership of another
   * requester's Journey Demand.
   */
  public async execute(
    query: GetMyJourneyDemandQuery,
  ): Promise<JourneyDemandEntity | null> {
    // -------------------------------------------------------------------------
    // Load Owner-Scoped Journey Demand
    // -------------------------------------------------------------------------
    //
    // The repository performs the combined lookup using:
    //
    //   requesterPublicId
    //   +
    //   journeyDemandPublicId
    //
    // This prevents the handler from retrieving an arbitrary Journey Demand
    // before checking ownership.
    //

    return this.repository.findJourneyDemandByRequesterAndPublicId(
      query.requesterPublicId,
      query.journeyDemandPublicId,
    );
  }
}
