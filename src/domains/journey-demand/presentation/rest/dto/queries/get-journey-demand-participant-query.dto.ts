// src/domains/journey-demand/presentation/rest/dto/queries/get-journey-demand-participant-query.dto.ts

// -----------------------------------------------------------------------------
// Get Journey Demand Participant — Query DTO
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

export class GetJourneyDemandParticipantQueryDto {
  // ===========================================================================
  // Journey Demand Identity
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Demand containing the participant.',
    example: 'JDM-01J8XYZ123',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  journeyDemandPublicId!: string;

  // ===========================================================================
  // Participant Identity
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Demand participant to retrieve.',
    example: 'JDP-01J8XYZ456',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  participantPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyDemandParticipantQueryDto;
