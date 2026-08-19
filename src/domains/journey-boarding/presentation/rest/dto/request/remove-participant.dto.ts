// -----------------------------------------------------------------------------
// Journey Boarding — Remove Participant Request DTO
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
 * REST request DTO for removing a Journey Boarding participant.
 *
 * This DTO contains transport primitives only.
 *
 * The presentation/application mapping layer is responsible for converting:
 *
 * - journeyBoardingPublicId → JourneyBoardingPublicId
 * - participantPublicId    → JourneyBoardingParticipantPublicId
 * - actorPublicId          → JourneyBoardingMemberPublicId
 * - removedAt              → Date
 *
 * before constructing RemoveParticipantCommand.
 */
export class RemoveParticipantDto {
  // ===========================================================================
  // Journey Boarding
  // ===========================================================================

  /**
   * Public identifier of the Journey Boarding aggregate.
   */
  @ApiProperty({
    description:
      'Public identifier of the Journey Boarding from which the participant will be removed.',
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
   * Public identifier of the participant being removed.
   */
  @ApiProperty({
    description:
      'Public identifier of the Journey Boarding participant being removed.',
    example: 'JBP-01J8XYZ456',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  participantPublicId!: string;

  // ===========================================================================
  // Actor
  // ===========================================================================

  /**
   * Optional public identifier of the member performing the removal.
   *
   * This is recorded on the resulting domain event as the actor.
   */
  @ApiPropertyOptional({
    description:
      'Optional public identifier of the member performing the participant removal.',
    example: 'MBR-01J8XYZ789',
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
    example: 'corr-01J8XYZABC',
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
    example: 'cmd-01J8XYZDEF',
    minLength: 1,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  causationId?: string;

  // ===========================================================================
  // Removal Timestamp
  // ===========================================================================

  /**
   * Optional timestamp at which the participant was removed.
   *
   * When omitted, the aggregate uses the current time.
   */
  @ApiPropertyOptional({
    description:
      'Optional ISO-8601 timestamp representing when the participant was removed.',
    example: '2026-08-19T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  removedAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RemoveParticipantDto;
