// -----------------------------------------------------------------------------
// Journey Completion Dispute Withdrawn Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Completion Dispute Withdrawn
// -----------------------------------------------------------------------------

/**
 * Raised when a Journey Completion dispute is withdrawn by the member who
 * raised it.
 *
 * The event records the public identity of the dispute, the member who
 * withdrew it, and the time at which the withdrawal occurred.
 *
 * Internal persistence identifiers are used only for aggregate identity and
 * are never exposed as cross-domain references in the event payload.
 */
export class JourneyCompletionDisputeWithdrawnEvent extends JourneyCompletionDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyCompletionId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    disputePublicId: string,
    withdrawnByPublicId: string,
    withdrawnAt: Date,
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
      'JourneyCompletionDisputeWithdrawn',
      correlationId ?? journeyCompletionId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.disputePublicId = disputePublicId;
    this.withdrawnByPublicId = withdrawnByPublicId;
    this.withdrawnAt = new Date(withdrawnAt.getTime());

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Dispute
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the dispute that was withdrawn.
   */
  public readonly disputePublicId: string;

  /**
   * Public identity of the member who withdrew the dispute.
   */
  public readonly withdrawnByPublicId: string;

  /**
   * Time at which the dispute was withdrawn.
   */
  public readonly withdrawnAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      disputePublicId: this.disputePublicId,
      withdrawnByPublicId: this.withdrawnByPublicId,
      withdrawnAt: this.withdrawnAt,
    };
  }
}