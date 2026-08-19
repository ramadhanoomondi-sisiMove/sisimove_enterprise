// src/domains/journey-boarding/presentation/rest/dto/request/board-provider.dto.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Board Provider Request DTO
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
 * REST request DTO for boarding the provider of a Journey Boarding process.
 *
 * This DTO belongs exclusively to the presentation layer and therefore
 * contains transport primitives rather than domain value objects.
 *
 * The presentation/application mapping layer is responsible for converting
 * the Journey Boarding public identifier into JourneyBoardingPublicId before
 * constructing BoardProviderCommand.
 *
 * The domain aggregate is responsible for validating the provider participant
 * and performing the participant lifecycle transition:
 *
 * EXPECTED → BOARDED
 */
export class BoardProviderDto {
  // ===========================================================================
  // Journey Boarding
  // ===========================================================================

  /**
   * Public identifier of the Journey Boarding aggregate.
   *
   * This value is converted to JourneyBoardingPublicId before entering the
   * application layer.
   */
  @ApiProperty({
    description:
      'Public identifier of the Journey Boarding aggregate in which the provider is boarding.',
    example: 'JBD-01J8XYZ123',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyBoardingPublicId!: string;

  // ===========================================================================
  // Boarding Time
  // ===========================================================================

  /**
   * Optional timestamp at which the provider physically boarded.
   *
   * When omitted, the domain operation uses the current time.
   */
  @ApiPropertyOptional({
    description:
      'Optional ISO-8601 timestamp at which the provider physically boarded. Defaults to the current time when omitted.',
    example: '2026-08-19T09:35:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  boardedAt?: string;

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

export default BoardProviderDto;
