// -----------------------------------------------------------------------------
// Journey Completion Dispute Rejected Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Completion Dispute Rejected
// -----------------------------------------------------------------------------

/**
 * Raised when a Journey Completion dispute is rejected.
 *
 * The event records the public identity of the dispute, the member who
 * rejected it, the rejection summary, and the time at which the dispute
 * entered the REJECTED state.
 *
 * Internal persistence identifiers are used only for aggregate identity and
 * are never exposed as cross-domain references in the event payload.
 */
export class JourneyCompletionDisputeRejectedEvent extends JourneyCompletionDomainEvent {
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
    rejectedAt: Date,
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
      'JourneyCompletionDisputeRejected',
      correlationId ?? journeyCompletionId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.disputePublicId = disputePublicId;
    this.resolvedByPublicId = resolvedByPublicId;
    this.rejectedAt = new Date(rejectedAt.getTime());
    this.resolutionSummary = resolutionSummary;

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Dispute Resolution
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the dispute that was rejected.
   */
  public readonly disputePublicId: string;

  /**
   * Public identity of the member who rejected the dispute.
   *
   * The persistence model uses `resolvedByPublicId` for both resolution and
   * rejection actions, so the event retains that domain naming.
   */
  public readonly resolvedByPublicId: string;

  /**
   * Time at which the dispute was rejected.
   */
  public readonly rejectedAt: Date;

  /**
   * Optional explanation describing why the dispute was rejected.
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
      rejectedAt: this.rejectedAt,
      ...(this.resolutionSummary !== undefined
        ? {
            resolutionSummary: this.resolutionSummary,
          }
        : {}),
    };
  }
}
