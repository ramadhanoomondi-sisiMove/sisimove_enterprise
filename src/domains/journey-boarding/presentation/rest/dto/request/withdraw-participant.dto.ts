// -----------------------------------------------------------------------------
// Journey Boarding — Withdraw Participant Request DTO
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
 * REST request DTO for withdrawing a Journey Boarding participant.
 *
 * This DTO contains transport primitives only.
 *
 * The presentation/application mapping layer is responsible for converting:
 *
 * - journeyBoardingPublicId → JourneyBoardingPublicId
 * - participantPublicId    → JourneyBoardingParticipantPublicId
 * - withdrawnAt            → Date
 *
 * before constructing WithdrawParticipantCommand.
 */
export class WithdrawParticipantDto {
  // ===========================================================================
  // Journey Boarding
  // ===========================================================================

  /**
   * Public identifier of the Journey Boarding aggregate.
   */
  @ApiProperty({
    description:
      'Public identifier of the Journey Boarding from which the participant will withdraw.',
    example: 'JBD-01J8XYZ123',
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
   * Public identifier of the participant being withdrawn.
   */
  @ApiProperty({
    description:
      'Public identifier of the Journey Boarding participant being withdrawn.',
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
  // Withdrawal Timestamp
  // ===========================================================================

  /**
   * Optional timestamp at which the participant withdrew.
   *
   * When omitted, the aggregate uses the current time.
   */
  @ApiPropertyOptional({
    description:
      'Optional ISO-8601 timestamp representing when the participant withdrew.',
    example: '2026-08-19T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  withdrawnAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default WithdrawParticipantDto;
