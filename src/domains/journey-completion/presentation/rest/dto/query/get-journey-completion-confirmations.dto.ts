// -----------------------------------------------------------------------------
// Journey Completion — Get Confirmations Query DTO
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

import { JOURNEY_COMPLETION_CONFIRMATION_ROLES } from '../../../../domain/value-objects/journey-completion-confirmation-role.vo';

import { JOURNEY_COMPLETION_CONFIRMATION_STATUSES } from '../../../../domain/value-objects/journey-completion-confirmation-status.vo';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving Journey Completion confirmations.
 *
 * The Journey Completion public identifier is supplied through the route
 * parameter and is therefore not part of this query DTO.
 *
 * Optional filters remain transport-level primitives. Domain value objects
 * are constructed by the application query handler.
 */
export class GetJourneyCompletionConfirmationsQueryDto {
  // ===========================================================================
  // Member
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Optional public identifier of a member whose confirmation should be returned.',
    example: 'MEM_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  memberPublicId?: string;

  // ===========================================================================
  // Booking
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Optional public identifier of a Journey Booking associated with a confirmation.',
    example: 'JBK_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  bookingPublicId?: string;

  // ===========================================================================
  // Role
  // ===========================================================================

  @ApiPropertyOptional({
    description: 'Optional confirmation role used to filter confirmations.',
    enum: JOURNEY_COMPLETION_CONFIRMATION_ROLES,
    example: 'PASSENGER',
  })
  @IsOptional()
  @IsString()
  @IsIn(JOURNEY_COMPLETION_CONFIRMATION_ROLES)
  role?: string;

  // ===========================================================================
  // Status
  // ===========================================================================

  @ApiPropertyOptional({
    description: 'Optional confirmation status used to filter confirmations.',
    enum: JOURNEY_COMPLETION_CONFIRMATION_STATUSES,
    example: 'CONFIRMED',
  })
  @IsOptional()
  @IsString()
  @IsIn(JOURNEY_COMPLETION_CONFIRMATION_STATUSES)
  status?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionConfirmationsQueryDto;
