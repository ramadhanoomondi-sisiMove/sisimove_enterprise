import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { PrismaUnitOfWork } from '../../../../infrastructure/persistence/prisma-unit-of-work';

import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';
import { JOURNEY_TOKENS } from '../../../journey/application/journey.tokens';
import { JOURNEY_BOOKING_TOKENS } from '../../../journey-booking/application/journey-booking.tokens';

import type { CancelJourneyBoardingCommand } from '../commands/cancel-journey-boarding.command';

import type { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';
import type { JourneyRepository } from '../../../journey/domain/repositories/journey.repository';
import type { JourneyBookingRepository } from '../../../journey-booking/domain/repositories/journey-booking.repository';

import { JourneyId } from '../../../journey/domain/value-objects/journey-id.vo';

import { JourneyPublicId as BookingJourneyPublicId } from '../../../journey-booking/domain/value-objects/journey-public-id.vo';

import { JourneyBookingStatus } from '../../../journey-booking/domain/value-objects/journey-booking-status.vo';

import {
  JourneyBoardingNotFoundException,
  JourneyBoardingInvariantException,
} from '../../domain/exceptions';

import { JourneyBoardingEventEntity } from '../../domain/entities/journey-boarding-event.entity';
import { JourneyBoardingEventType } from '../../domain/value-objects/journey-boarding-event-type.vo';

export interface CancelJourneyBoardingResult {
  aggregate: JourneyBoardingAggregate;
  journeyPublicId: string;
}

@Injectable()
export class CancelJourneyBoardingHandler implements CommandHandler<
  CancelJourneyBoardingCommand,
  CancelJourneyBoardingResult
> {
  public constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,

    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,

    @Inject(JOURNEY_BOOKING_TOKENS.REPOSITORY)
    private readonly bookingRepository: JourneyBookingRepository,

    private readonly unitOfWork: PrismaUnitOfWork,
  ) {}

  public async execute(
    command: CancelJourneyBoardingCommand,
  ): Promise<CancelJourneyBoardingResult> {
    return this.unitOfWork.execute(async () => {
      // 1. Load the boarding aggregate.
      const aggregate = await this.repository.findByPublicId(
        command.journeyBoardingPublicId,
      );

      if (aggregate === null) {
        throw new JourneyBoardingNotFoundException(
          command.journeyBoardingPublicId.value,
        );
      }

      // 2. Resolve the associated Journey before changing the aggregate.
      const journey = await this.journeyRepository.findJourneyById(
        new JourneyId(aggregate.journeyBoarding.journeyId.value),
      );

      if (journey === null) {
        throw new JourneyBoardingInvariantException(
          `Journey not found for boarding ${aggregate.publicId.value}.`,
        );
      }

      // 3. Reject cancellation only when an EXPECTED passenger remains.
      // An EXPECTED provider alone must not prevent cancellation.
      const expectedPassengers = aggregate
        .expectedParticipants()
        .filter((participant) => participant.isPassenger());

      if (expectedPassengers.length > 0) {
        throw new JourneyBoardingInvariantException(
          `Cannot cancel boarding while ${expectedPassengers.length} expected passenger(s) remain. Withdraw or remove them first.`,
        );
      }

      // 4. Reject cancellation while active bookings remain.
      const bookingJourneyPublicId = new BookingJourneyPublicId(
        journey.publicId.value,
      );

      const [pendingBookings, confirmedBookings] = await Promise.all([
        this.bookingRepository.findJourneyBookingsByJourneyAndStatus(
          bookingJourneyPublicId,
          JourneyBookingStatus.pending(),
        ),
        this.bookingRepository.findJourneyBookingsByJourneyAndStatus(
          bookingJourneyPublicId,
          JourneyBookingStatus.confirmed(),
        ),
      ]);

      if (pendingBookings.length > 0 || confirmedBookings.length > 0) {
        throw new JourneyBoardingInvariantException(
          `Cannot cancel boarding while active bookings remain (${pendingBookings.length} pending, ${confirmedBookings.length} confirmed). Resolve those bookings first.`,
        );
      }

      // 5. Apply the aggregate's lifecycle rules.
      const cancelledAt = command.cancelledAt ?? new Date();

      aggregate.cancel(
        command.correlationId,
        command.causationId,
        cancelledAt,
        command.actorPublicId,
      );

      // 6. Record the cancellation event after cancellation succeeds.
      const cancellationEvent = JourneyBoardingEventEntity.create({
        boardingId: aggregate.publicId,
        type: JourneyBoardingEventType.boardingCancelled(),
        actorPublicId: command.actorPublicId,
        occurredAt: cancelledAt,
      });

      aggregate.addBoardingEvent(cancellationEvent);

      // 7. Persist the updated aggregate and its owned history.
      // The repository must use the ambient transaction-scoped Prisma client.
      await this.repository.save(aggregate);

      // The Journey lifecycle itself remains unchanged.
      return {
        aggregate,
        journeyPublicId: journey.publicId.value,
      };
    });
  }
}

export default CancelJourneyBoardingHandler;
