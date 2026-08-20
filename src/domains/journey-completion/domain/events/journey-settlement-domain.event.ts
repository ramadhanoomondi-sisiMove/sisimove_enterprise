// -----------------------------------------------------------------------------
// Journey Settlement Domain Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Journey Settlement Domain Event
// -----------------------------------------------------------------------------

/**
 * Base domain event for the Journey Settlement aggregate.
 *
 * All Journey Settlement domain events inherit the common aggregate identity
 * and cross-domain references defined here.
 *
 * The event intentionally exposes public domain identifiers rather than
 * Prisma/internal persistence identifiers.
 *
 * Journey Settlement is its own aggregate and therefore owns its own event
 * stream independently from Journey Completion.
 */
export abstract class JourneySettlementDomainEvent extends DomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  protected constructor(
    journeySettlementId: string,
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
      journeySettlementId,
      'JourneySettlement',
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

  // ===========================================================================
  // Aggregate Identity
  // ===========================================================================

  /**
   * Public identity of the Journey Settlement aggregate.
   *
   * This is the stable public domain identifier used across bounded-context
   * and integration boundaries.
   */
  public readonly publicId: string;

  // ===========================================================================
  // Journey Reference
  // ===========================================================================

  /**
   * Public identity of the Journey associated with this settlement.
   *
   * This is a cross-domain reference and intentionally does not expose a
   * Journey-domain entity or internal persistence identifier.
   */
  public readonly journeyPublicId: string;

  // ===========================================================================
  // Provider Reference
  // ===========================================================================

  /**
   * Public identity of the journey provider associated with this settlement.
   *
   * This is a cross-domain identity reference and intentionally does not
   * expose an internal Identity-domain persistence identifier.
   */
  public readonly providerPublicId: string;

  // ===========================================================================
  // Base Payload
  // ===========================================================================

  /**
   * Returns the common payload shared by every Journey Settlement event.
   *
   * Concrete settlement events should extend this payload with
   * event-specific state.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {
      journeySettlementPublicId: this.publicId,
      journeyPublicId: this.journeyPublicId,
      providerPublicId: this.providerPublicId,
    };
  }
}
