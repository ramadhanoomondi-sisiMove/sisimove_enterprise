// src/domains/journey-boarding/presentation/rest/dto/request/open-journey-boarding.dto.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Open Request DTO
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
 * REST request DTO for opening a Journey Boarding process.
 *
 * This DTO belongs exclusively to the presentation layer and therefore
 * contains transport primitives rather than domain value objects.
 *
 * The presentation/application mapping layer is responsible for converting
 * the Journey Boarding public identifier into the corresponding domain
 * value object before constructing OpenJourneyBoardingCommand.
 *
 * Opening boarding performs the lifecycle transition:
 *
 * NOT_STARTED → BOARDING
 */
export class OpenJourneyBoardingDto {
  // ===========================================================================
  // Journey Boarding
  // ===========================================================================

  /**
   * Public identifier of the Journey Boarding aggregate to open.
   *
   * This value is converted to JourneyBoardingPublicId before entering the
   * application layer.
   */
  @ApiProperty({
    description:
      'Public identifier of the Journey Boarding aggregate whose boarding process should be opened.',
    example: 'JBD-01J8XYZ123',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyBoardingPublicId!: string;

  // ===========================================================================
  // Boarding Start Time
  // ===========================================================================

  /**
   * Optional timestamp at which boarding officially starts.
   *
   * When omitted, the application/domain workflow uses the current time.
   */
  @ApiPropertyOptional({
    description:
      'Optional ISO-8601 timestamp at which the boarding process officially starts. Defaults to the current time when omitted.',
    example: '2026-08-19T09:30:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  boardingStartedAt?: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier used to trace the command and resulting domain
   * event through the application workflow.
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
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default OpenJourneyBoardingDto;
