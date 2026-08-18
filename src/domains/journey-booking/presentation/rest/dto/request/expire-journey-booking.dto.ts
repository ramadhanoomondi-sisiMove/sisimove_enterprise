// -----------------------------------------------------------------------------
// Journey Booking — Expire Request DTO
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
 * Request payload for expiring a Journey Booking.
 *
 * This DTO represents the REST boundary only.
 *
 * Primitive request values are converted into domain value objects by the
 * presentation/application mapping layer before the
 * ExpireJourneyBookingCommand is created.
 */
export class ExpireJourneyBookingDto {
  // ===========================================================================
  // Journey Booking
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Booking that should be expired.',
    example: 'JBK-01J8XYZ123',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyBookingPublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  @ApiProperty({
    description:
      'Identifier used to correlate this request with the originating workflow or distributed trace.',
    example: 'corr-01J8XYZ789',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Identifier of the command or event that caused this expiration request, when applicable.',
    example: 'cmd-01J8XYZABC',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  causationId?: string;

  // ===========================================================================
  // Expiration Time
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Explicit expiration timestamp. When omitted, the aggregate uses the current time.',
    example: '2026-08-18T17:00:00.000Z',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiredAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ExpireJourneyBookingDto;
