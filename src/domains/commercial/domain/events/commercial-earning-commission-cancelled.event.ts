// -----------------------------------------------------------------------------
// Commercial Earning Commission Cancelled Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { CommercialDomainEvent } from './commercial-domain.event';

// -----------------------------------------------------------------------------
// Commercial Earning Commission Cancelled
// -----------------------------------------------------------------------------

/**
 * Raised when a Commercial Earning Commission is cancelled.
 *
 * The event identifies the earning commission and preserves the complete
 * commercial assessment snapshot associated with it.
 */
export class CommercialEarningCommissionCancelledEvent extends CommercialDomainEvent {
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
    cancelledAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'CommercialEarningCommission',
      'CommercialEarningCommissionCancelled',
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

    this.cancelledAt = new Date(cancelledAt.getTime());

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
  // Commission Assessment Snapshot
  // ---------------------------------------------------------------------------

  public readonly percentage: string;

  public readonly baseAmount: number;

  public readonly commissionAmount: number;

  public readonly netAmount: number;

  public readonly currency: string;

  // ---------------------------------------------------------------------------
  // Cancellation
  // ---------------------------------------------------------------------------

  public readonly cancelledAt: Date;

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

      cancelledAt: new Date(this.cancelledAt.getTime()),
    };
  }
}
