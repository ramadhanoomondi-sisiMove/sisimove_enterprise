// src/domains/journey-demand/presentation/rest/dtos/add-journey-demand-participant.dto.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class AddJourneyDemandParticipantDto {
  // ===========================================================================
  // Participant Identity
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Demand Participant being added.',
    example: 'JDP-01J8XYZ123',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  participantPublicId!: string;

  // ===========================================================================
  // Member
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the member who will participate in the Journey Demand.',
    example: 'IDN-ABC12345',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  memberPublicId!: string;

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
      'Identifier of the command or event that caused this command, when applicable.',
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

export default AddJourneyDemandParticipantDto;
