// -----------------------------------------------------------------------------
// Commercial Commission Rule — Get By Type Query Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving Commercial Commission Rules by commission
 * type.
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
export class GetCommercialCommissionRuleByTypeQueryDto {
  // ===========================================================================
  // Commission Type
  // ===========================================================================

  /**
   * Commission type used to identify the applicable Commercial Commission
   * Rules.
   */
  @IsString()
  @IsNotEmpty()
  public readonly type!: string;
}

export default GetCommercialCommissionRuleByTypeQueryDto;
