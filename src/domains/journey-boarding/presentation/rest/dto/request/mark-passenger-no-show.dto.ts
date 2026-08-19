// src/domains/journey-boarding/presentation/rest/dto/request/mark-passenger-no-show.dto.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Mark Passenger No-Show Request DTO
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
 * REST request DTO for marking a passenger as a no-show.
 *
 * This DTO belongs exclusively to the presentation layer and therefore
 * contains transport primitives rather than domain value objects.
 *
 * The presentation/application mapping layer converts:
 *
 * - journeyBoardingPublicId → JourneyBoardingPublicId
 * - participantPublicId    → JourneyBoardingParticipantPublicId
 * - noShowAt               → Date
 */
export class MarkPassengerNoShowDto {
  // ===========================================================================
  // Journey Boarding
  // ===========================================================================

  /**
   * Public identifier of the Journey Boarding aggregate.
   */
  @ApiProperty({
    description:
      'Public identifier of the Journey Boarding aggregate containing the passenger participant.',
    example: 'JBR-01J8XYZ123',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyBoardingPublicId!: string;

  // ===========================================================================
  // Participant
  // ===========================================================================

  /**
   * Public identifier of the passenger participant being marked as a
   * no-show.
   */
  @ApiProperty({
    description:
      'Public identifier of the passenger participant being marked as a no-show.',
    example: 'JBP-01J8XYZ456',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  participantPublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier used to trace the no-show workflow.
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
  // No-Show Time
  // ===========================================================================

  /**
   * Optional timestamp representing when the passenger was determined to
   * be a no-show.
   *
   * When omitted, the aggregate uses the current time.
   */
  @ApiPropertyOptional({
    description:
      'ISO-8601 timestamp representing when the passenger was determined to be a no-show. Defaults to the current time when omitted.',
    example: '2026-08-19T07:00:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  noShowAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default MarkPassengerNoShowDto;
