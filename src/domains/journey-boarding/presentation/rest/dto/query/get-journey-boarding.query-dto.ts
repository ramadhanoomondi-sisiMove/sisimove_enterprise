// -----------------------------------------------------------------------------
// Journey Boarding — Get Query DTO
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
 * REST query DTO for retrieving a Journey Boarding by public identifier.
 *
 * The primitive identifier is mapped to JourneyBoardingPublicId before
 * constructing GetJourneyBoardingQuery.
 */
export class GetJourneyBoardingQueryDto {
  // ===========================================================================
  // Journey Boarding Public ID
  // ===========================================================================

  @ApiProperty({
    description: 'Public identifier of the Journey Boarding to retrieve.',
    example: 'JBR-01J8XYZ789',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyBoardingPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyBoardingQueryDto;
