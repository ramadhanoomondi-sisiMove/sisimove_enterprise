// src/domains/journey-demand/presentation/rest/dto/requests/update-journey-demand-capacity.dto.ts

// -----------------------------------------------------------------------------
// Update Journey Demand Capacity — Request DTO
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
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandCapacityDto {
  // ===========================================================================
  // Capacity
  // ===========================================================================

  @ApiProperty({
    description: 'Number of seats required by the Journey Demand.',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  seatsRequired!: number;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  @ApiProperty({
    description:
      'Identifier used to correlate this command with the originating request or workflow.',
    example: 'corr-01J8XYZ123',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Identifier of the command or event that caused this capacity update, when applicable.',
    example: 'cmd-01J8XYZ456',
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

export default UpdateJourneyDemandCapacityDto;
