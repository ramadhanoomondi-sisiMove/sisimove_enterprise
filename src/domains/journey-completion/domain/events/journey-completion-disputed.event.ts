// -----------------------------------------------------------------------------
// Journey Completion Disputed Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Completion Disputed
// -----------------------------------------------------------------------------

/**
 * Raised when a Journey Completion is disputed.
 *
 * The event records the dispute identity, the member who raised the dispute,
 * the dispute reason, optional description, and the time at which the dispute
 * was opened.
 *
 * Internal persistence identifiers are used only for aggregate identity and
 * are never exposed as cross-domain references in the event payload.
 */
export class JourneyCompletionDisputedEvent extends JourneyCompletionDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyCompletionId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    disputePublicId: string,
    raisedByPublicId: string,
    reason: string,
    openedAt: Date,
    description?: string,
    correlationId?: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyCompletionId,
      publicId,
      journeyPublicId,
      providerPublicId,
      'JourneyCompletionDisputed',
      correlationId ?? journeyCompletionId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.disputePublicId = disputePublicId;
    this.raisedByPublicId = raisedByPublicId;
    this.reason = reason;
    this.description = description;
    this.openedAt = new Date(openedAt.getTime());

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Dispute
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the dispute that was opened.
   */
  public readonly disputePublicId: string;

  /**
   * Public identity of the member who raised the dispute.
   */
  public readonly raisedByPublicId: string;

  /**
   * Reason for disputing the Journey Completion.
   */
  public readonly reason: string;

  /**
   * Optional explanation supplied by the member who raised the dispute.
   */
  public readonly description: string | undefined;

  /**
   * Time at which the dispute was opened.
   */
  public readonly openedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      disputePublicId: this.disputePublicId,
      raisedByPublicId: this.raisedByPublicId,
      reason: this.reason,
      ...(this.description !== undefined
        ? {
            description: this.description,
          }
        : {}),
      openedAt: this.openedAt,
    };
  }
}
