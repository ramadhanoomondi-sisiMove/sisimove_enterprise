// -----------------------------------------------------------------------------
// Commercial Commission Rule Created Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { CommercialDomainEvent } from './commercial-domain.event';

// -----------------------------------------------------------------------------
// Commercial Commission Rule Created
// -----------------------------------------------------------------------------

/**
 * Raised when a Commercial Commission Rule aggregate is created.
 *
 * CommercialCommissionRule is an independent aggregate root within the
 * Commercial bounded context.
 *
 * Aggregate identity is therefore represented by DomainEvent.metadata.
 * The event payload contains the public rule identity and the complete
 * immutable rule snapshot captured at creation time.
 *
 * This event does not reference or imply the existence of a parent
 * CommercialAggregate.
 */
export class CommercialCommissionRuleCreatedEvent extends CommercialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    aggregateId: string,
    commissionRulePublicId: string,
    type: string,
    percentage: string,
    status: string,
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
      'CommercialCommissionRuleCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.commissionRulePublicId = commissionRulePublicId;
    this.type = type;
    this.percentage = percentage;
    this.status = status;
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
   * Public identity of the Commercial Commission Rule.
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
   * Commission percentage captured by the rule at creation time.
   */
  public readonly percentage: string;

  /**
   * Lifecycle status of the commission rule at creation time.
   */
  public readonly status: string;

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
   * Version of the commission rule.
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

      status: this.status,

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
