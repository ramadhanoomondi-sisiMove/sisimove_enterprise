// src/domains/journey-booking/application/commands/create-journey-booking-payment.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type {
  JourneyBookingPublicId,
  JourneyBookingPaymentStatus,
  JourneyBookingPaymentAmount,
  JourneyBookingCurrency,
  JourneyBookingTransactionPublicId,
} from '../../domain/value-objects';

export class CreateJourneyBookingPaymentCommand extends Command {
  constructor(
    public readonly journeyBookingPublicId: JourneyBookingPublicId,
    public readonly status: JourneyBookingPaymentStatus,
    public readonly amount: JourneyBookingPaymentAmount,
    public readonly currency: JourneyBookingCurrency,
    public readonly correlationId: string,
    public readonly transactionPublicId?: JourneyBookingTransactionPublicId,
    public readonly causationId?: string,
  ) {
    super();
  }
}
