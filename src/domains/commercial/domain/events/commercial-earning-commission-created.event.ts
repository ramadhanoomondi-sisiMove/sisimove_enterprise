// -----------------------------------------------------------------------------
// Commercial Earning Commission Created Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { CommercialDomainEvent } from './commercial-domain.event';

// -----------------------------------------------------------------------------
// Commercial Earning Commission Created
// -----------------------------------------------------------------------------

/**
 * Raised when a Commercial Earning Commission aggregate is created.
 *
 * The event contains the complete commercial assessment snapshot required
 * by downstream consumers.
 *
 * Aggregate identity is stored in DomainEvent.metadata.
 */
export class CommercialEarningCommissionCreatedEvent extends CommercialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    aggregateId: string,
    earningCommissionPublicId: string,
    journeyPublicId: string,
    settlementPublicId: string,
    providerPublicId: string,
    commissionRulePublicId: string,
    percentage: string,
    baseAmount: number,
    commissionAmount: number,
    netAmount: number,
    currency: string,
    status: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'CommercialEarningCommission',
      'CommercialEarningCommissionCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.earningCommissionPublicId = earningCommissionPublicId;
    this.journeyPublicId = journeyPublicId;
    this.settlementPublicId = settlementPublicId;
    this.providerPublicId = providerPublicId;
    this.commissionRulePublicId = commissionRulePublicId;
    this.percentage = percentage;
    this.baseAmount = baseAmount;
    this.commissionAmount = commissionAmount;
    this.netAmount = netAmount;
    this.currency = currency;
    this.status = status;

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
  // Commission Rule Reference
  // ---------------------------------------------------------------------------

  public readonly commissionRulePublicId: string;

  // ---------------------------------------------------------------------------
  // Commission Assessment Snapshot
  // ---------------------------------------------------------------------------

  public readonly percentage: string;

  public readonly baseAmount: number;

  public readonly commissionAmount: number;

  public readonly netAmount: number;

  public readonly currency: string;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  public readonly status: string;

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

      commissionRulePublicId: this.commissionRulePublicId,

      percentage: this.percentage,

      baseAmount: this.baseAmount,

      commissionAmount: this.commissionAmount,

      netAmount: this.netAmount,

      currency: this.currency,

      status: this.status,
    };
  }
}
