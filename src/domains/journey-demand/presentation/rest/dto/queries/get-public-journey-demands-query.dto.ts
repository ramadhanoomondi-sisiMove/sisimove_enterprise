// src/domains/journey-demand/presentation/rest/dto/queries/get-public-journey-demands-query.dto.ts

// -----------------------------------------------------------------------------
// Get Public Journey Demands — Query DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for public Journey Demand marketplace discovery.
//
// Supported filters:
//
//   from
//   to
//   date
//   minPrice
//   maxPrice
//
// Price filtering applies to the requester's maximum acceptable per-seat price
// (`maximumPricePerSeat`) and is inclusive:
//
//   minPrice <= maximumPricePerSeat <= maxPrice
//
// Either price boundary may be supplied independently.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class GetPublicJourneyDemandsQueryDto {
  // ===========================================================================
  // Origin
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Origin location or corridor reference used to filter public Journey Demands.',
    example: 'Nairobi',
  })
  @IsOptional()
  @IsString()
  from?: string;

  // ===========================================================================
  // Destination
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Destination location or corridor reference used to filter public Journey Demands.',
    example: 'Mombasa',
  })
  @IsOptional()
  @IsString()
  to?: string;

  // ===========================================================================
  // Journey Date
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Journey date used to filter public Journey Demands. Must be an ISO 8601 date or date-time string.',
    example: '2026-10-15',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  // ===========================================================================
  // Minimum Price
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Minimum acceptable per-seat price in KES. Inclusive. Filters against maximumPricePerSeat.',
    example: 500,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minPrice?: number;

  // ===========================================================================
  // Maximum Price
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Maximum acceptable per-seat price in KES. Inclusive. Filters against maximumPricePerSeat.',
    example: 1500,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxPrice?: number;

  // ===========================================================================
  // Pagination
  // ===========================================================================

  @ApiPropertyOptional({
    description: 'Maximum number of public Journey Demands to return.',
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
    description:
      'Number of public Journey Demands to skip before returning results.',
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

export default GetPublicJourneyDemandsQueryDto;
