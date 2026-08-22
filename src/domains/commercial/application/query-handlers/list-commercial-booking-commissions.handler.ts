// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Query Handlers
//
// Commercial Booking Commission — List Query Handler
//
// Retrieves all Commercial Booking Commission aggregates.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This handler:
//
// - receives ListCommercialBookingCommissionsQuery;
// - delegates retrieval to CommercialBookingCommissionRepository;
// - returns the complete collection of Commercial Booking Commission
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
//   ListCommercialBookingCommissionsQuery
//
// Handler:
//
//   ListCommercialBookingCommissionsHandler
//
// Repository:
//
//   CommercialBookingCommissionRepository.findAll()
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
// CommercialBookingCommission aggregate.
//
// -----------------------------------------------------------------------------
// DEPENDENCY INJECTION
// -----------------------------------------------------------------------------
//
// The repository is resolved through:
//
//   COMMERCIAL_BOOKING_COMMISSION_TOKENS.REPOSITORY
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
//   Promise<CommercialBookingCommissionAggregate[]>
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

import { COMMERCIAL_BOOKING_COMMISSION_TOKENS } from '../commercial-booking-commission.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { ListCommercialBookingCommissionsQuery } from '../queries/list-commercial-booking-commissions.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionAggregate } from '../../domain/aggregates/commercial-booking-commission.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionRepository } from '../../domain/repositories/commercial-booking-commission.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ListCommercialBookingCommissionsHandler implements QueryHandler<
  ListCommercialBookingCommissionsQuery,
  CommercialBookingCommissionAggregate[]
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    @Inject(COMMERCIAL_BOOKING_COMMISSION_TOKENS.REPOSITORY)
    private readonly repository: CommercialBookingCommissionRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(
    query: ListCommercialBookingCommissionsQuery,
  ): Promise<CommercialBookingCommissionAggregate[]> {
    void query;

    return this.repository.findAll();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default ListCommercialBookingCommissionsHandler;
