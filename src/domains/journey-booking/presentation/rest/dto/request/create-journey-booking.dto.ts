// -----------------------------------------------------------------------------
// Journey Booking — Create Request DTO
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
 * REST request DTO for creating a Journey Booking.
 *
 * This DTO belongs exclusively to the presentation layer and therefore
 * contains transport primitives rather than domain value objects.
 *
 * The presentation/application mapping layer is responsible for converting:
 *
 * - journeyPublicId → JourneyBookingJourneyPublicId
 * - seats           → JourneyBookingSeats
 *
 * The passenger identity is intentionally NOT accepted from the request
 * body.
 *
 * The authenticated passenger is derived from the JWT:
 *
 *     request.user.publicId
 *
 * This prevents a client from creating a booking on behalf of another
 * passenger by submitting an arbitrary passengerPublicId.
 *
 * Correlation and causation identifiers are optional transport metadata.
 * They are not required to create a booking.
 */
export class CreateJourneyBookingDto {
  // ===========================================================================
  // Journey
  // ===========================================================================

  /**
   * Public identifier of the Journey being booked.
   *
   * This is a cross-domain public identifier and is converted to
   * JourneyBookingJourneyPublicId before entering the application layer.
   */
  @ApiProperty({
    description:
      'Public identifier of the Journey that the passenger wants to book.',
    example: 'JNY-01J8XYZ123',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyPublicId!: string;

  // ===========================================================================
  // Seats
  // ===========================================================================

  /**
   * Number of seats requested by the authenticated passenger.
   *
   * The transport boundary restricts the value to a positive integer.
   * JourneyBookingSeats provides the corresponding domain invariant.
   */
  @ApiProperty({
    description: 'Number of seats requested for the Journey Booking.',
    example: 1,
    minimum: 1,
    maximum: 20,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @Max(20)
  seats!: number;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Optional correlation identifier used to trace this request through the
   * application workflow.
   *
   * The client may provide one when it already has a correlation context.
   * It is intentionally not required for a normal booking request.
   *
   * Example:
   *
   *     {
   *       "journeyPublicId": "JNY-01J8XYZ123",
   *       "seats": 1
   *     }
   *
   * is a valid request.
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
   *
   * Most direct REST booking requests will not have a causation identifier.
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

export default CreateJourneyBookingDto;
