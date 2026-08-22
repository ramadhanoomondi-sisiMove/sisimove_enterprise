// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Query Handlers
//
// Commercial Earning Commission — Get By Settlement Query Handler
//
// Retrieves the Commercial Earning Commission associated with a Settlement.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This handler:
//
// - receives GetCommercialEarningCommissionBySettlementQuery;
// - resolves the commission through the repository;
// - throws a domain-specific exception when no commission exists;
// - returns the rehydrated CommercialEarningCommissionAggregate.
//
// -----------------------------------------------------------------------------
// CQRS
// -----------------------------------------------------------------------------
//
// Query:
//
//   GetCommercialEarningCommissionBySettlementQuery
//
// Handler:
//
//   GetCommercialEarningCommissionBySettlementHandler
//
// Repository:
//
//   CommercialEarningCommissionRepository.findBySettlementPublicId()
//
// -----------------------------------------------------------------------------
// BUSINESS INVARIANT
// -----------------------------------------------------------------------------
//
// A Settlement can have at most one Commercial Earning Commission.
//
// Therefore the repository resolves a single aggregate.
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
// NOT FOUND BEHAVIOR
// -----------------------------------------------------------------------------
//
// When no commission exists for the supplied Settlement public ID, the
// handler throws:
//
//   CommercialEarningCommissionNotFoundException
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

import type { GetCommercialEarningCommissionBySettlementQuery } from '../queries/get-commercial-earning-commission-by-settlement.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionAggregate } from '../../domain/aggregates/commercial-earning-commission.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { CommercialEarningCommissionRepository } from '../../domain/repositories/commercial-earning-commission.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionNotFoundException } from '../../domain/exceptions';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetCommercialEarningCommissionBySettlementHandler implements QueryHandler<
  GetCommercialEarningCommissionBySettlementQuery,
  CommercialEarningCommissionAggregate
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
    query: GetCommercialEarningCommissionBySettlementQuery,
  ): Promise<CommercialEarningCommissionAggregate> {
    const aggregate = await this.repository.findBySettlementPublicId(
      query.settlementPublicId,
    );

    if (!aggregate) {
      throw new CommercialEarningCommissionNotFoundException(
        query.settlementPublicId.value,
      );
    }

    return aggregate;
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default GetCommercialEarningCommissionBySettlementHandler;
