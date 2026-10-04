// src/domains/journey-demand/presentation/rest/dto/requests/update-journey-demand-corridor.dto.ts

// -----------------------------------------------------------------------------
// Update Journey Demand Corridor — Request DTO
// -----------------------------------------------------------------------------
//
// Purpose
// -------
// Updates the origin and destination of a Journey Demand corridor.
//
// A corridor location consists of:
// - a human-readable location name;
// - latitude;
// - longitude.
//
// Coordinates may arrive from the frontend as either JSON numbers or numeric
// strings. The DTO normalizes them to numbers before validation.
//
// This keeps the HTTP boundary tolerant of normal browser/form serialization
// while ensuring the application command receives actual numbers.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Transformation
// -----------------------------------------------------------------------------

import { Type } from 'class-transformer';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandCorridorDto {
  // ===========================================================================
  // Origin
  // ===========================================================================

  @ApiProperty({
    description: 'New origin name for the Journey Demand corridor.',
    example: 'Nairobi CBD',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  origin!: string;

  // ===========================================================================
  // Origin Latitude
  // ===========================================================================
  //
  // Valid latitude range:
  //
  //   -90 <= latitude <= 90
  //
  // @Type(() => Number) converts numeric strings received from the client into
  // actual JavaScript numbers before validation.
  // ===========================================================================

  @ApiProperty({
    description: 'Latitude of the selected Journey Demand corridor origin.',
    example: -1.286389,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  originLatitude!: number;

  // ===========================================================================
  // Origin Longitude
  // ===========================================================================
  //
  // Valid longitude range:
  //
  //   -180 <= longitude <= 180
  // ===========================================================================

  @ApiProperty({
    description: 'Longitude of the selected Journey Demand corridor origin.',
    example: 36.817223,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  originLongitude!: number;

  // ===========================================================================
  // Destination
  // ===========================================================================

  @ApiProperty({
    description: 'New destination name for the Journey Demand corridor.',
    example: 'Mombasa CBD',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  destination!: string;

  // ===========================================================================
  // Destination Latitude
  // ===========================================================================

  @ApiProperty({
    description:
      'Latitude of the selected Journey Demand corridor destination.',
    example: -4.043477,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  destinationLatitude!: number;

  // ===========================================================================
  // Destination Longitude
  // ===========================================================================

  @ApiProperty({
    description:
      'Longitude of the selected Journey Demand corridor destination.',
    example: 39.668206,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  destinationLongitude!: number;

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
