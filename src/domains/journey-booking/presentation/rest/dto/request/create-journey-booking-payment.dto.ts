// src/domains/journey-booking/presentation/http/dto/request/create-journey-booking-payment.dto.ts

// -----------------------------------------------------------------------------
// Journey Booking — Create Payment Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Domain Value Object Constants
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_PAYMENT_STATUSES } from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for creating a Journey Booking Payment.
 *
 * This DTO belongs exclusively to the presentation layer and therefore
 * contains transport primitives rather than domain value objects.
 *
 * The presentation/application mapping layer is responsible for converting:
 *
 * - status              → JourneyBookingPaymentStatus
 * - amount              → JourneyBookingPaymentAmount
 * - currency            → JourneyBookingCurrency
 * - transactionPublicId → JourneyBookingTransactionPublicId
 *
 * The transaction reference is optional because a newly created payment
 * may initially be in a pending state.
 */
export class CreateJourneyBookingPaymentDto {
  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Initial payment status.
   *
   * A newly created payment will normally use PENDING.
   *
   * The value is validated against the domain-supported payment statuses
   * before being converted to JourneyBookingPaymentStatus.
   */
  @ApiProperty({
    description: 'Initial status of the Journey Booking payment.',
    example: 'PENDING',
    enum: JOURNEY_BOOKING_PAYMENT_STATUSES,
    default: 'PENDING',
  })
  @IsString()
  @IsIn(JOURNEY_BOOKING_PAYMENT_STATUSES)
  status!: string;

  // ===========================================================================
  // Amount
  // ===========================================================================

  /**
   * Payment amount.
   *
   * The application layer converts this transport value into
   * JourneyBookingPaymentAmount.
   */
  @ApiProperty({
    description: 'Amount associated with the Journey Booking payment.',
    example: 3000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  amount!: number;

  // ===========================================================================
  // Currency
  // ===========================================================================

  /**
   * Currency used for the payment.
   */
  @ApiProperty({
    description: 'ISO currency code used for the payment.',
    example: 'KES',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  currency!: string;

  // ===========================================================================
  // Transaction
  // ===========================================================================

  /**
   * Optional external transaction reference.
   *
   * This may be omitted while the payment remains pending.
   */
  @ApiPropertyOptional({
    description: 'Optional transaction reference associated with the payment.',
    example: 'TXN-01J8XYZ123',
    minLength: 1,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  transactionPublicId?: string;

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

export default CreateJourneyBookingPaymentDto;
