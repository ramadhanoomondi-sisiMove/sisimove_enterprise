// -----------------------------------------------------------------------------
// Journey Completion — List By Status Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving Journey Completions by lifecycle status.
//
// Provider and Journey filters are optional.
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

export class ListJourneyCompletionsByStatusQueryDto {
  // ===========================================================================
  // Lifecycle Status
  // ===========================================================================

  @ApiProperty({
    description: 'Lifecycle status used to filter Journey Completions.',
    enum: JOURNEY_COMPLETION_STATUSES,
    example: 'CONFIRMATION_REQUIRED',
  })
  @IsString()
  @IsIn(JOURNEY_COMPLETION_STATUSES)
  status!: string;

  // ===========================================================================
  // Provider Public ID
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Optional public identifier of the provider whose Journey Completions are requested.',
    example: 'IDN_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  providerPublicId?: string;

  // ===========================================================================
  // Journey Public ID
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Optional public identifier of the Journey whose Completion is requested.',
    example: 'JNY_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyPublicId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneyCompletionsByStatusQueryDto;
