// -----------------------------------------------------------------------------
// Commercial Earning Commission Assessed Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { CommercialDomainEvent } from './commercial-domain.event';

// -----------------------------------------------------------------------------
// Commercial Earning Commission Assessed
// -----------------------------------------------------------------------------

/**
 * Raised when a Commercial Earning Commission is assessed.
 *
 * The event records the immutable commercial assessment snapshot together
 * with the resulting provider net earning.
 */
export class CommercialEarningCommissionAssessedEvent extends CommercialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    aggregateId: string,
    earningCommissionPublicId: string,
    journeyPublicId: string,
    settlementPublicId: string,
    providerPublicId: string,
    percentage: string,
    baseAmount: number,
    commissionAmount: number,
    netAmount: number,
    currency: string,
    assessedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'CommercialEarningCommission',
      'CommercialEarningCommissionAssessed',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.earningCommissionPublicId = earningCommissionPublicId;
    this.journeyPublicId = journeyPublicId;
    this.settlementPublicId = settlementPublicId;
    this.providerPublicId = providerPublicId;

    this.percentage = percentage;
    this.baseAmount = baseAmount;
    this.commissionAmount = commissionAmount;
    this.netAmount = netAmount;
    this.currency = currency;

    this.assessedAt = new Date(assessedAt.getTime());

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Earning Commission Identity
  // ---------------------------------------------------------------------------

  public readonly earningCommissionPublicId: string;

  // ---------------------------------------------------------------------------
  // Cross-Domain References
  // ---------------------------------------------------------------------------

  public readonly journeyPublicId: string;

  public readonly settlementPublicId: string;

  public readonly providerPublicId: string;

  // ---------------------------------------------------------------------------
  // Assessment Snapshot
  // ---------------------------------------------------------------------------

  public readonly percentage: string;

  public readonly baseAmount: number;

  public readonly commissionAmount: number;

  public readonly netAmount: number;

  public readonly currency: string;

  // ---------------------------------------------------------------------------
  // Assessment
  // ---------------------------------------------------------------------------

  public readonly assessedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      earningCommissionPublicId: this.earningCommissionPublicId,

      journeyPublicId: this.journeyPublicId,

      settlementPublicId: this.settlementPublicId,

      providerPublicId: this.providerPublicId,

      percentage: this.percentage,

      baseAmount: this.baseAmount,

      commissionAmount: this.commissionAmount,

      netAmount: this.netAmount,

      currency: this.currency,

      assessedAt: new Date(this.assessedAt.getTime()),
    };
  }
}
