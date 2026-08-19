// -----------------------------------------------------------------------------
// Journey Boarding Opened Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBoardingDomainEvent } from './journey-boarding-domain.event';

// -----------------------------------------------------------------------------
// Journey Boarding Opened
// -----------------------------------------------------------------------------

/**
 * Raised when Journey Boarding is opened and participants may begin boarding.
 *
 * The event represents the transition from NOT_STARTED to BOARDING.
 */
export class JourneyBoardingOpenedEvent extends JourneyBoardingDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyBoardingId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    boardingStartedAt: Date,
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
      'JourneyBoardingOpened',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.boardingStartedAt = new Date(boardingStartedAt.getTime());

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the physical boarding process was opened.
   */
  public readonly boardingStartedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      boardingStartedAt: this.boardingStartedAt,
    };
  }
}
