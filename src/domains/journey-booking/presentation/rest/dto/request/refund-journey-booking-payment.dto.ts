// -----------------------------------------------------------------------------
// Journey Booking — Refund Payment Request DTO
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
 * Request payload for fully refunding a captured Journey Booking payment.
 *
 * This DTO represents the REST boundary only.
 *
 * The primitive Journey Booking public identifier is converted into its
 * domain value object before the application command is created.
 */
export class RefundJourneyBookingPaymentDto {
  // ===========================================================================
  // Journey Booking
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Booking whose captured payment should be fully refunded.',
    example: 'JBY-01J8XYZ789',
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

export default RefundJourneyBookingPaymentDto;
