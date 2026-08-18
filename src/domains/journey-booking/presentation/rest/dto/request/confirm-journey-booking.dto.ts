// -----------------------------------------------------------------------------
// Journey Booking — Confirm Request DTO
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
 * Request payload for confirming a Journey Booking.
 *
 * This DTO represents the REST boundary. Primitive request values are mapped
 * into domain value objects and application-command arguments by the
 * presentation/application mapping layer.
 */
export class ConfirmJourneyBookingDto {
  // ===========================================================================
  // Journey Booking
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Booking that should be confirmed.',
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
      'Identifier of the command or event that caused this confirmation request, when applicable.',
    example: 'cmd-01J8XYZABC',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  causationId?: string;

  // ===========================================================================
  // Confirmation Time
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Explicit confirmation timestamp. When omitted, the aggregate uses the current time.',
    example: '2026-08-18T13:45:00.000Z',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  confirmedAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ConfirmJourneyBookingDto;
