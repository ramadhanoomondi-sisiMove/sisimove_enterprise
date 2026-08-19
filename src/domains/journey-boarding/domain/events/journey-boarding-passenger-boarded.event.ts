// -----------------------------------------------------------------------------
// Journey Boarding Passenger Boarded Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBoardingDomainEvent } from './journey-boarding-domain.event';

// -----------------------------------------------------------------------------
// Journey Boarding Passenger Boarded
// -----------------------------------------------------------------------------

/**
 * Raised when a passenger physically boards the journey.
 *
 * This event records the passenger and, when available, the Journey Booking
 * associated with the physical boarding action.
 */
export class JourneyBoardingPassengerBoardedEvent extends JourneyBoardingDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyBoardingId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    memberPublicId: string,
    bookingPublicId: string | undefined,
    occurredAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyBoardingId,
      publicId,
      journeyPublicId,
      providerPublicId,
      'JourneyBoardingPassengerBoarded',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.memberPublicId = memberPublicId;

    if (bookingPublicId !== undefined) {
      this.bookingPublicId = bookingPublicId;
    }

    this.occurredAt = new Date(occurredAt.getTime());

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Participant
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the passenger who physically boarded.
   */
  public readonly memberPublicId: string;

  /**
   * Public identity of the Journey Booking associated with the passenger.
   *
   * This is optional because physical boarding may be recorded even when
   * the booking reference is not available at the point of the event.
   */
  public readonly bookingPublicId?: string;

  /**
   * Time at which the passenger physically boarded.
   */
  public readonly occurredAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      memberPublicId: this.memberPublicId,
      ...(this.bookingPublicId !== undefined
        ? {
            bookingPublicId: this.bookingPublicId,
          }
        : {}),
      occurredAt: this.occurredAt,
    };
  }
}
