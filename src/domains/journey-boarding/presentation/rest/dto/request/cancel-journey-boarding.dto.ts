// -----------------------------------------------------------------------------
// Journey Boarding — Cancel Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for cancelling a Journey Boarding.
 *
 * This DTO contains transport primitives only.
 *
 * The presentation/application mapping layer converts:
 *
 * - journeyBoardingPublicId → JourneyBoardingPublicId
 * - actorPublicId           → JourneyBoardingMemberPublicId
 * - cancelledAt             → Date
 *
 * before constructing CancelJourneyBoardingCommand.
 */
export class CancelJourneyBoardingDto {
  // ===========================================================================
  // Journey Boarding
  // ===========================================================================

  /**
   * Public identifier of the Journey Boarding aggregate being cancelled.
   */
  @ApiProperty({
    description:
      'Public identifier of the Journey Boarding aggregate being cancelled.',
    example: 'JBD-01J8XYZ123',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyBoardingPublicId!: string;

  // ===========================================================================
  // Actor
  // ===========================================================================

  /**
   * Optional public identifier of the member performing the cancellation.
   *
   * The identifier is recorded as the actor on the resulting domain event.
   */
  @ApiPropertyOptional({
    description:
      'Optional public identifier of the member performing the cancellation.',
    example: 'MBR-01J8XYZ456',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  actorPublicId?: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier used for distributed tracing and workflow tracking.
   */
  @ApiProperty({
    description:
      'Identifier used to correlate this request with the originating workflow or distributed trace.',
    example: 'corr-01J8XYZ789',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command or event that caused this request.
   */
  @ApiPropertyOptional({
    description:
      'Identifier of the command or event that caused this request, when applicable.',
    example: 'cmd-01J8XYZABC',
    minLength: 1,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  causationId?: string;

  // ===========================================================================
  // Cancellation Timestamp
  // ===========================================================================

  /**
   * Optional timestamp at which the Journey Boarding was cancelled.
   *
   * When omitted, the domain uses the current time.
   */
  @ApiPropertyOptional({
    description:
      'Optional ISO-8601 timestamp representing when the Journey Boarding was cancelled.',
    example: '2026-08-19T10:50:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  cancelledAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CancelJourneyBoardingDto;
