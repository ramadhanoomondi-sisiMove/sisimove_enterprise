// -----------------------------------------------------------------------------
// Journey Booking — Get By Public ID Query DTO
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
 * Query DTO for retrieving a Journey Booking by its public identifier.
 *
 * This DTO belongs strictly to the REST presentation boundary.
 *
 * The primitive public identifier is mapped to JourneyBookingPublicId before
 * the GetJourneyBookingByPublicIdQuery is created.
 */
export class GetJourneyBookingByPublicIdQueryDto {
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

export default GetJourneyBookingByPublicIdQueryDto;
