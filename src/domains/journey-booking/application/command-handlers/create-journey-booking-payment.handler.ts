// src/domains/journey-booking/application/handlers/create-journey-booking-payment.handler.ts

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
    const aggregate = await this.repository.findByPublicId(
      command.journeyBookingPublicId,
    );

    if (aggregate === null) {
      throw new JourneyBookingNotFoundException(
        command.journeyBookingPublicId.value,
      );
    }

    const payment = JourneyBookingPaymentEntity.create({
      status: command.status,
      amount: command.amount,
      currency: command.currency,
      transactionPublicId: command.transactionPublicId,
    });

    aggregate.attachPayment(payment);

    await this.repository.save(aggregate);

    return aggregate;
  }
}
