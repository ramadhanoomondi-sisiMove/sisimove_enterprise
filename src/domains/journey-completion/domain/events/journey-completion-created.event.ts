// -----------------------------------------------------------------------------
// Journey Completion Created Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Completion Created
// -----------------------------------------------------------------------------

/**
 * Raised when a Journey Completion aggregate is created.
 *
 * The event records the public identity of the completion, the Journey it
 * belongs to, and the provider responsible for the journey.
 *
 * Internal persistence identifiers are used only as the aggregate identity
 * required by the event infrastructure and are not exposed as domain
 * references in the event payload.
 */
export class JourneyCompletionCreatedEvent extends JourneyCompletionDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyCompletionId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyCompletionId,
      publicId,
      journeyPublicId,
      providerPublicId,
      'JourneyCompletionCreated',
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
