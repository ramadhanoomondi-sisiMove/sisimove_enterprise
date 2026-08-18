// -----------------------------------------------------------------------------
// Journey Booking — Find Journey Bookings By Journey And Passenger Query DTO
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
 * Query parameters for retrieving Journey Bookings belonging to a specific
 * passenger for a specific Journey.
 *
 * This DTO represents the REST transport boundary only.
 *
 * The primitive public identifiers must be converted into their corresponding
 * domain value objects before constructing
 * FindJourneyBookingsByJourneyAndPassengerQuery.
 */
export class FindJourneyBookingsByJourneyAndPassengerQueryDto {
  // ===========================================================================
  // Journey
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey whose bookings should be retrieved.',
    example: 'JNY-01J8XYZ123',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyPublicId!: string;

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

export default FindJourneyBookingsByJourneyAndPassengerQueryDto;
