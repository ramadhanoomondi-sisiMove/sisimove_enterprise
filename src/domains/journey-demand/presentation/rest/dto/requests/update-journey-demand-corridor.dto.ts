// src/domains/journey-demand/presentation/rest/dto/requests/update-journey-demand-corridor.dto.ts

// -----------------------------------------------------------------------------
// Update Journey Demand Corridor — Request DTO
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

export class UpdateJourneyDemandCorridorDto {
  // ===========================================================================
  // Origin
  // ===========================================================================

  @ApiProperty({
    description: 'New origin name for the Journey Demand corridor.',
    example: 'Nairobi',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  origin!: string;

  // ===========================================================================
  // Destination
  // ===========================================================================

  @ApiProperty({
    description: 'New destination name for the Journey Demand corridor.',
    example: 'Mombasa',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  destination!: string;

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
      'Identifier of the command or event that caused this corridor update, when applicable.',
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

export default UpdateJourneyDemandCorridorDto;
