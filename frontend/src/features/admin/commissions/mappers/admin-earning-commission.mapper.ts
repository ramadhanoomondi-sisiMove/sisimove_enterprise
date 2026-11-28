// -----------------------------------------------------------------------------
// Admin Earning Commission — Mapper
// -----------------------------------------------------------------------------

import type { AdminEarningCommissionModel } from '../models';

// -----------------------------------------------------------------------------
// Response Type
// -----------------------------------------------------------------------------

/**
 * Earning commission response received from the API.
 *
 * Dates may arrive as serialized strings or Date instances.
 * Optional lifecycle dates are normalized by the mapper.
 */
type AdminEarningCommissionResponse = Omit<
  AdminEarningCommissionModel,
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
 * Maps earning commission API responses into frontend models.
 */
export class AdminEarningCommissionMapper {
  // ===========================================================================
  // Single Record
  // ===========================================================================

  /**
   * Maps one earning commission response.
   */
  public static toModel(
    response: AdminEarningCommissionResponse,
  ): AdminEarningCommissionModel {
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
      // Earning References
      // -----------------------------------------------------------------------

      journeyPublicId: response.journeyPublicId,

      settlementPublicId: response.settlementPublicId,

      providerPublicId: response.providerPublicId,

      // -----------------------------------------------------------------------
      // Financial Assessment Snapshot
      // -----------------------------------------------------------------------

      percentage: response.percentage,

      baseAmount: response.baseAmount,

      commissionAmount: response.commissionAmount,

      netAmount: response.netAmount,

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
   * Maps a collection of earning commission responses.
   */
  public static toModels(
    responses: readonly AdminEarningCommissionResponse[],
  ): AdminEarningCommissionModel[] {
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