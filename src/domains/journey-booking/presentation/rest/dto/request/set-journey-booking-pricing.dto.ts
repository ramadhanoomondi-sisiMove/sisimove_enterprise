// src/domains/journey-booking/presentation/http/dto/request/set-journey-booking-pricing.dto.ts

// -----------------------------------------------------------------------------
// Journey Booking — Set Pricing Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for setting Journey Booking pricing.
 *
 * This DTO belongs exclusively to the presentation layer and therefore
 * contains transport primitives rather than domain value objects.
 *
 * The presentation/application mapping layer is responsible for converting
 * these values into the corresponding Journey Booking pricing value objects.
 *
 * Pricing contains the historical commercial terms associated with the
 * booking at the time the price is established.
 */
export class SetJourneyBookingPricingDto {
  // ===========================================================================
  // Price Per Seat
  // ===========================================================================

  /**
   * Price charged for each booked seat.
   *
   * The value is transported as a numeric amount and converted to
   * JourneyBookingPricePerSeat by the application mapping layer.
   */
  @ApiProperty({
    description: 'Price charged for each booked seat.',
    example: 1500,
    minimum: 0,
  })
  @Min(0)
  pricePerSeat!: number;

  // ===========================================================================
  // Seats
  // ===========================================================================

  /**
   * Number of seats included in this pricing record.
   */
  @ApiProperty({
    description: 'Number of seats included in the booking price.',
    example: 2,
    minimum: 1,
    maximum: 20,
  })
  @IsInt()
  @Min(1)
  @Max(20)
  seats!: number;

  // ===========================================================================
  // Subtotal
  // ===========================================================================

  /**
   * Price before discounts and adjustments.
   */
  @ApiProperty({
    description: 'Subtotal before discounts and adjustments.',
    example: 3000,
    minimum: 0,
  })
  @Min(0)
  subtotal!: number;

  // ===========================================================================
  // Discount
  // ===========================================================================

  /**
   * Optional discount applied to the booking.
   *
   * Defaults to zero in the domain pricing entity when omitted.
   */
  @ApiPropertyOptional({
    description: 'Optional discount amount applied to the booking.',
    example: 200,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @Min(0)
  discountAmount?: number;

  // ===========================================================================
  // Adjustment
  // ===========================================================================

  /**
   * Optional pricing adjustment.
   *
   * This value may represent an additional commercial adjustment associated
   * with the booking.
   */
  @ApiPropertyOptional({
    description: 'Optional pricing adjustment amount.',
    example: 100,
  })
  @IsOptional()
  adjustmentAmount?: number;

  // ===========================================================================
  // Total
  // ===========================================================================

  /**
   * Final amount payable after discounts and adjustments.
   */
  @ApiProperty({
    description: 'Final total amount payable for the booking.',
    example: 2900,
    minimum: 0,
  })
  @Min(0)
  totalAmount!: number;

  // ===========================================================================
  // Currency
  // ===========================================================================

  /**
   * Currency used for all monetary amounts in this pricing record.
   */
  @ApiProperty({
    description: 'ISO currency code used for the booking price.',
    example: 'KES',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  currency!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Optional correlation identifier used to trace this request through
   * the application workflow.
   */
  @ApiPropertyOptional({
    description:
      'Optional identifier used to correlate this request with an originating workflow or distributed trace.',
    example: 'corr-01J8XYZ789',
    minLength: 1,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  correlationId?: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command or event that caused this request.
   */
  @ApiPropertyOptional({
    description:
      'Optional identifier of the command or event that caused this request, when applicable.',
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

export default SetJourneyBookingPricingDto;
