/**
 * Journey Booking — Find Detailed Journey Bookings By Passenger Handler
 *
 * Retrieves every booking belonging to a passenger and returns the existing
 * detailed booking response contract.
 *
 * Detail composition is delegated to a shared composer so this handler does
 * not depend on another query handler.
 */

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { JourneyBookingAggregate } from '../../domain/aggregates/journey-booking.aggregate';
import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';

import { JOURNEY_BOOKING_TOKENS } from '../journey-booking.tokens';

import type { FindDetailedJourneyBookingsByPassengerQuery } from '../queries/find-detailed-journey-bookings-by-passenger.query';

import type { JourneyBookingDetailResponse } from '../responses/journey-booking-detail.response';

import {
  JOURNEY_BOOKING_DETAIL_COMPOSER,
  type JourneyBookingDetailComposer,
} from '../services/journey-booking-detail.composer';

@Injectable()
export class FindDetailedJourneyBookingsByPassengerHandler implements QueryHandler<
  FindDetailedJourneyBookingsByPassengerQuery,
  JourneyBookingDetailResponse[]
> {
  constructor(
    @Inject(JOURNEY_BOOKING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBookingRepository,

    @Inject(JOURNEY_BOOKING_DETAIL_COMPOSER)
    private readonly detailComposer: JourneyBookingDetailComposer,
  ) {}

  public async execute(
    query: FindDetailedJourneyBookingsByPassengerQuery,
  ): Promise<JourneyBookingDetailResponse[]> {
    const bookingEntities =
      await this.repository.findJourneyBookingsByPassengerPublicId(
        query.passengerPublicId,
      );

    if (bookingEntities.length === 0) {
      return [];
    }

    const aggregates: JourneyBookingAggregate[] = await Promise.all(
      bookingEntities.map(async (bookingEntity) => {
        const aggregate = await this.repository.findByPublicId(
          bookingEntity.publicId,
        );

        if (aggregate === null) {
          throw new Error(
            `Journey Booking aggregate not found for ${bookingEntity.publicId.value}.`,
          );
        }

        return aggregate;
      }),
    );

    return Promise.all(
      aggregates.map((aggregate) =>
        this.detailComposer.execute(aggregate, query.passengerPublicId),
      ),
    );
  }
}

export default FindDetailedJourneyBookingsByPassengerHandler;
