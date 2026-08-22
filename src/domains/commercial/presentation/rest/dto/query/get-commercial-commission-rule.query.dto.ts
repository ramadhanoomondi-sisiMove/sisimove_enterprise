// -----------------------------------------------------------------------------
// Commercial Commission Rule — Get Query Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving a Commercial Commission Rule by its public
 * identifier.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * The public identifier is converted into the corresponding
 * CommercialCommissionRulePublicId value object at the
 * presentation/application boundary.
 *
 * The DTO does not expose or accept:
 *
 * - commission type;
 * - commission percentage;
 * - effective period;
 * - version;
 * - lifecycle status.
 *
 * Those values are owned by the Commercial Commission Rule domain.
 */
export class GetCommercialCommissionRuleQueryDto {
  // ===========================================================================
  // Commercial Commission Rule
  // ===========================================================================

  /**
   * Public identity of the Commercial Commission Rule to retrieve.
   */
  @IsString()
  @IsNotEmpty()
  public readonly publicId!: string;
}

export default GetCommercialCommissionRuleQueryDto;
