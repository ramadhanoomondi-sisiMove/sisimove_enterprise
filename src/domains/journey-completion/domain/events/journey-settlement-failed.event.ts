// -----------------------------------------------------------------------------
// Journey Settlement Failed Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Settlement Failed
// -----------------------------------------------------------------------------

/**
 * Raised when processing of a Journey Settlement fails.
 *
 * The event records the public identity of the settlement together with the
 * Journey Completion context, provider identity, and failure reason.
 *
 * The failure reason is an informational domain value describing why the
 * settlement could not be completed. It intentionally does not expose
 * internal persistence identifiers.
 */
export class JourneySettlementFailedEvent extends JourneyCompletionDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyCompletionId: string,
    completionPublicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    settlementPublicId: string,
    failureReason: string,
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
      'JourneySettlementFailed',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.settlementPublicId = settlementPublicId;
    this.failureReason = failureReason;

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Settlement Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey Settlement that failed.
   */
  public readonly settlementPublicId: string;

  // ---------------------------------------------------------------------------
  // Failure
  // ---------------------------------------------------------------------------

  /**
   * Reason why settlement processing failed.
   */
  public readonly failureReason: string;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      settlementPublicId: this.settlementPublicId,
      failureReason: this.failureReason,
    };
  }
}
