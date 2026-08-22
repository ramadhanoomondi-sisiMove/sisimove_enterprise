// -----------------------------------------------------------------------------
// Commercial Booking Commission — Get By Journey Query Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving Commercial Booking Commissions associated
 * with a specific Journey.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * The Journey public identifier is converted into the corresponding
 * CommercialBookingCommissionJourneyPublicId value object at the
 * presentation/application boundary.
 *
 * The DTO does not expose or accept:
 *
 * - commission public ID;
 * - Booking reference;
 * - Commercial Commission Rule reference;
 * - commission percentage;
 * - base amount;
 * - commission amount;
 * - currency;
 * - lifecycle status.
 *
 * Those values are owned by the Commercial Booking Commission domain.
 */
export class GetCommercialBookingCommissionsByJourneyQueryDto {
  // ===========================================================================
  // Journey
  // ===========================================================================

  /**
   * Public identity of the Journey whose Commercial Booking Commissions are
   * being retrieved.
   */
  @IsString()
  @IsNotEmpty()
  public readonly journeyPublicId!: string;
}

export default GetCommercialBookingCommissionsByJourneyQueryDto;
