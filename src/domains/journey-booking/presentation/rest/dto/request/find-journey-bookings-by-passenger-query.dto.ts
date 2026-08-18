// -----------------------------------------------------------------------------
// Journey Booking — Find Journey Bookings By Passenger Query DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Query parameters for retrieving Journey Bookings belonging to a
 * specified passenger.
 *
 * The passenger public identifier is explicitly supplied for this query.
 *
 * This DTO represents the REST transport boundary only. The primitive
 * passenger public identifier must be converted into
 * JourneyBookingPassengerPublicId before constructing the application query.
 */
export class FindJourneyBookingsByPassengerQueryDto {
  // ===========================================================================
  // Passenger
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the passenger whose Journey Bookings should be retrieved.',
    example: 'IDN-01J8XYZ456',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  passengerPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FindJourneyBookingsByPassengerQueryDto;
