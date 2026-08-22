// -----------------------------------------------------------------------------
// Commercial Commission Rule Updated Event
// -----------------------------------------------------------------------------
//
// Raised when a Commercial Commission Rule is updated.
//
// The Commercial Commission Rule is an independent aggregate root. Therefore
// the event metadata identifies the actual CommercialCommissionRule aggregate.
//
// The event contains the complete current rule snapshot so downstream
// consumers do not need to reconstruct the rule from previous events.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { CommercialDomainEvent } from './commercial-domain.event';

// -----------------------------------------------------------------------------
// Commercial Commission Rule Updated
// -----------------------------------------------------------------------------

/**
 * Raised when a Commercial Commission Rule is updated.
 *
 * The Commercial Commission Rule is an independent aggregate root within the
 * Commercial bounded context.
 *
 * Aggregate identity is represented by:
 *
 * - metadata.aggregateId
 * - commissionRulePublicId in the event payload
 *
 * There is intentionally no commercialId or commercialPublicId because the
 * Commercial bounded context does not have a parent Commercial aggregate.
 *
 * The event contains the complete current commission rule snapshot so
 * downstream consumers can process the update without reconstructing state
 * from previous events.
 */
export class CommercialCommissionRuleUpdatedEvent extends CommercialDomainEvent {
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
      'CommercialCommissionRuleUpdated',
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
   * Public identity of the updated Commercial Commission Rule.
   *
   * This is the externally stable identity of the aggregate.
   */
  public readonly commissionRulePublicId: string;

  // ---------------------------------------------------------------------------
  // Commission Rule Snapshot
  // ---------------------------------------------------------------------------

  /**
   * Commission rule type.
   *
   * Expected values are BOOKING or EARNING.
   */
  public readonly type: string;

  /**
   * Current commission percentage configured on the rule.
   *
   * Stored as a string in the event contract to preserve the decimal value
   * without floating-point ambiguity.
   */
  public readonly percentage: string;

  /**
   * Current lifecycle status of the commission rule.
   */
  public readonly status: string;

  /**
   * Timestamp from which the commission rule is effective.
   */
  public readonly effectiveFrom: Date;

  /**
   * Timestamp until which the commission rule remains effective.
   *
   * Undefined represents an open-ended effective period.
   */
  public readonly effectiveTo: Date | undefined;

  /**
   * Current version of the commercial commission policy.
   */
  public readonly version: number;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  /**
   * Returns the serialized event payload.
   *
   * Aggregate metadata is supplied by DomainEvent and is therefore not
   * duplicated here.
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
