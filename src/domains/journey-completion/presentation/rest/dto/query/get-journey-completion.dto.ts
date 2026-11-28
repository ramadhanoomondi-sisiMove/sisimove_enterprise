// -----------------------------------------------------------------------------
// Journey Completion — Get Journey Completion Query DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving a single Journey Completion.
 *
 * The Journey Completion public identifier is supplied through the route
 * parameter and is therefore not part of this query DTO.
 *
 * Optional journey and provider identifiers allow callers to constrain
 * the lookup without exposing persistence concerns to the presentation layer.
 */
export class GetJourneyCompletionQueryDto {
  // ===========================================================================
  // Optional Journey Filter
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Optional public identifier of the Journey used to constrain the lookup.',
    example: 'JNY_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyPublicId?: string;

  // ===========================================================================
  // Optional Provider Filter
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Optional public identifier of the provider used to constrain the lookup.',
    example: 'MEM_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  providerPublicId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionQueryDto;
