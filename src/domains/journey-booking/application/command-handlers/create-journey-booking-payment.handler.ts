// -----------------------------------------------------------------------------
// Journey Booking — Create Payment Command Handler
// -----------------------------------------------------------------------------
//
// Path:
// src/domains/journey-booking/application/handlers/create-journey-booking-payment.handler.ts
//
// Responsibilities:
//
// 1. Load the Journey Booking aggregate.
// 2. Create the Journey Booking payment entity.
// 3. Use the transaction public ID supplied by the application command.
// 4. Attach the payment to the booking aggregate.
// 5. Persist the updated aggregate.
//
// Architectural note:
//
// The Journey Booking transaction public ID is a cross-domain reference.
// It is intentionally distinct from the actual Financial Transaction public ID
// created later by the Financial bounded context during payment authorization.
//
// The presentation/controller layer is responsible for establishing the
// readable Journey Booking transaction public identity when one is not
// supplied by an upstream caller.
//
// This handler deliberately does NOT generate a transaction public ID.
// It consumes the identity carried by the command and persists it as part
// of the Journey Booking payment state.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { CreateJourneyBookingPaymentCommand } from '../commands/create-journey-booking-payment.command';

import type { JourneyBookingAggregate } from '../../domain/aggregates/journey-booking.aggregate';

import { JourneyBookingPaymentEntity } from '../../domain/entities/journey-booking-payment.entity';

import { JourneyBookingNotFoundException } from '../../domain/exceptions';

import type { JourneyBookingRepository } from '../../domain/repositories/journey-booking.repository';

import { JOURNEY_BOOKING_TOKENS } from '../journey-booking.tokens';

@Injectable()
export class CreateJourneyBookingPaymentHandler implements CommandHandler<
  CreateJourneyBookingPaymentCommand,
  JourneyBookingAggregate
> {
  constructor(
    @Inject(JOURNEY_BOOKING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBookingRepository,
  ) {}

  public async execute(
    command: CreateJourneyBookingPaymentCommand,
  ): Promise<JourneyBookingAggregate> {
    // -------------------------------------------------------------------------
    // Load Journey Booking
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.journeyBookingPublicId,
    );

    if (aggregate === null) {
      throw new JourneyBookingNotFoundException(
        command.journeyBookingPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Create Payment
    // -------------------------------------------------------------------------
    //
    // The transaction public ID has already been established by the
    // application/controller boundary and carried by the command.
    //
    // The handler does not generate or replace that identity.
    //
    const payment = JourneyBookingPaymentEntity.create({
      status: command.status,
      amount: command.amount,
      currency: command.currency,
      transactionPublicId: command.transactionPublicId,
    });

    // -------------------------------------------------------------------------
    // Attach Payment
    // -------------------------------------------------------------------------

    aggregate.attachPayment(payment);

    // -------------------------------------------------------------------------
    // Persist
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    return aggregate;
  }
}
