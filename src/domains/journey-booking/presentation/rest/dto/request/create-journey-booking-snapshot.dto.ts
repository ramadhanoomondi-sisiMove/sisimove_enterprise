// src/domains/journey-booking/presentation/http/dto/request/create-journey-booking-snapshot.dto.ts

// -----------------------------------------------------------------------------
// Journey Booking — Create Snapshot Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Transformation
// -----------------------------------------------------------------------------

import { Type } from 'class-transformer';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsInt,
  IsISO8601,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Coordinates DTO
// -----------------------------------------------------------------------------

/**
 * REST transport DTO for geographical coordinates.
 *
 * This nested DTO exists so that class-validator can correctly whitelist
 * and validate originCoordinates and destinationCoordinates when
 * forbidNonWhitelisted is enabled globally.
 */
class JourneyBookingCoordinatesDto {
  // ===========================================================================
  // Latitude
  // ===========================================================================

  @ApiProperty({
    description: 'Latitude of the location.',
    example: -1.286389,
  })
  @IsLatitude()
  latitude!: number;

  // ===========================================================================
  // Longitude
  // ===========================================================================

  @ApiProperty({
    description: 'Longitude of the location.',
    example: 36.817223,
  })
  @IsLongitude()
  longitude!: number;
}

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for creating a Journey Booking Snapshot.
 *
 * This DTO belongs exclusively to the presentation layer and therefore
 * contains transport primitives rather than domain value objects.
 *
 * The presentation/application mapping layer is responsible for converting
 * the transport values into the corresponding Journey Booking domain
 * value objects.
 *
 * The snapshot preserves the historical journey information associated
 * with the booking, including the origin, destination, schedule,
 * timezone, and vehicle information available at booking time.
 */
export class CreateJourneyBookingSnapshotDto {
  // ===========================================================================
  // Origin
  // ===========================================================================

  /**
   * Name of the journey origin.
   */
  @ApiProperty({
    description: 'Name of the journey origin.',
    example: 'Nairobi CBD',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  originName!: string;

  // ===========================================================================
  // Destination
  // ===========================================================================

  /**
   * Name of the journey destination.
   */
  @ApiProperty({
    description: 'Name of the journey destination.',
    example: 'Kakamega',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  destinationName!: string;

  // ===========================================================================
  // Origin Coordinates
  // ===========================================================================

  /**
   * Coordinates of the journey origin.
   *
   * The nested DTO ensures that class-validator recognizes the object
   * as a valid whitelisted property and validates its latitude and
   * longitude values.
   */
  @ApiProperty({
    description: 'Geographical coordinates of the journey origin.',
    type: JourneyBookingCoordinatesDto,
  })
  @ValidateNested()
  @Type(() => JourneyBookingCoordinatesDto)
  originCoordinates!: JourneyBookingCoordinatesDto;

  // ===========================================================================
  // Destination Coordinates
  // ===========================================================================

  /**
   * Coordinates of the journey destination.
   *
   * The nested DTO ensures that class-validator recognizes the object
   * as a valid whitelisted property and validates its latitude and
   * longitude values.
   */
  @ApiProperty({
    description: 'Geographical coordinates of the journey destination.',
    type: JourneyBookingCoordinatesDto,
  })
  @ValidateNested()
  @Type(() => JourneyBookingCoordinatesDto)
  destinationCoordinates!: JourneyBookingCoordinatesDto;

  // ===========================================================================
  // Departure
  // ===========================================================================

  /**
   * Scheduled departure date and time.
   *
   * The application layer converts this transport string into
   * JourneyBookingDepartureAt.
   */
  @ApiProperty({
    description: 'Scheduled departure date and time of the journey.',
    example: '2026-10-15T08:00:00.000Z',
  })
  @IsISO8601()
  departureAt!: string;

  // ===========================================================================
  // Arrival
  // ===========================================================================

  /**
   * Optional scheduled arrival date and time.
   */
  @ApiPropertyOptional({
    description: 'Optional scheduled arrival date and time of the journey.',
    example: '2026-10-15T14:00:00.000Z',
  })
  @IsOptional()
  @IsISO8601()
  arrivalAt?: string;

  // ===========================================================================
  // Timezone
  // ===========================================================================

  /**
   * IANA timezone associated with the journey schedule.
   */
  @ApiProperty({
    description: 'IANA timezone associated with the journey schedule.',
    example: 'Africa/Nairobi',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  timezone!: string;

  // ===========================================================================
  // Vehicle
  // ===========================================================================

  /**
   * Vehicle make captured in the booking snapshot.
   */
  @ApiPropertyOptional({
    description: 'Vehicle make captured at the time of booking.',
    example: 'Toyota',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  vehicleMake?: string;

  /**
   * Vehicle model captured in the booking snapshot.
   */
  @ApiPropertyOptional({
    description: 'Vehicle model captured at the time of booking.',
    example: 'Hiace',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  vehicleModel?: string;

  /**
   * Vehicle manufacturing year.
   */
  @ApiPropertyOptional({
    description: 'Vehicle manufacturing year.',
    example: 2024,
    minimum: 1900,
    maximum: 2100,
  })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  vehicleYear?: number;

  /**
   * Vehicle colour captured in the booking snapshot.
   */
  @ApiPropertyOptional({
    description: 'Vehicle colour captured at the time of booking.',
    example: 'White',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  vehicleColor?: string;

  /**
   * Vehicle registration number.
   */
  @ApiPropertyOptional({
    description: 'Vehicle registration number captured at the time of booking.',
    example: 'KDA 123A',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  vehicleRegistration?: string;

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

export default CreateJourneyBookingSnapshotDto;
