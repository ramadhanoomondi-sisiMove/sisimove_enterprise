// -----------------------------------------------------------------------------
// Journey Completion Dispute Resolved Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Completion Dispute Resolved
// -----------------------------------------------------------------------------

/**
 * Raised when a Journey Completion dispute is resolved.
 *
 * The event records the public identity of the dispute, the member who
 * resolved it, the resolution summary, and the time at which the resolution
 * was completed.
 *
 * Internal persistence identifiers are used only for aggregate identity and
 * are never exposed as cross-domain references in the event payload.
 */
export class JourneyCompletionDisputeResolvedEvent extends JourneyCompletionDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyCompletionId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    disputePublicId: string,
    resolvedByPublicId: string,
    resolvedAt: Date,
    resolutionSummary?: string,
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
      'JourneyCompletionDisputeResolved',
      correlationId ?? journeyCompletionId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.disputePublicId = disputePublicId;
    this.resolvedByPublicId = resolvedByPublicId;
    this.resolvedAt = new Date(resolvedAt.getTime());
    this.resolutionSummary = resolutionSummary;

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Dispute Resolution
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the dispute that was resolved.
   */
  public readonly disputePublicId: string;

  /**
   * Public identity of the member who resolved the dispute.
   */
  public readonly resolvedByPublicId: string;

  /**
   * Time at which the dispute was resolved.
   */
  public readonly resolvedAt: Date;

  /**
   * Optional summary describing the dispute resolution.
   */
  public readonly resolutionSummary: string | undefined;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      disputePublicId: this.disputePublicId,
      resolvedByPublicId: this.resolvedByPublicId,
      resolvedAt: this.resolvedAt,
      ...(this.resolutionSummary !== undefined
        ? {
            resolutionSummary: this.resolutionSummary,
          }
        : {}),
    };
  }
}
