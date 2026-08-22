// -----------------------------------------------------------------------------
// Commercial Earning Commission — Get By Provider Query Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving Commercial Earning Commissions associated
 * with a specific Provider.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * The Provider public identifier is converted into the corresponding
 * CommercialEarningCommissionProviderPublicId value object at the
 * presentation/application boundary.
 *
 * The DTO does not expose or accept:
 *
 * - commission public ID;
 * - Journey reference;
 * - Settlement reference;
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
export class GetCommercialEarningCommissionsByProviderQueryDto {
  // ===========================================================================
  // Provider
  // ===========================================================================

  /**
   * Public identity of the Provider whose Commercial Earning Commissions are
   * being retrieved.
   */
  @IsString()
  @IsNotEmpty()
  public readonly providerPublicId!: string;
}

export default GetCommercialEarningCommissionsByProviderQueryDto;
