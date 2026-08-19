// -----------------------------------------------------------------------------
// Journey Boarding Started Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBoardingDomainEvent } from './journey-boarding-domain.event';

// -----------------------------------------------------------------------------
// Journey Boarding Started
// -----------------------------------------------------------------------------

/**
 * Raised when the physical journey actually starts.
 *
 * This event is distinct from boarding being opened and from individual
 * participants boarding. It represents the aggregate transition from
 * BOARDING to STARTED.
 *
 * The journey starts only when the provider has physically boarded and the
 * aggregate explicitly confirms the journey start.
 */
export class JourneyBoardingStartedEvent extends JourneyBoardingDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyBoardingId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    journeyStartedAt: Date,
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
      'JourneyBoardingStarted',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.journeyStartedAt = new Date(journeyStartedAt.getTime());

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Journey Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the physical journey actually started.
   */
  public readonly journeyStartedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      journeyStartedAt: this.journeyStartedAt,
    };
  }
}
