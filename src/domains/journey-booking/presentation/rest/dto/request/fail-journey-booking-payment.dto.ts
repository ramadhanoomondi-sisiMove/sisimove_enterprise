// -----------------------------------------------------------------------------
// Journey Booking — Fail Payment Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Request payload for recording a failed Journey Booking payment.
 *
 * This DTO represents the REST boundary only.
 *
 * Primitive request values must be converted into domain value objects by the
 * presentation/application mapping layer before the command is created.
 */
export class FailJourneyBookingPaymentDto {
  // ===========================================================================
  // Journey Booking
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Booking whose payment failed.',
    example: 'JBY-01J8XYZ789',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyBookingPublicId!: string;

  // ===========================================================================
  // Failure Reason
  // ===========================================================================

  @ApiProperty({
    description: 'Reason explaining why the Journey Booking payment failed.',
    example: 'PAYMENT_DECLINED',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  failureReason!: string;

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
      'Identifier of the command or event that caused this request, when applicable.',
    example: 'cmd-01J8XYZABC',
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

export default FailJourneyBookingPaymentDto;
