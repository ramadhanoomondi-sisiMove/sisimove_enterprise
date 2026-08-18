// -----------------------------------------------------------------------------
// Journey Booking — Find By Journey Query DTO
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
 * Query DTO for finding Journey Bookings associated with a Journey.
 *
 * This DTO represents the REST presentation boundary only.
 *
 * The primitive Journey public identifier is converted into the
 * JourneyPublicId domain value object before the application query
 * is created.
 */
export class FindJourneyBookingsByJourneyQueryDto {
  // ===========================================================================
  // Journey Public ID
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
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FindJourneyBookingsByJourneyQueryDto;
