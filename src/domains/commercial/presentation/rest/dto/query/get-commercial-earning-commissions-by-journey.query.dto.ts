// -----------------------------------------------------------------------------
// Commercial Earning Commission — Get By Journey Query Request DTO
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
 * with a specific Journey.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * The Journey public identifier is converted into the corresponding
 * CommercialEarningCommissionJourneyPublicId value object at the
 * presentation/application boundary.
 *
 * The DTO does not expose or accept:
 *
 * - commission public ID;
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
export class GetCommercialEarningCommissionsByJourneyQueryDto {
  // ===========================================================================
  // Journey
  // ===========================================================================

  /**
   * Public identity of the Journey whose Commercial Earning Commissions are
   * being retrieved.
   */
  @IsString()
  @IsNotEmpty()
  public readonly journeyPublicId!: string;
}

export default GetCommercialEarningCommissionsByJourneyQueryDto;
