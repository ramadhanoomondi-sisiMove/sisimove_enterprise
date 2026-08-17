// src/domains/journey-demand/presentation/rest/dto/queries/find-matchable-journey-demands-query.dto.ts

// -----------------------------------------------------------------------------
// Find Matchable Journey Demands — Query DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsInt, IsOptional, Max, Min } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class FindMatchableJourneyDemandsQueryDto {
  // ===========================================================================
  // Pagination
  // ===========================================================================

  @ApiPropertyOptional({
    description: 'Maximum number of matchable Journey Demands to return.',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description:
      'Number of matchable Journey Demands to skip before returning results.',
    example: 0,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FindMatchableJourneyDemandsQueryDto;
