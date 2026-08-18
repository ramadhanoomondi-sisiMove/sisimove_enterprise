// -----------------------------------------------------------------------------
// Journey Booking — Find Journey Bookings By Status Query DTO
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
 * Query parameters for retrieving Journey Bookings by lifecycle status.
 *
 * This DTO represents the REST transport boundary only.
 *
 * The primitive status value must be converted into JourneyBookingStatus
 * before constructing FindJourneyBookingsByStatusQuery.
 */
export class FindJourneyBookingsByStatusQueryDto {
  // ===========================================================================
  // Status
  // ===========================================================================

  @ApiProperty({
    description: 'Journey Booking lifecycle status used to filter the results.',
    example: 'CONFIRMED',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  status!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FindJourneyBookingsByStatusQueryDto;
