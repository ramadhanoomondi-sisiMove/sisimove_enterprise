// src/domains/journey-demand/presentation/rest/dto/queries/get-my-journey-demands-query.dto.ts

// -----------------------------------------------------------------------------
// Get My Journey Demands — Query DTO
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

export class GetMyJourneyDemandsQueryDto {
  // ===========================================================================
  // Requester Identity
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the requester whose Journey Demands are being retrieved.',
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

export default GetMyJourneyDemandsQueryDto;
