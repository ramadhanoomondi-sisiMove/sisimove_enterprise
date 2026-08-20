// -----------------------------------------------------------------------------
// Journey Completion — List Query DTO
// -----------------------------------------------------------------------------
//
// REST query parameters for retrieving Journey Completions.
//
// All filters are optional.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiPropertyOptional } from '@nestjs/swagger';

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

export class ListJourneyCompletionsQueryDto {
  // ===========================================================================
  // Journey Public ID
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Public identifier of the Journey whose completion should be retrieved.',
    example: 'JNY_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyPublicId?: string;

  // ===========================================================================
  // Provider Public ID
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Public identifier of the provider whose Journey Completions should be retrieved.',
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
  // Lifecycle Status
  // ===========================================================================

  @ApiPropertyOptional({
    description: 'Lifecycle status of the Journey Completion.',
    enum: JOURNEY_COMPLETION_STATUSES,
    example: 'CONFIRMATION_REQUIRED',
  })
  @IsOptional()
  @IsString()
  @IsIn(JOURNEY_COMPLETION_STATUSES)
  status?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneyCompletionsQueryDto;
