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
 * - journeyPublicId    → JourneyBookingJourneyPublicId
 * - passengerPublicId  → JourneyBookingPassengerPublicId
 * - seats              → JourneyBookingSeats
 *
 * before constructing CreateJourneyBookingCommand.
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
  // Passenger
  // ===========================================================================

  /**
   * Public identifier of the passenger creating the booking.
   *
   * This is a cross-domain public identifier and is converted to
   * JourneyBookingPassengerPublicId before entering the application layer.
   */
  @ApiProperty({
    description:
      'Public identifier of the passenger making the Journey Booking.',
    example: 'IDN-01J8XYZ456',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  passengerPublicId!: string;

  // ===========================================================================
  // Seats
  // ===========================================================================

  /**
   * Number of seats requested by the passenger.
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
   * Correlation identifier used to trace the request through the application
   * and domain workflow.
   */
  @ApiProperty({
    description:
      'Identifier used to correlate this request with the originating workflow or distributed trace.',
    example: 'corr-01J8XYZ789',
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
