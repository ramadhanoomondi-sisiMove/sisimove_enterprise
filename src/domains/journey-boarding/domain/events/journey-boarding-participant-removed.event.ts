// -----------------------------------------------------------------------------
// Journey Boarding Participant Removed Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBoardingDomainEvent } from './journey-boarding-domain.event';

// -----------------------------------------------------------------------------
// Journey Boarding Participant Removed
// -----------------------------------------------------------------------------

/**
 * Raised when a participant is removed from the physical boarding process.
 *
 * Removal is a participant-level state transition. It does not itself
 * start or cancel the Journey Boarding aggregate.
 */
export class JourneyBoardingParticipantRemovedEvent extends JourneyBoardingDomainEvent {
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
    actorPublicId: string | undefined,
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
      'JourneyBoardingParticipantRemoved',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.memberPublicId = memberPublicId;

    if (bookingPublicId !== undefined) {
      this.bookingPublicId = bookingPublicId;
    }

    if (actorPublicId !== undefined) {
      this.actorPublicId = actorPublicId;
    }

    this.occurredAt = new Date(occurredAt.getTime());

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Participant
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the participant who was removed.
   */
  public readonly memberPublicId: string;

  /**
   * Public identity of the Journey Booking associated with the participant.
   */
  public readonly bookingPublicId?: string;

  /**
   * Public identity of the member who performed the removal.
   */
  public readonly actorPublicId?: string;

  /**
   * Time at which the participant was removed.
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
      ...(this.actorPublicId !== undefined
        ? {
            actorPublicId: this.actorPublicId,
          }
        : {}),
      occurredAt: this.occurredAt,
    };
  }
}
