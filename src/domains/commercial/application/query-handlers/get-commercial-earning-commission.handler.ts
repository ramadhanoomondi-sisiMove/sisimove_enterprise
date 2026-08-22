// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Query Handlers
//
// Commercial Earning Commission — Get Query Handler
//
// Retrieves a Commercial Earning Commission aggregate by its public identity.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This handler:
//
// - receives GetCommercialEarningCommissionQuery;
// - resolves the commission through the repository;
// - throws a domain-specific exception when the commission does not exist;
// - returns the rehydrated CommercialEarningCommissionAggregate.
//
// -----------------------------------------------------------------------------
// CQRS
// -----------------------------------------------------------------------------
//
// Query:
//
//   GetCommercialEarningCommissionQuery
//
// Handler:
//
//   GetCommercialEarningCommissionHandler
//
// Repository:
//
//   CommercialEarningCommissionRepository.findByPublicId()
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
// When no commission exists for the supplied public ID, the handler throws:
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

import type { GetCommercialEarningCommissionQuery } from '../queries/get-commercial-earning-commission.query';

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
export class GetCommercialEarningCommissionHandler implements QueryHandler<
  GetCommercialEarningCommissionQuery,
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
    query: GetCommercialEarningCommissionQuery,
  ): Promise<CommercialEarningCommissionAggregate> {
    const aggregate = await this.repository.findByPublicId(query.publicId);

    if (!aggregate) {
      throw new CommercialEarningCommissionNotFoundException(
        query.publicId.value,
      );
    }

    return aggregate;
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default GetCommercialEarningCommissionHandler;
