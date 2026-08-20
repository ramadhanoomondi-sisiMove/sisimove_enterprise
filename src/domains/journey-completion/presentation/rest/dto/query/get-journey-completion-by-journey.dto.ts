// -----------------------------------------------------------------------------
// Journey Completion — Get By Journey Query DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving the Journey Completion associated with
 * a specific Journey.
 *
 * The Journey public identifier remains a transport primitive. The
 * application query handler is responsible for converting it into the
 * JourneyCompletionJourneyPublicId value object.
 */
export class GetJourneyCompletionByJourneyQueryDto {
  // ===========================================================================
  // Journey Public ID
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey whose Journey Completion is requested.',
    example: 'JNY_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  journeyPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionByJourneyQueryDto;
