// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Query Handlers
//
// Commercial Earning Commissions — Get By Provider Query Handler
//
// Retrieves all Commercial Earning Commission aggregates associated with a
// Provider.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This handler:
//
// - receives GetCommercialEarningCommissionsByProviderQuery;
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
//   GetCommercialEarningCommissionsByProviderQuery
//
// Handler:
//
//   GetCommercialEarningCommissionsByProviderHandler
//
// Repository:
//
//   CommercialEarningCommissionRepository.findByProviderPublicId()
//
// -----------------------------------------------------------------------------
// CARDINALITY
// -----------------------------------------------------------------------------
//
// A Provider may complete multiple Journeys and settlements.
//
// Therefore a Provider may have multiple Commercial Earning Commissions.
//
// The repository returns:
//
//   CommercialEarningCommissionAggregate[]
//
// An empty array is a valid result when the Provider has no earning
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

import type { GetCommercialEarningCommissionsByProviderQuery } from '../queries/get-commercial-earning-commissions-by-provider.query';

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
export class GetCommercialEarningCommissionsByProviderHandler implements QueryHandler<
  GetCommercialEarningCommissionsByProviderQuery,
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
    query: GetCommercialEarningCommissionsByProviderQuery,
  ): Promise<CommercialEarningCommissionAggregate[]> {
    return this.repository.findByProviderPublicId(query.providerPublicId);
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default GetCommercialEarningCommissionsByProviderHandler;
