// -----------------------------------------------------------------------------
// Journey Settlement Created Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Settlement Created
// -----------------------------------------------------------------------------

/**
 * Raised when a Journey Settlement is created for a completed Journey.
 *
 * The event records the public identities required by downstream domains
 * without exposing internal persistence identifiers as domain references.
 *
 * A Journey Settlement belongs to a Journey Completion and represents the
 * settlement lifecycle that follows successful journey completion.
 */
export class JourneySettlementCreatedEvent extends JourneyCompletionDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyCompletionId: string,
    completionPublicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    settlementPublicId: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyCompletionId,
      completionPublicId,
      journeyPublicId,
      providerPublicId,
      'JourneySettlementCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.settlementPublicId = settlementPublicId;

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Settlement Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey Settlement that was created.
   */
  public readonly settlementPublicId: string;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      settlementPublicId: this.settlementPublicId,
    };
  }
}
