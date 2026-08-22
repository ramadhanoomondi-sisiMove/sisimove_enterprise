// -----------------------------------------------------------------------------
// Commercial Earning Commission — Get Query Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving a Commercial Earning Commission by its public
 * identifier.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * The public identifier is converted into the corresponding
 * CommercialEarningCommissionPublicId value object at the
 * presentation/application boundary.
 *
 * The DTO does not expose or accept:
 *
 * - Journey reference;
 * - Settlement reference;
 * - Provider reference;
 * - Commercial Commission Rule reference;
 * - commission percentage;
 * - base amount;
 * - commission amount;
 * - net amount;
 * - currency;
 * - lifecycle status.
 *
 * Those values are owned by the Commercial Earning Commission domain.
 */
export class GetCommercialEarningCommissionQueryDto {
  // ===========================================================================
  // Commercial Earning Commission
  // ===========================================================================

  /**
   * Public identity of the Commercial Earning Commission to retrieve.
   */
  @IsString()
  @IsNotEmpty()
  public readonly publicId!: string;
}

export default GetCommercialEarningCommissionQueryDto;
