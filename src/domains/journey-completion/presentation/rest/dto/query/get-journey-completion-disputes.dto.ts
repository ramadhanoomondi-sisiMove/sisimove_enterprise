// -----------------------------------------------------------------------------
// Journey Completion — Get Disputes Query DTO
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
// Domain Values
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_DISPUTE_STATUSES } from '../../../../domain/value-objects/journey-completion-dispute-status.vo';

import { JOURNEY_COMPLETION_DISPUTE_REASONS } from '../../../../domain/value-objects/journey-completion-dispute-reason.vo';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving disputes belonging to a Journey Completion.
 *
 * The Journey Completion public ID is supplied through the route parameter.
 * Optional filters remain transport-level strings.
 *
 * Domain value objects are created by the application query handler.
 */
export class GetJourneyCompletionDisputesQueryDto {
  // ===========================================================================
  // Raised By
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Optional public identifier of the member who raised the dispute.',
    example: 'MEM_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  raisedByPublicId?: string;

  // ===========================================================================
  // Dispute Status
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Optional dispute lifecycle status used to filter the results.',
    enum: JOURNEY_COMPLETION_DISPUTE_STATUSES,
    example: 'UNDER_REVIEW',
  })
  @IsOptional()
  @IsString()
  @IsIn(JOURNEY_COMPLETION_DISPUTE_STATUSES)
  status?: string;

  // ===========================================================================
  // Dispute Reason
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Optional structured reason used to filter the dispute results.',
    enum: JOURNEY_COMPLETION_DISPUTE_REASONS,
    example: 'JOURNEY_NOT_COMPLETED',
  })
  @IsOptional()
  @IsString()
  @IsIn(JOURNEY_COMPLETION_DISPUTE_REASONS)
  reason?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionDisputesQueryDto;
