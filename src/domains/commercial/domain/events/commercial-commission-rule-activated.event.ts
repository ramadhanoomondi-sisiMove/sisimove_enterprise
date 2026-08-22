// -----------------------------------------------------------------------------
// Commercial Commission Rule Activated Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { CommercialDomainEvent } from './commercial-domain.event';

// -----------------------------------------------------------------------------
// Commercial Commission Rule Activated
// -----------------------------------------------------------------------------

/**
 * Raised when a Commercial Commission Rule aggregate is activated.
 *
 * Commercial Commission Rule is an independent aggregate root within the
 * Commercial bounded context.
 *
 * Aggregate identity is therefore represented by DomainEvent.metadata.
 * The event payload contains the public rule identity and the complete
 * effective rule snapshot required by downstream consumers.
 *
 * The event does not reference a fictional parent Commercial aggregate.
 */
export class CommercialCommissionRuleActivatedEvent extends CommercialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    aggregateId: string,
    commissionRulePublicId: string,
    type: string,
    percentage: string,
    effectiveFrom: Date,
    effectiveTo: Date | undefined,
    version: number,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'CommercialCommissionRule',
      'CommercialCommissionRuleActivated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.commissionRulePublicId = commissionRulePublicId;
    this.type = type;
    this.percentage = percentage;
    this.effectiveFrom = new Date(effectiveFrom.getTime());
    this.effectiveTo =
      effectiveTo !== undefined ? new Date(effectiveTo.getTime()) : undefined;
    this.version = version;

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Commission Rule Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the activated Commercial Commission Rule.
   */
  public readonly commissionRulePublicId: string;

  // ---------------------------------------------------------------------------
  // Commission Rule Snapshot
  // ---------------------------------------------------------------------------

  /**
   * Commission rule type.
   *
   * Expected values:
   *
   * - BOOKING
   * - EARNING
   */
  public readonly type: string;

  /**
   * Commission percentage defined by the activated rule.
   */
  public readonly percentage: string;

  /**
   * Timestamp from which the commission rule becomes effective.
   */
  public readonly effectiveFrom: Date;

  /**
   * Timestamp until which the commission rule remains effective.
   *
   * Undefined represents an open-ended effective period.
   */
  public readonly effectiveTo: Date | undefined;

  /**
   * Version of the activated commission rule.
   */
  public readonly version: number;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  /**
   * Returns the event payload.
   *
   * Aggregate identity is intentionally excluded because it is already
   * represented in DomainEvent.metadata.
   */
  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      commissionRulePublicId: this.commissionRulePublicId,

      type: this.type,

      percentage: this.percentage,

      effectiveFrom: this.effectiveFrom,

      ...(this.effectiveTo !== undefined
        ? {
            effectiveTo: this.effectiveTo,
          }
        : {}),

      version: this.version,
    };
  }
}
