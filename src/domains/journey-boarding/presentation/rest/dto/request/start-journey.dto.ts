// -----------------------------------------------------------------------------
// Journey Boarding — Start Journey Request DTO
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
 * REST request DTO for starting a Journey.
 *
 * This DTO contains transport primitives only.
 *
 * The presentation/application mapping layer converts:
 *
 * - journeyBoardingPublicId → JourneyBoardingPublicId
 * - journeyStartedAt        → Date
 *
 * before constructing StartJourneyCommand.
 */
export class StartJourneyDto {
  // ===========================================================================
  // Journey Boarding
  // ===========================================================================

  /**
   * Public identifier of the Journey Boarding aggregate.
   */
  @ApiProperty({
    description:
      'Public identifier of the Journey Boarding whose Journey is being started.',
    example: 'JBD-01J8XYZ123',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyBoardingPublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier used for distributed tracing and workflow tracking.
   */
  @ApiProperty({
    description:
      'Identifier used to correlate this request with the originating workflow or distributed trace.',
    example: 'corr-01J8XYZ456',
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
    example: 'cmd-01J8XYZ789',
    minLength: 1,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  causationId?: string;

  // ===========================================================================
  // Journey Start Timestamp
  // ===========================================================================

  /**
   * Optional timestamp at which the Journey started.
   *
   * When omitted, the domain uses the current time.
   */
  @ApiPropertyOptional({
    description:
      'Optional ISO-8601 timestamp representing when the Journey started.',
    example: '2026-08-19T10:45:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  journeyStartedAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default StartJourneyDto;
