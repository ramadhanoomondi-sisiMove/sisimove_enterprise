// src/domains/journey-booking/domain/events/journey-booking-cancelled.event.ts

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBookingDomainEvent } from './journey-booking-domain.event';

// -----------------------------------------------------------------------------
// Journey Booking Cancelled
// -----------------------------------------------------------------------------

export class JourneyBookingCancelledEvent extends JourneyBookingDomainEvent {
  constructor(
    journeyBookingId: string,
    publicId: string,
    journeyPublicId: string,
    passengerPublicId: string,
    reason: string,
    cancelledByPublicId: string | undefined,
    cancelledAt: Date,
    reasonDescription: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyBookingId,
      publicId,
      journeyPublicId,
      passengerPublicId,
      'JourneyBookingCancelled',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.reason = reason;
    this.cancelledAt = new Date(cancelledAt.getTime());

    if (cancelledByPublicId !== undefined) {
      this.cancelledByPublicId = cancelledByPublicId;
    }

    if (reasonDescription !== undefined) {
      this.reasonDescription = reasonDescription;
    }

    Object.freeze(this);
  }

  public readonly reason: string;

  public readonly cancelledByPublicId?: string;

  public readonly reasonDescription?: string;

  public readonly cancelledAt: Date;

  override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      reason: this.reason,
      ...(this.cancelledByPublicId !== undefined && {
        cancelledByPublicId: this.cancelledByPublicId,
      }),
      ...(this.reasonDescription !== undefined && {
        reasonDescription: this.reasonDescription,
      }),
      cancelledAt: this.cancelledAt,
    };
  }
}
