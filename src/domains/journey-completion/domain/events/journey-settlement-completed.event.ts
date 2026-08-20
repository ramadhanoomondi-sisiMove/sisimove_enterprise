// -----------------------------------------------------------------------------
// Journey Settlement Completed Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Settlement Completed
// -----------------------------------------------------------------------------

/**
 * Raised when a Journey Settlement has been successfully completed.
 *
 * The event records the public identity of the settlement together with the
 * Journey Completion context and the provider responsible for the settlement.
 *
 * The Financial domain transaction reference is intentionally not required
 * here because settlement completion is represented by the Journey domain
 * state transition itself.
 *
 * Internal persistence identifiers are used only as the aggregate identity
 * required by the event infrastructure and are never exposed as domain
 * references in the event payload.
 */
export class JourneySettlementCompletedEvent extends JourneyCompletionDomainEvent {
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
      'JourneySettlementCompleted',
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
   * Public identity of the Journey Settlement that was completed.
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
