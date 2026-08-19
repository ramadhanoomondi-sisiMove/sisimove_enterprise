// -----------------------------------------------------------------------------
// Journey Boarding Participant Withdrawn Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBoardingDomainEvent } from './journey-boarding-domain.event';

// -----------------------------------------------------------------------------
// Journey Boarding Participant Withdrawn
// -----------------------------------------------------------------------------

/**
 * Raised when a participant withdraws from the physical boarding process.
 *
 * Withdrawal is a participant-level state transition and does not itself
 * start or cancel the Journey Boarding aggregate.
 */
export class JourneyBoardingParticipantWithdrawnEvent extends JourneyBoardingDomainEvent {
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
      'JourneyBoardingParticipantWithdrawn',
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
   * Public identity of the participant who withdrew.
   */
  public readonly memberPublicId: string;

  /**
   * Public identity of the Journey Booking associated with the participant.
   */
  public readonly bookingPublicId?: string;

  /**
   * Time at which the participant withdrew.
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
