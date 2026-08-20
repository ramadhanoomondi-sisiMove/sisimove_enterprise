// -----------------------------------------------------------------------------
// Journey Settlement Submitted Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Settlement Submitted
// -----------------------------------------------------------------------------

/**
 * Raised when a Journey Settlement is submitted for financial processing.
 *
 * The event records the settlement public identity together with the Journey
 * Completion context and the provider responsible for the settlement.
 *
 * Internal persistence identifiers are used only as the aggregate identity
 * required by the event infrastructure and are never exposed as domain
 * references in the event payload.
 */
export class JourneySettlementSubmittedEvent extends JourneyCompletionDomainEvent {
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
      'JourneySettlementSubmitted',
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
   * Public identity of the Journey Settlement that was submitted.
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
