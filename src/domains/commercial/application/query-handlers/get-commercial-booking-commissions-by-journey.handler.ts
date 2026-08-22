// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Query Handlers
//
// Commercial Booking Commissions — Get By Journey Query Handler
//
// Retrieves all Commercial Booking Commission aggregates associated with a
// Journey.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This handler:
//
// - receives GetCommercialBookingCommissionsByJourneyQuery;
// - delegates retrieval to the repository;
// - returns all matching Commercial Booking Commission aggregates.
//
// The handler contains no commercial business rules.
//
// -----------------------------------------------------------------------------
// CQRS
// -----------------------------------------------------------------------------
//
// Query:
//
//   GetCommercialBookingCommissionsByJourneyQuery
//
// Handler:
//
//   GetCommercialBookingCommissionsByJourneyHandler
//
// Repository:
//
//   CommercialBookingCommissionRepository.findByJourneyPublicId()
//
// -----------------------------------------------------------------------------
// CARDINALITY
// -----------------------------------------------------------------------------
//
// A Journey may have multiple bookings and therefore multiple Commercial
// Booking Commissions.
//
// The repository returns:
//
//   CommercialBookingCommissionAggregate[]
//
// An empty array is a valid result when the Journey has no commissions.
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

import type { GetCommercialBookingCommissionByJourneyQuery } from '../queries/get-commercial-booking-commissions-by-journey.query';

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
export class GetCommercialBookingCommissionsByJourneyHandler implements QueryHandler<
  GetCommercialBookingCommissionByJourneyQuery,
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
    query: GetCommercialBookingCommissionByJourneyQuery,
  ): Promise<CommercialBookingCommissionAggregate[]> {
    return this.repository.findByJourneyPublicId(query.journeyPublicId);
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default GetCommercialBookingCommissionsByJourneyHandler;
