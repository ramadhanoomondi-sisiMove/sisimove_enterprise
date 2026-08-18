// -----------------------------------------------------------------------------
// Journey Booking — Authorize Payment Request DTO
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
 * Request payload for authorizing payment for a Journey Booking.
 *
 * This DTO represents the REST boundary only.
 *
 * Primitive request values are converted into domain value objects by the
 * presentation/application mapping layer before the
 * AuthorizeJourneyBookingPaymentCommand is created.
 */
export class AuthorizeJourneyBookingPaymentDto {
  // ===========================================================================
  // Journey Booking
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Booking whose payment should be authorized.',
    example: 'JBK-01J8XYZ123',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyBookingPublicId!: string;

  // ===========================================================================
  // Financial Transaction
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Financial transaction associated with the payment authorization.',
    example: 'TXN-01J8XYZ789',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  transactionPublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  @ApiProperty({
    description:
      'Identifier used to correlate this request with the originating payment workflow or distributed trace.',
    example: 'corr-01J8XYZABC',
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
      'Identifier of the command or event that caused this payment authorization request, when applicable.',
    example: 'cmd-01J8XYZDEF',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  causationId?: string;

  // ===========================================================================
  // Authorization Time
  // ===========================================================================

  @ApiPropertyOptional({
    description:
      'Explicit payment authorization timestamp. When omitted, the aggregate uses the current time.',
    example: '2026-08-18T17:00:00.000Z',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  authorizedAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AuthorizeJourneyBookingPaymentDto;
