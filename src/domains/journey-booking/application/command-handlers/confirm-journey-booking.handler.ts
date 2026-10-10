// -----------------------------------------------------------------------------
// Journey Booking — Confirm Command Handler
// -----------------------------------------------------------------------------
//
// Path:
// src/domains/journey-booking/application/handlers/confirm-journey-booking.handler.ts
//
// Dependency injection:
//     JOURNEY_BOOKING_TOKENS.REPOSITORY
//     JOURNEY_TOKENS.REPOSITORY
//     PrismaUnitOfWork
//
// Application responsibilities:
//
// 1. Load the Journey Booking aggregate.
// 2. Fail with JourneyBookingNotFoundException when it does not exist.
// 3. Load the Journey aggregate associated with the booking.
// 4. Delegate confirmation to the JourneyBookingAggregate.
// 5. Reserve the confirmed booking seats on the Journey capacity.
// 6. Persist the confirmed Journey Booking.
// 7. Commit the booking confirmation and capacity reservation atomically.
//
// Confirmation lifecycle rules remain inside the JourneyBookingAggregate.
//
// Journey capacity mutation is coordinated by the Journey repository.
//
// The PrismaUnitOfWork owns the transaction boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ConfirmJourneyBookingCommand } from '../commands/confirm-journey-booking.command';

// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import type { JourneyBookingAggregate } from '../../domain/aggregates/journey-booking.aggregate';

// -----------------------------------------------------------------------------
// Journey Booking Exceptions
// -----------------------------------------------------------------------------

import { JourneyBookingNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Journey Booking Repository
// -----------------------------------------------------------------------------

import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';

// -----------------------------------------------------------------------------
// Journey Booking Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_TOKENS } from '../journey-booking.tokens';

// -----------------------------------------------------------------------------
// Journey Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../journey/domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Journey Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../../journey/application/journey.tokens';

// -----------------------------------------------------------------------------
// Unit of Work
// -----------------------------------------------------------------------------

import { PrismaUnitOfWork } from '../../../../infrastructure/persistence/prisma-unit-of-work';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ConfirmJourneyBookingHandler implements CommandHandler<
  ConfirmJourneyBookingCommand,
  JourneyBookingAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    @Inject(JOURNEY_BOOKING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBookingRepository,

    // -------------------------------------------------------------------------
    // Journey
    // -------------------------------------------------------------------------

    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,

    // -------------------------------------------------------------------------
    // Unit of Work
    // -------------------------------------------------------------------------

    private readonly unitOfWork: PrismaUnitOfWork,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: ConfirmJourneyBookingCommand,
  ): Promise<JourneyBookingAggregate> {
    return this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // Load Journey Booking
      // -----------------------------------------------------------------------

      const booking = await this.repository.findByPublicId(
        command.journeyBookingPublicId,
      );

      // -----------------------------------------------------------------------
      // Not Found
      // -----------------------------------------------------------------------

      if (booking === null) {
        throw new JourneyBookingNotFoundException(
          command.journeyBookingPublicId.value,
        );
      }

      // -----------------------------------------------------------------------
      // Load Journey
      // -----------------------------------------------------------------------
      //
      // The booking stores the Journey public ID.
      //
      // Resolve the Journey inside the same transaction used by the booking
      // confirmation and capacity reservation.
      //
      // -----------------------------------------------------------------------

      const journey = await this.journeyRepository.findByPublicId(
        booking.journeyPublicId,
      );

      if (journey === null) {
        throw new Error(
          `Journey was not found for public ID ${booking.journeyPublicId.value}.`,
        );
      }

      // -----------------------------------------------------------------------
      // Confirm Journey Booking
      // -----------------------------------------------------------------------
      //
      // The JourneyBookingAggregate owns the booking confirmation lifecycle.
      //
      // -----------------------------------------------------------------------

      booking.confirm(
        command.correlationId,
        command.causationId,
        command.confirmedAt,
      );

      // -----------------------------------------------------------------------
      // Reserve Journey Capacity
      // -----------------------------------------------------------------------
      //
      // Capacity is committed only when the booking becomes CONFIRMED.
      //
      // The Journey repository performs the capacity mutation through the
      // transaction-scoped Prisma client.
      //
      // Because this operation is inside PrismaUnitOfWork, the booking
      // confirmation and capacity reservation succeed or roll back together.
      //
      // -----------------------------------------------------------------------

      await this.journeyRepository.reserveCapacitySeats(
        journey.journeyId,
        booking.seats.value,
      );

      // -----------------------------------------------------------------------
      // Persist Journey Booking
      // -----------------------------------------------------------------------

      await this.repository.save(booking);

      // -----------------------------------------------------------------------
      // Return
      // -----------------------------------------------------------------------

      return booking;
    });
  }
}
