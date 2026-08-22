// -----------------------------------------------------------------------------
// Commercial Booking Commission — REST Response Mapper
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionAggregate } from '../../../domain/aggregates/commercial-booking-commission.aggregate';

import type { CommercialBookingCommissionEntity } from '../../../domain/entities/commercial-booking-commission.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

/**
 * HTTP representation of a Commercial Booking Commission aggregate.
 *
 * Domain value objects are converted to transport primitives at the
 * presentation boundary.
 *
 * The commission percentage and monetary values represent the historical
 * commercial assessment snapshot captured when the commission was created.
 */
export interface CommercialBookingCommissionResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  publicId: string;

  // ===========================================================================
  // Commercial References
  // ===========================================================================

  commissionRulePublicId: string;

  bookingPublicId: string;

  journeyPublicId: string;

  // ===========================================================================
  // Financial Assessment
  // ===========================================================================

  percentage: string;

  baseAmount: number;

  commissionAmount: number;

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
 * Maps Commercial Booking Commission domain objects into HTTP response
 * objects.
 *
 * Commercial Booking Commission is a separate aggregate consisting only of
 * its CommercialBookingCommissionEntity root.
 */
export class CommercialBookingCommissionResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a fully rehydrated Commercial Booking Commission aggregate.
   */
  public static toResponse(
    aggregate: CommercialBookingCommissionAggregate,
  ): CommercialBookingCommissionResponse {
    return this.fromEntity(aggregate.bookingCommission);
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps a Commercial Booking Commission root entity.
   *
   * Value objects are intentionally converted to primitive transport
   * representations at the presentation boundary.
   */
  public static fromEntity(
    commission: CommercialBookingCommissionEntity,
  ): CommercialBookingCommissionResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: commission.publicId.value,

      // -----------------------------------------------------------------------
      // Commercial References
      // -----------------------------------------------------------------------

      commissionRulePublicId: commission.commissionRulePublicId.value,

      bookingPublicId: commission.bookingPublicId.value,

      journeyPublicId: commission.journeyPublicId.value,

      // -----------------------------------------------------------------------
      // Financial Assessment
      // -----------------------------------------------------------------------

      percentage: commission.percentage.value.toString(),

      baseAmount: commission.baseAmount.value,

      commissionAmount: commission.commissionAmount.value,

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
   * Maps a collection of Commercial Booking Commission aggregates.
   */
  public static fromAggregates(
    aggregates: readonly CommercialBookingCommissionAggregate[],
  ): CommercialBookingCommissionResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps a collection of Commercial Booking Commission root entities.
   */
  public static fromEntities(
    commissions: readonly CommercialBookingCommissionEntity[],
  ): CommercialBookingCommissionResponse[] {
    return commissions.map((commission) => this.fromEntity(commission));
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CommercialBookingCommissionResponseMapper;
