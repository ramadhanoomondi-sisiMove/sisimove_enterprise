// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Query Handlers
//
// Commercial Booking Commission — Get By Booking Query Handler
//
// Retrieves the Commercial Booking Commission associated with a Booking.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This handler:
//
// - receives GetCommercialBookingCommissionByBookingQuery;
// - resolves the commission through the repository;
// - throws a domain-specific exception when no commission exists;
// - returns the rehydrated CommercialBookingCommissionAggregate.
//
// -----------------------------------------------------------------------------
// CQRS
// -----------------------------------------------------------------------------
//
// Query:
//
//   GetCommercialBookingCommissionByBookingQuery
//
// Handler:
//
//   GetCommercialBookingCommissionByBookingHandler
//
// Repository:
//
//   CommercialBookingCommissionRepository.findByBookingPublicId()
//
// -----------------------------------------------------------------------------
// BUSINESS INVARIANT
// -----------------------------------------------------------------------------
//
// A Booking can have at most one Commercial Booking Commission.
//
// Therefore the repository returns:
//
//   CommercialBookingCommissionAggregate | null
//
// The handler converts the absence of a commission into the appropriate
// domain exception.
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
// NOT FOUND BEHAVIOR
// -----------------------------------------------------------------------------
//
// When no commission exists for the supplied Booking public ID, the handler
// throws:
//
//   CommercialBookingCommissionNotFoundException
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

import type { GetCommercialBookingCommissionByBookingQuery } from '../queries/get-commercial-booking-commission-by-booking.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionAggregate } from '../../domain/aggregates/commercial-booking-commission.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionRepository } from '../../domain/repositories/commercial-booking-commission.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionNotFoundException } from '../../domain/exceptions';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetCommercialBookingCommissionByBookingHandler implements QueryHandler<
  GetCommercialBookingCommissionByBookingQuery,
  CommercialBookingCommissionAggregate
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
    query: GetCommercialBookingCommissionByBookingQuery,
  ): Promise<CommercialBookingCommissionAggregate> {
    const aggregate = await this.repository.findByBookingPublicId(
      query.bookingPublicId,
    );

    if (!aggregate) {
      throw new CommercialBookingCommissionNotFoundException(
        query.bookingPublicId.value,
      );
    }

    return aggregate;
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default GetCommercialBookingCommissionByBookingHandler;
