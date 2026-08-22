// -----------------------------------------------------------------------------
// Commercial Commission Rule — REST Response Mapper
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { CommercialCommissionRuleAggregate } from '../../../domain/aggregates/commercial-commission-rule.aggregate';

import type { CommercialCommissionRuleEntity } from '../../../domain/entities/commercial-commission-rule.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

/**
 * HTTP representation of a Commercial Commission Rule aggregate.
 *
 * Domain value objects are converted to transport primitives at the
 * presentation boundary.
 *
 * The response represents the commercial policy configuration together with
 * its lifecycle, effective period, version, and audit information.
 */
export interface CommercialCommissionRuleResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  publicId: string;

  // ===========================================================================
  // Commission Definition
  // ===========================================================================

  type: string;

  percentage: string;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  status: string;

  // ===========================================================================
  // Effective Period
  // ===========================================================================

  effectiveFrom: Date;

  effectiveTo: Date | undefined;

  // ===========================================================================
  // Version
  // ===========================================================================

  version: number;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps Commercial Commission Rule domain objects into HTTP response
 * objects.
 *
 * Commercial Commission Rule is an independent aggregate consisting of its
 * CommercialCommissionRuleEntity root.
 */
export class CommercialCommissionRuleResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a fully rehydrated Commercial Commission Rule aggregate.
   */
  public static toResponse(
    aggregate: CommercialCommissionRuleAggregate,
  ): CommercialCommissionRuleResponse {
    return this.fromEntity(aggregate.commissionRule);
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps a Commercial Commission Rule root entity.
   *
   * Value objects are intentionally converted to their primitive transport
   * representations here rather than exposing domain objects through the
   * presentation layer.
   */
  public static fromEntity(
    rule: CommercialCommissionRuleEntity,
  ): CommercialCommissionRuleResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: rule.publicId.value,

      // -----------------------------------------------------------------------
      // Commission Definition
      // -----------------------------------------------------------------------

      type: rule.type.value,

      percentage: rule.percentage.value.toString(),

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: rule.status.value,

      // -----------------------------------------------------------------------
      // Effective Period
      // -----------------------------------------------------------------------

      effectiveFrom: rule.effectiveFrom.value,

      effectiveTo: rule.effectiveTo?.value,

      // -----------------------------------------------------------------------
      // Version
      // -----------------------------------------------------------------------

      version: rule.version.value,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: rule.createdAt,

      updatedAt: rule.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps a collection of Commercial Commission Rule aggregates.
   */
  public static fromAggregates(
    aggregates: readonly CommercialCommissionRuleAggregate[],
  ): CommercialCommissionRuleResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps a collection of Commercial Commission Rule root entities.
   */
  public static fromEntities(
    rules: readonly CommercialCommissionRuleEntity[],
  ): CommercialCommissionRuleResponse[] {
    return rules.map((rule) => this.fromEntity(rule));
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CommercialCommissionRuleResponseMapper;
