// src/domains/journey-demand/presentation/rest/dto/queries/get-journey-demand-query.dto.ts

// -----------------------------------------------------------------------------
// Get Journey Demand — Query DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class GetJourneyDemandQueryDto {
  // ===========================================================================
  // Journey Demand Identity
  // ===========================================================================

  @ApiProperty({
    description: 'Internal domain identifier of the Journey Demand.',
    example: '01J8XYZ123ABC456DEF789GHIJ',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyDemandId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyDemandQueryDto;
