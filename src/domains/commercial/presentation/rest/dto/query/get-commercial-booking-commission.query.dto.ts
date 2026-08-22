// -----------------------------------------------------------------------------
// Commercial Booking Commission — Get Query Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving a Commercial Booking Commission by its public
 * identifier.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * The public identifier is converted into the corresponding
 * CommercialBookingCommissionPublicId value object at the
 * presentation/application boundary.
 *
 * The DTO does not expose or accept:
 *
 * - Booking reference;
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
export class GetCommercialBookingCommissionQueryDto {
  // ===========================================================================
  // Commercial Booking Commission
  // ===========================================================================

  /**
   * Public identity of the Commercial Booking Commission to retrieve.
   */
  @IsString()
  @IsNotEmpty()
  public readonly publicId!: string;
}

export default GetCommercialBookingCommissionQueryDto;
