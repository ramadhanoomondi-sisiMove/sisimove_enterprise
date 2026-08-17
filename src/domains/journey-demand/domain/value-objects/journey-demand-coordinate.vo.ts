// -----------------------------------------------------------------------------
// Journey Demand Coordinate
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandCoordinateProps {
  latitude: number;
  longitude: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Geographic coordinate used by Journey Demand corridors and waypoints.
 *
 * A coordinate represents one geographic position and therefore contains
 * latitude and longitude together.
 *
 * Latitude:
 *   -90 <= latitude <= 90
 *
 * Longitude:
 *   -180 <= longitude <= 180
 */
export class JourneyDemandCoordinate extends ValueObject<JourneyDemandCoordinateProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(latitude: number, longitude: number) {
    JourneyDemandCoordinate.assertLatitude(latitude);
    JourneyDemandCoordinate.assertLongitude(longitude);

    super({
      latitude,
      longitude,
    });
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

  public get value(): JourneyDemandCoordinateProps {
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
      throw new Error('Journey demand latitude must be a finite number.');
    }

    if (latitude < -90 || latitude > 90) {
      throw new Error('Journey demand latitude must be between -90 and 90.');
    }
  }

  private static assertLongitude(longitude: number): void {
    if (!Number.isFinite(longitude)) {
      throw new Error('Journey demand longitude must be a finite number.');
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error('Journey demand longitude must be between -180 and 180.');
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyDemandCoordinateProps };
