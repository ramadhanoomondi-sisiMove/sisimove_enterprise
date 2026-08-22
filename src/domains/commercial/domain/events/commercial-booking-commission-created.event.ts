// -----------------------------------------------------------------------------
// Commercial Booking Commission Created Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { CommercialDomainEvent } from './commercial-domain.event';

// -----------------------------------------------------------------------------
// Commercial Booking Commission Created
// -----------------------------------------------------------------------------

/**
 * Raised when a Commercial Booking Commission aggregate is created.
 *
 * The Commercial Booking Commission is an independent aggregate root within
 * the Commercial bounded context.
 *
 * The aggregate identity is therefore represented by DomainEvent.metadata,
 * while the booking commission public identity and commercial assessment
 * snapshot are represented in the event payload.
 */
export class CommercialBookingCommissionCreatedEvent extends CommercialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    aggregateId: string,
    bookingCommissionPublicId: string,
    bookingPublicId: string,
    journeyPublicId: string,
    commissionRulePublicId: string,
    percentage: string,
    baseAmount: number,
    commissionAmount: number,
    currency: string,
    status: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'CommercialBookingCommission',
      'CommercialBookingCommissionCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.bookingCommissionPublicId = bookingCommissionPublicId;
    this.bookingPublicId = bookingPublicId;
    this.journeyPublicId = journeyPublicId;
    this.commissionRulePublicId = commissionRulePublicId;
    this.percentage = percentage;
    this.baseAmount = baseAmount;
    this.commissionAmount = commissionAmount;
    this.currency = currency;
    this.status = status;

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Booking Commission Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Commercial Booking Commission.
   */
  public readonly bookingCommissionPublicId: string;

  // ---------------------------------------------------------------------------
  // Cross-Domain References
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey Booking associated with this commission.
   *
   * This is a cross-domain reference and is intentionally represented as a
   * public identifier rather than a domain object or persistence relation.
   */
  public readonly bookingPublicId: string;

  /**
   * Public identity of the Journey associated with this commission.
   */
  public readonly journeyPublicId: string;

  // ---------------------------------------------------------------------------
  // Commission Rule Reference
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Commercial Commission Rule used to calculate
   * this commission.
   */
  public readonly commissionRulePublicId: string;

  // ---------------------------------------------------------------------------
  // Commission Assessment Snapshot
  // ---------------------------------------------------------------------------

  /**
   * Commission percentage captured at creation time.
   */
  public readonly percentage: string;

  /**
   * Booking amount before the Commercial commission.
   */
  public readonly baseAmount: number;

  /**
   * Commercial commission amount calculated from the booking amount.
   */
  public readonly commissionAmount: number;

  /**
   * Currency of the commercial assessment.
   */
  public readonly currency: string;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Lifecycle status of the booking commission at creation time.
   */
  public readonly status: string;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      bookingCommissionPublicId: this.bookingCommissionPublicId,
      bookingPublicId: this.bookingPublicId,
      journeyPublicId: this.journeyPublicId,
      commissionRulePublicId: this.commissionRulePublicId,
      percentage: this.percentage,
      baseAmount: this.baseAmount,
      commissionAmount: this.commissionAmount,
      currency: this.currency,
      status: this.status,
    };
  }
}
