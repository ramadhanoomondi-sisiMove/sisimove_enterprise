// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Query Handlers
//
// Commercial Earning Commissions — Get By Journey Query Handler
//
// Retrieves all Commercial Earning Commission aggregates associated with a
// Journey.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This handler:
//
// - receives GetCommercialEarningCommissionsByJourneyQuery;
// - delegates retrieval to the repository;
// - returns all matching Commercial Earning Commission aggregates.
//
// The handler contains no commercial business rules.
//
// -----------------------------------------------------------------------------
// CQRS
// -----------------------------------------------------------------------------
//
// Query:
//
//   GetCommercialEarningCommissionsByJourneyQuery
//
// Handler:
//
//   GetCommercialEarningCommissionsByJourneyHandler
//
// Repository:
//
//   CommercialEarningCommissionRepository.findByJourneyPublicId()
//
// -----------------------------------------------------------------------------
// CARDINALITY
// -----------------------------------------------------------------------------
//
// A Journey may have multiple settlements and therefore multiple Commercial
// Earning Commissions.
//
// The repository returns:
//
//   CommercialEarningCommissionAggregate[]
//
// An empty array is a valid result when the Journey has no earning
// commissions.
//
// -----------------------------------------------------------------------------
// DOMAIN BOUNDARY
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - create commissions;
// - assess commissions;
// - cancel commissions;
// - calculate commission amounts;
// - modify commission state.
//
// Those responsibilities belong to the appropriate command handlers and
// CommercialEarningCommission aggregate.
//
// -----------------------------------------------------------------------------
// DEPENDENCY INJECTION
// -----------------------------------------------------------------------------
//
// The repository is resolved through:
//
//   COMMERCIAL_EARNING_COMMISSION_TOKENS.REPOSITORY
//
// This keeps the application layer independent from the persistence
// implementation.
//
// =============================================================================

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Token
// -----------------------------------------------------------------------------

import { COMMERCIAL_EARNING_COMMISSION_TOKENS } from '../commercial-earning-commission.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetCommercialEarningCommissionsByJourneyQuery } from '../queries/get-commercial-earning-commissions-by-journey.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionAggregate } from '../../domain/aggregates/commercial-earning-commission.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { CommercialEarningCommissionRepository } from '../../domain/repositories/commercial-earning-commission.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetCommercialEarningCommissionsByJourneyHandler implements QueryHandler<
  GetCommercialEarningCommissionsByJourneyQuery,
  CommercialEarningCommissionAggregate[]
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    @Inject(COMMERCIAL_EARNING_COMMISSION_TOKENS.REPOSITORY)
    private readonly repository: CommercialEarningCommissionRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(
    query: GetCommercialEarningCommissionsByJourneyQuery,
  ): Promise<CommercialEarningCommissionAggregate[]> {
    return this.repository.findByJourneyPublicId(query.journeyPublicId);
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default GetCommercialEarningCommissionsByJourneyHandler;
