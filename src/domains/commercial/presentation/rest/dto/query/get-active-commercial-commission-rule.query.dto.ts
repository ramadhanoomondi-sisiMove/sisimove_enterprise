// -----------------------------------------------------------------------------
// Commercial Commission Rule — Get Active Query Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving the active Commercial Commission Rule for a
 * specific commission type.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * The commission type is converted into the corresponding
 * CommercialCommissionType value object at the presentation/application
 * boundary.
 *
 * The DTO does not expose or accept:
 *
 * - commission rule public ID;
 * - commission percentage;
 * - effective period;
 * - version;
 * - lifecycle status.
 *
 * Those values are owned by the Commercial Commission Rule domain.
 */
export class GetActiveCommercialCommissionRuleQueryDto {
  // ===========================================================================
  // Commission Type
  // ===========================================================================

  /**
   * Commission type for which the active Commercial Commission Rule is
   * requested.
   */
  @IsString()
  @IsNotEmpty()
  public readonly type!: string;
}

export default GetActiveCommercialCommissionRuleQueryDto;
