// -----------------------------------------------------------------------------
// Commercial Earning Commission — Get By Settlement Query Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving the Commercial Earning Commission associated
 * with a specific Settlement.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * The Settlement public identifier is converted into the corresponding
 * CommercialEarningCommissionSettlementPublicId value object at the
 * presentation/application boundary.
 *
 * The DTO does not expose or accept:
 *
 * - commission public ID;
 * - Journey reference;
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
export class GetCommercialEarningCommissionBySettlementQueryDto {
  // ===========================================================================
  // Settlement
  // ===========================================================================

  /**
   * Public identity of the Settlement whose Commercial Earning Commission is
   * being retrieved.
   */
  @IsString()
  @IsNotEmpty()
  public readonly settlementPublicId!: string;
}

export default GetCommercialEarningCommissionBySettlementQueryDto;
