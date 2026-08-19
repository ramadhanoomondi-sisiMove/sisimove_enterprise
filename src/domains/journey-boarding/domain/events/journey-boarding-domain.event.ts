// -----------------------------------------------------------------------------
// Journey Boarding Domain Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Journey Boarding Domain Event
// -----------------------------------------------------------------------------

/**
 * Base domain event for the Journey Boarding aggregate.
 *
 * All Journey Boarding domain events inherit the common aggregate identity
 * and cross-domain boarding references defined here.
 *
 * The event intentionally exposes public domain identifiers rather than
 * Prisma/internal persistence identifiers.
 */
export abstract class JourneyBoardingDomainEvent extends DomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  protected constructor(
    journeyBoardingId: string,
    publicId: string,
    journeyId: string,
    providerPublicId: string,
    eventName: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyBoardingId,
      'JourneyBoarding',
      eventName,
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.journeyId = journeyId;
    this.providerPublicId = providerPublicId;
  }

  // ---------------------------------------------------------------------------
  // Aggregate Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey Boarding aggregate.
   */
  public readonly publicId: string;

  /**
   * Public identity of the Journey associated with this boarding process.
   *
   * This is a cross-domain reference and is intentionally represented as a
   * public identifier rather than a Journey-domain relation.
   */
  public readonly journeyId: string;

  /**
   * Public identity of the journey provider.
   *
   * This is a cross-domain identity reference.
   */
  public readonly providerPublicId: string;

  // ---------------------------------------------------------------------------
  // Base Payload
  // ---------------------------------------------------------------------------

  /**
   * Returns the common payload shared by every Journey Boarding event.
   *
   * Concrete events should extend this payload with event-specific state.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {
      journeyBoardingPublicId: this.publicId,
      journeyPublicId: this.journeyId,
      providerPublicId: this.providerPublicId,
    };
  }
}
