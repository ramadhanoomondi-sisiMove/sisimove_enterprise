// src/domains/journey-demand/presentation/rest/dto/requests/update-journey-demand-pricing.dto.ts

// -----------------------------------------------------------------------------
// Update Journey Demand Pricing — Request DTO
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

export class UpdateJourneyDemandPricingDto {
  // ===========================================================================
  // Pricing
  // ===========================================================================

  @ApiProperty({
    description: 'Maximum fare per seat accepted for the Journey Demand.',
    example: 1500,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  maxFare!: number;

  // ===========================================================================
  // Currency
  // ===========================================================================

  @ApiProperty({
    description: 'ISO currency code used for the Journey Demand pricing.',
    example: 'KES',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  currency!: string;

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
      'Identifier of the command or event that caused this pricing update, when applicable.',
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

export default UpdateJourneyDemandPricingDto;
