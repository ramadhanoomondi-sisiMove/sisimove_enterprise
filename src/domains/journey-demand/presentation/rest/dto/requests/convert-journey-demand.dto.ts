// src/domains/journey-demand/presentation/rest/dtos/convert-journey-demand.dto.ts

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class ConvertJourneyDemandDto {
  // ===========================================================================
  // Journey
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey created from the Journey Demand.',
    example: 'JNY-01J8XYZ123',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  journeyPublicId!: string;

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
      'Identifier of the command or event that caused this conversion, when applicable.',
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

export default ConvertJourneyDemandDto;
