// -----------------------------------------------------------------------------
// Journey Booking — Partially Refund Payment Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Request payload for partially refunding a captured Journey Booking payment.
 *
 * This DTO represents the REST boundary only.
 *
 * Primitive request values are mapped into the application command by the
 * presentation/application mapping layer.
 */
export class PartiallyRefundJourneyBookingPaymentDto {
  // ===========================================================================
  // Journey Booking
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identifier of the Journey Booking whose captured payment should be partially refunded.',
    example: 'JBY-01J8XYZ789',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyBookingPublicId!: string;

  // ===========================================================================
  // Refunded Amount
  // ===========================================================================

  @ApiProperty({
    description:
      'Amount to refund from the captured payment. Must be greater than zero.',
    example: 25.5,
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  refundedAmount!: number;

  // ===========================================================================
  // Remaining Amount
  // ===========================================================================

  @ApiProperty({
    description:
      'Remaining captured amount after applying the partial refund. Must not be negative.',
    example: 74.5,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  remainingAmount!: number;

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

export default PartiallyRefundJourneyBookingPaymentDto;
