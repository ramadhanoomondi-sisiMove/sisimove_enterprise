// src/domains/journey-demand/presentation/rest/dto/requests/update-journey-demand.dto.ts

// -----------------------------------------------------------------------------
// Update Journey Demand — Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandDto {
  // ===========================================================================
  // Correlation
  // ===========================================================================

  @ApiProperty({
    example: 'corr-01J8XYZ123',
    description: 'Correlation identifier used for distributed tracing.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'cmd-01J8XYZ456',
    description: 'Optional causation identifier used for distributed tracing.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default UpdateJourneyDemandDto;
