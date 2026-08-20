// -----------------------------------------------------------------------------
// Journey Completion Dispute Under Review Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Completion Dispute Under Review
// -----------------------------------------------------------------------------

/**
 * Raised when a Journey Completion dispute enters the UNDER_REVIEW state.
 *
 * The event records the public identity of the dispute and the time at which
 * the dispute entered the review workflow.
 *
 * Internal persistence identifiers are used only for aggregate identity and
 * are never exposed as cross-domain references in the event payload.
 */
export class JourneyCompletionDisputeUnderReviewEvent extends JourneyCompletionDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyCompletionId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    disputePublicId: string,
    underReviewAt: Date,
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
      'JourneyCompletionDisputeUnderReview',
      correlationId ?? journeyCompletionId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.disputePublicId = disputePublicId;
    this.underReviewAt = new Date(underReviewAt.getTime());

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Dispute
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the dispute that entered review.
   */
  public readonly disputePublicId: string;

  /**
   * Time at which the dispute entered the review workflow.
   */
  public readonly underReviewAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      disputePublicId: this.disputePublicId,
      underReviewAt: this.underReviewAt,
    };
  }
}
