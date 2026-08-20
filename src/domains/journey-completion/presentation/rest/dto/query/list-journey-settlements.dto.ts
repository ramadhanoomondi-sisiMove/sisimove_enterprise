// -----------------------------------------------------------------------------
// Journey Settlement — List Query DTO
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
 * REST query DTO for listing Journey Settlements.
 *
 * All filters are optional.
 *
 * Domain value objects are intentionally not used in the DTO. The application
 * query handler is responsible for converting transport primitives into
 * validated domain value objects.
 */
export class ListJourneySettlementsQueryDto {
  // ===========================================================================
  // Journey Public ID
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Optional public identifier of the Journey whose settlements are requested.',
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
  // Provider Public ID
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Optional public identifier of the provider whose settlements are requested.',
    example: 'MEM_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  providerPublicId?: string;

  // ===========================================================================
  // Settlement Status
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Optional Journey Settlement lifecycle status used to filter results.',
    example: 'PROCESSING',
    minLength: 1,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  status?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneySettlementsQueryDto;
