// -----------------------------------------------------------------------------
// Journey Settlement Held Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Settlement Held
// -----------------------------------------------------------------------------

/**
 * Raised when a Journey Settlement is placed on hold.
 *
 * A held settlement remains part of the Journey settlement lifecycle but
 * cannot proceed to completion until the hold is released or otherwise
 * resolved.
 *
 * The event records the public identity of the settlement together with the
 * Journey Completion context and provider responsible for the settlement.
 *
 * Internal persistence identifiers are used only as the aggregate identity
 * required by the event infrastructure and are never exposed as domain
 * references in the event payload.
 */
export class JourneySettlementHeldEvent extends JourneyCompletionDomainEvent {
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
      'JourneySettlementHeld',
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
   * Public identity of the Journey Settlement that was placed on hold.
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