// src/domains/journey-booking/domain/events/journey-booking-domain.event.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Journey Booking Domain Event
// -----------------------------------------------------------------------------

/**
 * Base domain event for the Journey Booking aggregate.
 *
 * All Journey Booking domain events inherit the common aggregate identity
 * and cross-domain booking references defined here.
 *
 * The event does not expose Prisma/internal database identifiers as domain
 * references. The aggregate public identity is used as the public contract.
 */
export abstract class JourneyBookingDomainEvent extends DomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  protected constructor(
    journeyBookingId: string,
    publicId: string,
    journeyPublicId: string,
    passengerPublicId: string,
    eventName: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyBookingId,
      'JourneyBooking',
      eventName,
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.journeyPublicId = journeyPublicId;
    this.passengerPublicId = passengerPublicId;
  }

  // ---------------------------------------------------------------------------
  // Aggregate Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey Booking aggregate.
   */
  public readonly publicId: string;

  /**
   * Public identity of the Journey associated with the booking.
   *
   * This is a cross-domain reference and is intentionally represented as
   * a public identifier rather than a domain relation.
   */
  public readonly journeyPublicId: string;

  /**
   * Public identity of the passenger who owns the booking.
   *
   * This is a cross-domain Identity reference.
   */
  public readonly passengerPublicId: string;

  // ---------------------------------------------------------------------------
  // Base Payload
  // ---------------------------------------------------------------------------

  /**
   * Returns the common payload shared by every Journey Booking event.
   *
   * Concrete events should extend this payload with event-specific state.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {
      journeyBookingPublicId: this.publicId,
      journeyPublicId: this.journeyPublicId,
      passengerPublicId: this.passengerPublicId,
    };
  }
}
