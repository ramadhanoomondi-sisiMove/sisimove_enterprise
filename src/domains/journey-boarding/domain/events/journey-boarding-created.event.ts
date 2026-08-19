// -----------------------------------------------------------------------------
// Journey Boarding Created Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBoardingDomainEvent } from './journey-boarding-domain.event';

// -----------------------------------------------------------------------------
// Journey Boarding Created
// -----------------------------------------------------------------------------

/**
 * Raised when a Journey Boarding aggregate is created.
 *
 * The event records the public identity of the boarding, the Journey it
 * belongs to, and the provider responsible for the journey.
 *
 * Internal persistence identifiers are used only as the aggregate identity
 * required by the event infrastructure and are not exposed as domain
 * references in the event payload.
 */
export class JourneyBoardingCreatedEvent extends JourneyBoardingDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyBoardingId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
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
      'JourneyBoardingCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return this.getBasePayload();
  }
}
