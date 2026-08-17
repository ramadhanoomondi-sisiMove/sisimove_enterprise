// src/domains/journey-demand/presentation/rest/dtos/cancel-journey-demand.dto.ts

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

export class CancelJourneyDemandDto {
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
      'Identifier of the command or event that caused this cancellation, when applicable.',
    example: 'cmd-01J8XYZ456',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  causationId?: string;

  // ===========================================================================
  // Cancellation Reason
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Optional reason explaining why the Journey Demand was cancelled.',
    example: 'Passenger no longer requires transport.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  reason?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CancelJourneyDemandDto;
