// -----------------------------------------------------------------------------
// Journey Booking Coordinates
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyBookingCoordinatesProps {
  latitude: number;
  longitude: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Geographic coordinates captured in a Journey Booking snapshot.
 *
 * A coordinate represents one geographic position and therefore contains
 * latitude and longitude together.
 *
 * This value object is used for both:
 *
 * - Origin coordinates
 * - Destination coordinates
 *
 * Latitude:
 *   -90 <= latitude <= 90
 *
 * Longitude:
 *   -180 <= longitude <= 180
 *
 * The coordinate is a booking-time snapshot and does not represent a
 * live location.
 */
export class JourneyBookingCoordinates extends ValueObject<JourneyBookingCoordinatesProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(latitude: number, longitude: number) {
    JourneyBookingCoordinates.assertLatitude(latitude);
    JourneyBookingCoordinates.assertLongitude(longitude);

    super({
      latitude,
      longitude,
    });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    latitude: number,
    longitude: number,
  ): JourneyBookingCoordinates {
    return new JourneyBookingCoordinates(latitude, longitude);
  }

  // ---------------------------------------------------------------------------
  // Latitude
  // ---------------------------------------------------------------------------

  public get latitude(): number {
    return this.props.latitude;
  }

  // ---------------------------------------------------------------------------
  // Longitude
  // ---------------------------------------------------------------------------

  public get longitude(): number {
    return this.props.longitude;
  }

  // ---------------------------------------------------------------------------
  // Value
  // ---------------------------------------------------------------------------

  public get value(): JourneyBookingCoordinatesProps {
    return {
      latitude: this.props.latitude,
      longitude: this.props.longitude,
    };
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static assertLatitude(latitude: number): void {
    if (!Number.isFinite(latitude)) {
      throw new Error('Journey Booking latitude must be a finite number.');
    }

    if (latitude < -90 || latitude > 90) {
      throw new Error('Journey Booking latitude must be between -90 and 90.');
    }
  }

  private static assertLongitude(longitude: number): void {
    if (!Number.isFinite(longitude)) {
      throw new Error('Journey Booking longitude must be a finite number.');
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error(
        'Journey Booking longitude must be between -180 and 180.',
      );
    }
  }
}
