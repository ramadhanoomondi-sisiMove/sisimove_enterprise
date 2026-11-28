// -----------------------------------------------------------------------------
// Admin Booking Commission — Mapper
// -----------------------------------------------------------------------------

import type { AdminBookingCommissionModel } from '../models';

// -----------------------------------------------------------------------------
// Response Type
// -----------------------------------------------------------------------------

/**
 * Booking commission response received from the API.
 *
 * Dates may arrive as serialized strings or Date instances.
 * Optional lifecycle dates are normalized by the mapper.
 */
type AdminBookingCommissionResponse = Omit<
  AdminBookingCommissionModel,
  'assessedAt' | 'cancelledAt' | 'createdAt' | 'updatedAt'
> & {
  readonly assessedAt?: string | Date | null;
  readonly cancelledAt?: string | Date | null;
  readonly createdAt: string | Date;
  readonly updatedAt: string | Date;
};

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps booking commission API responses into frontend models.
 */
export class AdminBookingCommissionMapper {
  // ===========================================================================
  // Single Record
  // ===========================================================================

  /**
   * Maps one booking commission response.
   */
  public static toModel(
    response: AdminBookingCommissionResponse,
  ): AdminBookingCommissionModel {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: response.publicId,

      // -----------------------------------------------------------------------
      // Commission Rule
      // -----------------------------------------------------------------------

      commissionRulePublicId: response.commissionRulePublicId,

      // -----------------------------------------------------------------------
      // Booking References
      // -----------------------------------------------------------------------

      bookingPublicId: response.bookingPublicId,

      journeyPublicId: response.journeyPublicId,

      // -----------------------------------------------------------------------
      // Financial Assessment Snapshot
      // -----------------------------------------------------------------------

      percentage: response.percentage,

      baseAmount: response.baseAmount,

      commissionAmount: response.commissionAmount,

      currency: response.currency,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: response.status,

      assessedAt: this.toNullableIsoString(response.assessedAt),

      cancelledAt: this.toNullableIsoString(response.cancelledAt),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: this.toIsoString(response.createdAt),

      updatedAt: this.toIsoString(response.updatedAt),
    };
  }

  // ===========================================================================
  // Collection
  // ===========================================================================

  /**
   * Maps a collection of booking commission responses.
   */
  public static toModels(
    responses: readonly AdminBookingCommissionResponse[],
  ): AdminBookingCommissionModel[] {
    return responses.map((response) => this.toModel(response));
  }

  // ===========================================================================
  // Date Normalization
  // ===========================================================================

  private static toIsoString(value: string | Date): string {
    return value instanceof Date ? value.toISOString() : value;
  }

  private static toNullableIsoString(
    value?: string | Date | null,
  ): string | null {
    if (value == null) {
      return null;
    }

    return this.toIsoString(value);
  }
}