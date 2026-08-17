// src/domains/journey-demand/presentation/rest/dto/queries/get-journey-demand-waypoints-query.dto.ts

// -----------------------------------------------------------------------------
// Get Journey Demand Waypoints — Query DTO
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

export class GetJourneyDemandWaypointsQueryDto {
  // ===========================================================================
  // Journey Demand Identity
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Demand whose waypoints are being retrieved.',
    example: 'JDM-01J8XYZ123',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  journeyDemandPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyDemandWaypointsQueryDto;
