// -----------------------------------------------------------------------------
// Journey Booking — Get Query DTO
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
 * Query DTO for retrieving a single Journey Booking.
 *
 * This DTO represents the REST presentation boundary only.
 *
 * The primitive public identifier is converted into the
 * JourneyBookingPublicId domain value object before the
 * GetJourneyBookingQuery is created.
 */
export class GetJourneyBookingQueryDto {
  // ===========================================================================
  // Journey Booking Public ID
  // ===========================================================================

  @ApiProperty({
    description: 'Public identifier of the Journey Booking to retrieve.',
    example: 'JRB-01J8XYZ789',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyBookingPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyBookingQueryDto;
