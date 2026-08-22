// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Query Handlers
//
// Commercial Earning Commission — List Query Handler
//
// Retrieves all Commercial Earning Commission aggregates.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This handler:
//
// - receives ListCommercialEarningCommissionsQuery;
// - delegates retrieval to CommercialEarningCommissionRepository;
// - returns the complete collection of Commercial Earning Commission
//   aggregates.
//
// The handler contains no commercial business rules.
//
// -----------------------------------------------------------------------------
// CQRS
// -----------------------------------------------------------------------------
//
// Query:
//
//   ListCommercialEarningCommissionsQuery
//
// Handler:
//
//   ListCommercialEarningCommissionsHandler
//
// Repository:
//
//   CommercialEarningCommissionRepository.findAll()
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
// -----------------------------------------------------------------------------
// RETURN CONTRACT
// -----------------------------------------------------------------------------
//
// Returns:
//
//   Promise<CommercialEarningCommissionAggregate[]>
//
// The repository determines persistence ordering. The handler does not
// reorder or transform the result.
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

import type { ListCommercialEarningCommissionsQuery } from '../queries/list-commercial-earning-commissions.query';

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
export class ListCommercialEarningCommissionsHandler implements QueryHandler<
  ListCommercialEarningCommissionsQuery,
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
    query: ListCommercialEarningCommissionsQuery,
  ): Promise<CommercialEarningCommissionAggregate[]> {
    void query;

    return this.repository.findAll();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default ListCommercialEarningCommissionsHandler;
