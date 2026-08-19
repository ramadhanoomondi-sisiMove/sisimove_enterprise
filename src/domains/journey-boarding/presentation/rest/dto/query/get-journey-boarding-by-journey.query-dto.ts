// -----------------------------------------------------------------------------
// Journey Boarding — Get By Journey Query DTO
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
 * REST query DTO for retrieving the Journey Boarding associated with
 * a Journey.
 */
export class GetJourneyBoardingByJourneyQueryDto {
  // ===========================================================================
  // Journey ID
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey whose boarding process is requested.',
    example: 'JNY-01J8XYZ123',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyBoardingByJourneyQueryDto;
