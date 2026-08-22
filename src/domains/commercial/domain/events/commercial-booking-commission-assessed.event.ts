// -----------------------------------------------------------------------------
// Commercial Booking Commission Assessed Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { CommercialDomainEvent } from './commercial-domain.event';

// -----------------------------------------------------------------------------
// Commercial Booking Commission Assessed
// -----------------------------------------------------------------------------

/**
 * Raised when a Commercial Booking Commission aggregate is assessed.
 *
 * The event contains the immutable commercial assessment snapshot together
 * with the timestamp at which the assessment occurred.
 */
export class CommercialBookingCommissionAssessedEvent extends CommercialDomainEvent {
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
    assessedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'CommercialBookingCommission',
      'CommercialBookingCommissionAssessed',
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
    this.assessedAt = new Date(assessedAt.getTime());

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Booking Commission Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the assessed Commercial Booking Commission.
   */
  public readonly bookingCommissionPublicId: string;

  // ---------------------------------------------------------------------------
  // Cross-Domain References
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey Booking associated with this commission.
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
   * Public identity of the Commercial Commission Rule used for the
   * assessment.
   */
  public readonly commissionRulePublicId: string;

  // ---------------------------------------------------------------------------
  // Commission Assessment Snapshot
  // ---------------------------------------------------------------------------

  /**
   * Commission percentage captured for this assessment.
   */
  public readonly percentage: string;

  /**
   * Booking amount before the Commercial commission.
   */
  public readonly baseAmount: number;

  /**
   * Commercial commission amount assessed against the booking.
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
   * Time at which the booking commission was assessed.
   */
  public readonly assessedAt: Date;

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
      assessedAt: this.assessedAt,
    };
  }
}
