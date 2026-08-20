// -----------------------------------------------------------------------------
// Journey Completion Dispute Opened Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Completion Dispute Opened
// -----------------------------------------------------------------------------

/**
 * Raised when a Journey Completion dispute is formally opened.
 *
 * This event records the creation of the dispute and the information
 * necessary for downstream consumers to understand why the completion
 * entered the dispute workflow.
 *
 * Internal persistence identifiers are used only for aggregate identity and
 * are never exposed as cross-domain references in the event payload.
 */
export class JourneyCompletionDisputeOpenedEvent extends JourneyCompletionDomainEvent {
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
      'JourneyCompletionDisputeOpened',
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
   * Reason for the dispute.
   */
  public readonly reason: string;

  /**
   * Optional description supplied by the member who raised the dispute.
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
