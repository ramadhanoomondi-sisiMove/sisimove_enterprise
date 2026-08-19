// -----------------------------------------------------------------------------
// Journey Boarding — Get Participants Query DTO
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
 * REST query DTO for retrieving participants belonging to a Journey Boarding.
 */
export class GetJourneyBoardingParticipantsQueryDto {
  // ===========================================================================
  // Journey Boarding ID
  // ===========================================================================

  @ApiProperty({
    description:
      'Internal identifier of the Journey Boarding whose participants are requested.',
    example: '01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyBoardingId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyBoardingParticipantsQueryDto;
