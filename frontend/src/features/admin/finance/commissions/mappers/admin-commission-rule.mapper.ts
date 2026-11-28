// -----------------------------------------------------------------------------
// Admin Commission Rule — Mapper
// -----------------------------------------------------------------------------

import type { AdminCommissionRuleModel } from '../models';

// -----------------------------------------------------------------------------
// Response Type
// -----------------------------------------------------------------------------

/**
 * Commission rule response received from the API.
 *
 * Dates may arrive as serialized strings or Date instances.
 * Optional effective dates are normalized by the mapper.
 */
type AdminCommissionRuleResponse = Omit<
  AdminCommissionRuleModel,
  'effectiveFrom' | 'effectiveTo' | 'createdAt' | 'updatedAt'
> & {
  readonly effectiveFrom: string | Date;
  readonly effectiveTo?: string | Date | null;
  readonly createdAt: string | Date;
  readonly updatedAt: string | Date;
};

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps commission rule API responses into frontend models.
 */
export class AdminCommissionRuleMapper {
  // ===========================================================================
  // Single Record
  // ===========================================================================

  /**
   * Maps one commission rule response.
   */
  public static toModel(
    response: AdminCommissionRuleResponse,
  ): AdminCommissionRuleModel {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: response.publicId,

      // -----------------------------------------------------------------------
      // Commission Configuration
      // -----------------------------------------------------------------------

      type: response.type,

      percentage: response.percentage,

      status: response.status,

      // -----------------------------------------------------------------------
      // Effective Period
      // -----------------------------------------------------------------------

      effectiveFrom: this.toIsoString(response.effectiveFrom),

      effectiveTo: this.toNullableIsoString(response.effectiveTo),

      // -----------------------------------------------------------------------
      // Version
      // -----------------------------------------------------------------------

      version: response.version,

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
   * Maps a collection of commission rule responses.
   */
  public static toModels(
    responses: readonly AdminCommissionRuleResponse[],
  ): AdminCommissionRuleModel[] {
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