// -----------------------------------------------------------------------------
// Journey Booking Snapshot Model
// -----------------------------------------------------------------------------
//
// Frontend representation of the immutable journey information captured when
// a Journey Booking was created.
//
// This model is intentionally a booking-owned snapshot. It does not reference
// or depend on the current Journey model because the Journey may change after
// the booking has been created.
//
// The backend JourneyBooking aggregate owns this snapshot.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Supporting Types
// -----------------------------------------------------------------------------

/**
 * Geographic coordinates captured at booking time.
 *
 * Coordinates are represented as numbers at the HTTP boundary.
 * The backend remains responsible for validating the corresponding domain
 * value object.
 */
export interface JourneyBookingCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Vehicle information captured at booking time.
 */
export interface JourneyBookingVehicleSnapshot {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  registration?: string;
}

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * Journey information preserved as part of a Journey Booking.
 *
 * This is historical booking data and should not be replaced with current
 * Journey information when rendering an existing booking.
 */
export interface JourneyBookingSnapshot {
  /**
   * Public identity of the booking snapshot.
   */
  publicId: string;

  /**
   * Origin name captured when the booking was created.
   */
  originName: string;

  /**
   * Destination name captured when the booking was created.
   */
  destinationName: string;

  /**
   * Origin coordinates captured when the booking was created.
   */
  originCoordinates: JourneyBookingCoordinates;

  /**
   * Destination coordinates captured when the booking was created.
   */
  destinationCoordinates: JourneyBookingCoordinates;

  /**
   * Scheduled departure captured at booking time.
   *
   * ISO-8601 timestamp returned by the API.
   */
  departureAt: string;

  /**
   * Scheduled arrival captured at booking time.
   *
   * May be absent when the booking was created without a known arrival time.
   */
  arrivalAt?: string;

  /**
   * IANA timezone captured at booking time.
   *
   * Example: "Africa/Nairobi".
   */
  timezone: string;

  /**
   * Vehicle information captured at booking time.
   */
  vehicle?: JourneyBookingVehicleSnapshot;

  /**
   * Snapshot creation timestamp.
   */
  createdAt: string;

  /**
   * Snapshot last modification timestamp.
   */
  updatedAt: string;
}