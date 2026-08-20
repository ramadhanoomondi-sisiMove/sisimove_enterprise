// -----------------------------------------------------------------------------
// Journey Completion Domain Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Journey Completion Domain Event
// -----------------------------------------------------------------------------

/**
 * Base domain event for the Journey Completion aggregate.
 *
 * All Journey Completion domain events inherit the common aggregate identity
 * and cross-domain journey/provider references defined here.
 *
 * The event intentionally exposes public domain identifiers rather than
 * Prisma/internal persistence identifiers.
 */
export abstract class JourneyCompletionDomainEvent extends DomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  protected constructor(
    journeyCompletionId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    eventName: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyCompletionId,
      'JourneyCompletion',
      eventName,
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.journeyPublicId = journeyPublicId;
    this.providerPublicId = providerPublicId;
  }

  // ---------------------------------------------------------------------------
  // Aggregate Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey Completion aggregate.
   */
  public readonly publicId: string;

  /**
   * Public identity of the Journey associated with this completion process.
   *
   * This is a cross-domain reference and is intentionally represented as a
   * public identifier rather than a Journey-domain relation.
   */
  public readonly journeyPublicId: string;

  /**
   * Public identity of the journey provider.
   *
   * This is a cross-domain identity reference and intentionally does not
   * expose an internal Identity-domain persistence identifier.
   */
  public readonly providerPublicId: string;

  // ---------------------------------------------------------------------------
  // Base Payload
  // ---------------------------------------------------------------------------

  /**
   * Returns the common payload shared by every Journey Completion event.
   *
   * Concrete events should extend this payload with event-specific state.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {
      journeyCompletionPublicId: this.publicId,
      journeyPublicId: this.journeyPublicId,
      providerPublicId: this.providerPublicId,
    };
  }
}
