// src/domains/journey-demand/presentation/rest/dto/queries/find-journey-demands-by-requester-query.dto.ts

// -----------------------------------------------------------------------------
// Find Journey Demands By Requester — Query DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class FindJourneyDemandsByRequesterQueryDto {
  // ===========================================================================
  // Requester
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Identity that requested the Journey Demand.',
    example: 'IDN-ABC12345',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  requesterPublicId!: string;

  // ===========================================================================
  // Pagination
  // ===========================================================================

  @ApiPropertyOptional({
    description: 'Maximum number of Journey Demands to return.',
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
    description: 'Number of Journey Demands to skip before returning results.',
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

export default FindJourneyDemandsByRequesterQueryDto;
