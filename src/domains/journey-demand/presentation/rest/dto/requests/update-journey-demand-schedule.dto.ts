// src/domains/journey-demand/presentation/rest/dto/requests/update-journey-demand-schedule.dto.ts

// -----------------------------------------------------------------------------
// Update Journey Demand Schedule — Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandScheduleDto {
  // ===========================================================================
  // Departure Window
  // ===========================================================================

  @ApiProperty({
    description: 'Earliest permitted departure time for the Journey Demand.',
    example: '2026-09-01T06:00:00.000Z',
  })
  @IsDateString()
  earliestDeparture!: string;

  @ApiProperty({
    description: 'Latest permitted departure time for the Journey Demand.',
    example: '2026-09-01T09:00:00.000Z',
  })
  @IsDateString()
  latestDeparture!: string;

  // ===========================================================================
  // Arrival Constraints
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Target arrival time for the Journey Demand, when a target arrival is specified.',
    example: '2026-09-01T15:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  targetArrival?: string;

  @ApiPropertyOptional({
    description:
      'Latest acceptable arrival time for the Journey Demand, when a maximum arrival is specified.',
    example: '2026-09-01T18:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  maximumArrival?: string;

  // ===========================================================================
  // Timezone
  // ===========================================================================

  @ApiPropertyOptional({
    description: 'IANA timezone used to interpret the Journey Demand schedule.',
    example: 'Africa/Nairobi',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  timezone?: string;

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
      'Identifier of the command or event that caused this schedule update, when applicable.',
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

export default UpdateJourneyDemandScheduleDto;
