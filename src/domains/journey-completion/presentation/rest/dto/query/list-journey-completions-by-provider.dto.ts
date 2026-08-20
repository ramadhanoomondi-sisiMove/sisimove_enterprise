// -----------------------------------------------------------------------------
// Journey Completion — List By Provider Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving Journey Completions belonging to a provider.
//
// An optional lifecycle status filter may further constrain the result set.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_STATUSES } from '../../../../domain/value-objects/journey-completion-status.vo';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class ListJourneyCompletionsByProviderQueryDto {
  // ===========================================================================
  // Provider Public ID
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the provider whose Journey Completions are requested.',
    example: 'IDN_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  providerPublicId!: string;

  // ===========================================================================
  // Lifecycle Status
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Optional lifecycle status used to filter the provider Journey Completions.',
    enum: JOURNEY_COMPLETION_STATUSES,
    example: 'CONFIRMED',
  })
  @IsOptional()
  @IsString()
  @IsIn(JOURNEY_COMPLETION_STATUSES)
  status?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneyCompletionsByProviderQueryDto;
