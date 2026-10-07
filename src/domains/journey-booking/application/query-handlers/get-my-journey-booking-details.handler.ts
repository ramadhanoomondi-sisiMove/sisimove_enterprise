// -----------------------------------------------------------------------------
// sisiMove — Get My Journey Booking Details Query Handler
// -----------------------------------------------------------------------------
//
// Purpose
// -------
//
// Retrieves the passenger-facing detail representations of all Journey
// Bookings belonging to the currently authenticated passenger.
//
// The repository provides the passenger's Journey Booking root entities.
// Individual passenger-facing detail responses are then composed through the
// existing GetJourneyBookingDetailQueryHandler.
//
// This keeps the detailed booking composition in one place.
//
// The existing detail handler remains responsible for:
//
//   1. loading the Journey Booking aggregate;
//   2. verifying passenger ownership;
//   3. resolving the Journey;
//   4. resolving the public Traveller profile;
//   5. resolving the public Trust profile;
//   6. composing the historical snapshot;
//   7. composing authoritative pricing;
//   8. composing passenger-safe payment state;
//   9. composing cancellation state;
//  10. returning JourneyBookingDetailResponse.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetMyJourneyBookingDetailsQuery } from '../queries/get-my-journey-booking-details.query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';

// -----------------------------------------------------------------------------
// Response
// -----------------------------------------------------------------------------

import type { JourneyBookingDetailResponse } from '../responses/journey-booking-detail.response';

// -----------------------------------------------------------------------------
// Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_TOKENS } from '../journey-booking.tokens';

// -----------------------------------------------------------------------------
// Existing Detail Query
// -----------------------------------------------------------------------------

import { GetJourneyBookingDetailQuery } from '../queries/get-journey-booking-detail.query';

// -----------------------------------------------------------------------------
// Existing Detail Handler
// -----------------------------------------------------------------------------

import { GetJourneyBookingDetailQueryHandler } from './get-journey-booking-detail.query-handler';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetMyJourneyBookingDetailsQueryHandler implements QueryHandler<
  GetMyJourneyBookingDetailsQuery,
  JourneyBookingDetailResponse[]
> {
  constructor(
    @Inject(JOURNEY_BOOKING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBookingRepository,

    private readonly getJourneyBookingDetailQueryHandler: GetJourneyBookingDetailQueryHandler,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetMyJourneyBookingDetailsQuery,
  ): Promise<JourneyBookingDetailResponse[]> {
    // -------------------------------------------------------------------------
    // Phase 1 — Load passenger bookings
    // -------------------------------------------------------------------------

    const bookings =
      await this.repository.findJourneyBookingsByPassengerPublicId(
        query.passengerPublicId,
      );

    // -------------------------------------------------------------------------
    // Phase 2 — Compose detailed booking responses
    // -------------------------------------------------------------------------
    //
    // The repository returns JourneyBookingEntity instances rather than
    // JourneyBookingAggregate instances.
    //
    // Each entity already exposes the Journey Booking public identifier.
    //
    // The existing detail query handler is then responsible for loading the
    // complete aggregate and composing the passenger-facing detail response.
    // -------------------------------------------------------------------------

    return Promise.all(
      bookings.map((booking) =>
        this.getJourneyBookingDetailQueryHandler.execute(
          new GetJourneyBookingDetailQuery(
            booking.publicId,
            query.passengerPublicId,
          ),
        ),
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMyJourneyBookingDetailsQueryHandler;
