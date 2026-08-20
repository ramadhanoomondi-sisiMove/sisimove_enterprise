// -----------------------------------------------------------------------------
// Journey Completion Requested Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Completion Requested
// -----------------------------------------------------------------------------

/**
 * Raised when completion of a Journey is formally requested.
 *
 * This event marks the transition from the initial completion state into
 * the confirmation workflow.
 *
 * The event intentionally exposes public domain identifiers rather than
 * internal persistence identifiers.
 */
export class JourneyCompletionRequestedEvent extends JourneyCompletionDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyCompletionId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    completionRequestedAt: Date,
    requiredConfirmations: number,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyCompletionId,
      publicId,
      journeyPublicId,
      providerPublicId,
      'JourneyCompletionRequested',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.completionRequestedAt = new Date(completionRequestedAt.getTime());
    this.requiredConfirmations = requiredConfirmations;

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Event State
  // ---------------------------------------------------------------------------

  /**
   * Time at which completion was requested.
   */
  public readonly completionRequestedAt: Date;

  /**
   * Number of confirmations required before the completion can be confirmed.
   */
  public readonly requiredConfirmations: number;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      completionRequestedAt: this.completionRequestedAt,
      requiredConfirmations: this.requiredConfirmations,
    };
  }
}
