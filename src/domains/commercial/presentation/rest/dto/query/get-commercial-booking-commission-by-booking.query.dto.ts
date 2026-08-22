// -----------------------------------------------------------------------------
// Commercial Booking Commission — Get By Booking Query Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving the Commercial Booking Commission associated
 * with a specific Booking.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * The Booking public identifier is converted into the corresponding
 * CommercialBookingCommissionBookingPublicId value object at the
 * presentation/application boundary.
 *
 * The DTO does not expose or accept:
 *
 * - commission public ID;
 * - Journey reference;
 * - Commercial Commission Rule reference;
 * - commission percentage;
 * - base amount;
 * - commission amount;
 * - currency;
 * - lifecycle status.
 *
 * Those values are owned by the Commercial Booking Commission domain.
 */
export class GetCommercialBookingCommissionByBookingQueryDto {
  // ===========================================================================
  // Booking
  // ===========================================================================

  /**
   * Public identity of the Booking whose Commercial Booking Commission is
   * being retrieved.
   */
  @IsString()
  @IsNotEmpty()
  public readonly bookingPublicId!: string;
}

export default GetCommercialBookingCommissionByBookingQueryDto;
