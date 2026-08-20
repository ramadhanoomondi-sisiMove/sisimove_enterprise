// -----------------------------------------------------------------------------
// Journey Completion Confirmed Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Completion Confirmed
// -----------------------------------------------------------------------------

/**
 * Raised when a Journey Completion satisfies its confirmation requirement
 * and transitions into the CONFIRMED state.
 *
 * The event records the confirmation timestamp and the final confirmation
 * count used to satisfy the completion requirement.
 *
 * Internal persistence identifiers are used only for aggregate identity and
 * are never exposed as cross-domain references in the event payload.
 */
export class JourneyCompletionConfirmedEvent extends JourneyCompletionDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyCompletionId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    confirmedAt: Date,
    confirmedCount: number,
    requiredConfirmations: number,
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
      'JourneyCompletionConfirmed',
      correlationId ?? journeyCompletionId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.confirmedAt = new Date(confirmedAt.getTime());
    this.confirmedCount = confirmedCount;
    this.requiredConfirmations = requiredConfirmations;

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Confirmation
  // ---------------------------------------------------------------------------

  /**
   * Time at which Journey Completion became confirmed.
   */
  public readonly confirmedAt: Date;

  /**
   * Number of active confirmations at the time completion was confirmed.
   */
  public readonly confirmedCount: number;

  /**
   * Number of confirmations required for completion confirmation.
   */
  public readonly requiredConfirmations: number;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      confirmedAt: this.confirmedAt,
      confirmedCount: this.confirmedCount,
      requiredConfirmations: this.requiredConfirmations,
    };
  }
}
