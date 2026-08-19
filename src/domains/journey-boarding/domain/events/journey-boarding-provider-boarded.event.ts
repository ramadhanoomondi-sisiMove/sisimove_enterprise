// -----------------------------------------------------------------------------
// Journey Boarding Provider Boarded Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBoardingDomainEvent } from './journey-boarding-domain.event';

// -----------------------------------------------------------------------------
// Journey Boarding Provider Boarded
// -----------------------------------------------------------------------------

/**
 * Raised when the journey provider physically boards.
 *
 * Provider boarding is a participant-level event and is distinct from
 * JOURNEY_STARTED. The journey only starts when the aggregate explicitly
 * transitions to STARTED.
 */
export class JourneyBoardingProviderBoardedEvent extends JourneyBoardingDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyBoardingId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    memberPublicId: string,
    occurredAt: Date,
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
      'JourneyBoardingProviderBoarded',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.memberPublicId = memberPublicId;
    this.occurredAt = new Date(occurredAt.getTime());

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Participant
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the provider who physically boarded.
   */
  public readonly memberPublicId: string;

  /**
   * Time at which the provider physically boarded.
   */
  public readonly occurredAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      memberPublicId: this.memberPublicId,
      occurredAt: this.occurredAt,
    };
  }
}
