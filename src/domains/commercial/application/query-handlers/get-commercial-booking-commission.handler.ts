// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Query Handlers
//
// Commercial Booking Commission — Get Query Handler
//
// Retrieves a Commercial Booking Commission aggregate by its public identity.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This handler:
//
// - receives GetCommercialBookingCommissionQuery;
// - resolves the commission through the repository;
// - throws a domain-specific exception when the commission does not exist;
// - returns the rehydrated CommercialBookingCommissionAggregate.
//
// -----------------------------------------------------------------------------
// CQRS
// -----------------------------------------------------------------------------
//
// Query:
//
//   GetCommercialBookingCommissionQuery
//
// Handler:
//
//   GetCommercialBookingCommissionHandler
//
// Repository:
//
//   CommercialBookingCommissionRepository.findByPublicId()
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
// When no commission exists for the supplied public ID, the handler throws:
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

import type { GetCommercialBookingCommissionQuery } from '../queries/get-commercial-booking-commission.query';

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
export class GetCommercialBookingCommissionHandler implements QueryHandler<
  GetCommercialBookingCommissionQuery,
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
    query: GetCommercialBookingCommissionQuery,
  ): Promise<CommercialBookingCommissionAggregate> {
    const aggregate = await this.repository.findByPublicId(query.publicId);

    if (!aggregate) {
      throw new CommercialBookingCommissionNotFoundException(
        query.publicId.value,
      );
    }

    return aggregate;
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default GetCommercialBookingCommissionHandler;
