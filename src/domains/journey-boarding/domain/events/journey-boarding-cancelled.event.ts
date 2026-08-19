// -----------------------------------------------------------------------------
// Journey Boarding Cancelled Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBoardingDomainEvent } from './journey-boarding-domain.event';

// -----------------------------------------------------------------------------
// Journey Boarding Cancelled
// -----------------------------------------------------------------------------

/**
 * Raised when the Journey Boarding process is cancelled before the physical
 * journey starts.
 *
 * Cancellation is an aggregate-level lifecycle transition and is distinct
 * from participant withdrawal or removal.
 */
export class JourneyBoardingCancelledEvent extends JourneyBoardingDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyBoardingId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    cancelledAt: Date,
    actorPublicId: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyBoardingId,
      publicId,
      journeyPublicId,
      providerPublicId,
      'JourneyBoardingCancelled',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.cancelledAt = new Date(cancelledAt.getTime());

    if (actorPublicId !== undefined) {
      this.actorPublicId = actorPublicId;
    }

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Journey Boarding process was cancelled.
   */
  public readonly cancelledAt: Date;

  /**
   * Public identity of the member who cancelled the boarding process.
   */
  public readonly actorPublicId?: string;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      cancelledAt: this.cancelledAt,
      ...(this.actorPublicId !== undefined
        ? {
            actorPublicId: this.actorPublicId,
          }
        : {}),
    };
  }
}
