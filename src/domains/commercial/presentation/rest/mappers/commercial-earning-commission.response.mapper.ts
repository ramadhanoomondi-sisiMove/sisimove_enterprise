// -----------------------------------------------------------------------------
// Commercial Earning Commission — REST Response Mapper
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { CommercialEarningCommissionAggregate } from '../../../domain/aggregates/commercial-earning-commission.aggregate';

import type { CommercialEarningCommissionEntity } from '../../../domain/entities/commercial-earning-commission.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

/**
 * HTTP representation of a Commercial Earning Commission aggregate.
 *
 * Domain value objects and internal identifiers are converted to transport
 * primitives at the presentation boundary.
 *
 * The commission percentage and monetary values represent the historical
 * commercial assessment snapshot captured when the commission was created.
 */
export interface CommercialEarningCommissionResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  publicId: string;

  // ===========================================================================
  // Commercial References
  // ===========================================================================

  commissionRulePublicId: string;

  journeyPublicId: string;

  settlementPublicId: string;

  providerPublicId: string;

  // ===========================================================================
  // Financial Assessment
  // ===========================================================================

  percentage: string;

  baseAmount: number;

  commissionAmount: number;

  netAmount: number;

  currency: string;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  status: string;

  assessedAt: Date | undefined;

  cancelledAt: Date | undefined;

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
 * Maps Commercial Earning Commission domain objects into HTTP response
 * objects.
 *
 * Commercial Earning Commission is a separate aggregate consisting only of
 * its root CommercialEarningCommissionEntity.
 */
export class CommercialEarningCommissionResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a fully rehydrated Commercial Earning Commission aggregate.
   */
  public static toResponse(
    aggregate: CommercialEarningCommissionAggregate,
  ): CommercialEarningCommissionResponse {
    return this.fromEntity(aggregate.earningCommission);
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps a Commercial Earning Commission root entity.
   */
  public static fromEntity(
    commission: CommercialEarningCommissionEntity,
  ): CommercialEarningCommissionResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: commission.publicId.value,

      // -----------------------------------------------------------------------
      // Commercial References
      // -----------------------------------------------------------------------

      commissionRulePublicId: commission.commissionRulePublicId.value,

      journeyPublicId: commission.journeyPublicId.value,

      settlementPublicId: commission.settlementPublicId.value,

      providerPublicId: commission.providerPublicId.value,

      // -----------------------------------------------------------------------
      // Financial Assessment
      // -----------------------------------------------------------------------

      percentage: commission.percentage.value.toString(),

      baseAmount: commission.baseAmount.value,

      commissionAmount: commission.commissionAmount.value,

      netAmount: commission.netAmount.value,

      currency: commission.currency.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: commission.status.value,

      assessedAt: commission.assessedAt,

      cancelledAt: commission.cancelledAt,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: commission.createdAt,

      updatedAt: commission.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps a collection of Commercial Earning Commission aggregates.
   */
  public static fromAggregates(
    aggregates: readonly CommercialEarningCommissionAggregate[],
  ): CommercialEarningCommissionResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps a collection of Commercial Earning Commission root entities.
   */
  public static fromEntities(
    commissions: readonly CommercialEarningCommissionEntity[],
  ): CommercialEarningCommissionResponse[] {
    return commissions.map((commission) => this.fromEntity(commission));
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CommercialEarningCommissionResponseMapper;
