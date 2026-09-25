// -----------------------------------------------------------------------------
// Journey Booking — Snapshot Mapper
// -----------------------------------------------------------------------------
//
// Maps the Journey Booking snapshot representation received from the HTTP API
// into the frontend/application model.
//
// The snapshot is historical booking data. It represents the Journey state
// captured for the booking and must therefore be treated as immutable display
// data by the frontend.
//
// Important backend/frontend boundary:
//
// The backend response mapper currently exposes:
//
//   originCoordinates
//   destinationCoordinates
//   departureAt
//   arrivalAt
//   vehicleMake
//   vehicleModel
//   vehicleYear
//   vehicleColor
//   vehicleRegistration
//
// The frontend model intentionally presents vehicle information as a nested
// `vehicle` object because that is the natural UI/application representation.
// This mapper is the single translation point between those two shapes.
//
// Coordinates and timestamps are validated here only for representation
// safety. Domain validation remains exclusively owned by the backend.
// -----------------------------------------------------------------------------

import type {
  JourneyBookingCoordinates,
  JourneyBookingSnapshot,
  JourneyBookingVehicleSnapshot,
} from '../models';

/**
 * Transport representation returned by the Journey Booking HTTP API.
 *
 * Coordinates and temporal values are represented as unknown at the backend
 * mapper boundary, so the frontend mapper narrows them into the application
 * model without importing backend/domain types.
 */
export interface JourneyBookingSnapshotApiResponse {
  publicId: string;
  originName: string;
  destinationName: string;
  originCoordinates: unknown;
  destinationCoordinates: unknown;
  departureAt: unknown;
  arrivalAt: unknown;
  timezone: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleColor?: string;
  vehicleRegistration?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Maps an API coordinate value into the frontend coordinate model.
 *
 * The backend response mapper currently exposes coordinates as `unknown`.
 * The expected serialized representation is an object containing numeric
 * latitude and longitude values.
 */
function mapCoordinates(
  value: unknown,
  fieldName: string,
): JourneyBookingCoordinates {
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value)
  ) {
    throw new TypeError(
      `Journey Booking snapshot ${fieldName} must be an object.`,
    );
  }

  const candidate = value as {
    latitude?: unknown;
    longitude?: unknown;
  };

  if (
    typeof candidate.latitude !== 'number' ||
    !Number.isFinite(candidate.latitude)
  ) {
    throw new TypeError(
      `Journey Booking snapshot ${fieldName}.latitude must be a finite number.`,
    );
  }

  if (
    typeof candidate.longitude !== 'number' ||
    !Number.isFinite(candidate.longitude)
  ) {
    throw new TypeError(
      `Journey Booking snapshot ${fieldName}.longitude must be a finite number.`,
    );
  }

  return {
    latitude: candidate.latitude,
    longitude: candidate.longitude,
  };
}

/**
 * Maps a backend temporal value into the ISO string representation consumed
 * by the frontend.
 *
 * JSON responses normally serialize Date values to ISO strings. The mapper
 * also accepts Date instances defensively because this function may be reused
 * with already-normalized transport data in tests or server-side code.
 */
function mapTimestamp(value: unknown, fieldName: string): string {
  if (typeof value === 'string') {
    if (value.trim().length === 0) {
      throw new TypeError(
        `Journey Booking snapshot ${fieldName} must not be empty.`,
      );
    }

    return value;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new TypeError(
        `Journey Booking snapshot ${fieldName} must be a valid date.`,
      );
    }

    return value.toISOString();
  }

  throw new TypeError(
    `Journey Booking snapshot ${fieldName} must be an ISO timestamp string.`,
  );
}

/**
 * Creates the nested vehicle representation when at least one vehicle field
 * is present.
 *
 * Returning `undefined` when no vehicle information exists preserves the
 * optionality of the frontend model and prevents an empty vehicle object from
 * appearing in the UI.
 */
function mapVehicle(
  response: JourneyBookingSnapshotApiResponse,
): JourneyBookingVehicleSnapshot | undefined {
  const hasVehicleInformation =
    response.vehicleMake !== undefined ||
    response.vehicleModel !== undefined ||
    response.vehicleYear !== undefined ||
    response.vehicleColor !== undefined ||
    response.vehicleRegistration !== undefined;

  if (!hasVehicleInformation) {
    return undefined;
  }

  return {
    make: response.vehicleMake,
    model: response.vehicleModel,
    year: response.vehicleYear,
    color: response.vehicleColor,
    registration: response.vehicleRegistration,
  };
}

/**
 * Maps a Journey Booking snapshot API response into the frontend model.
 */
export function mapJourneyBookingSnapshot(
  response: JourneyBookingSnapshotApiResponse,
): JourneyBookingSnapshot {
  if (!response || typeof response !== 'object') {
    throw new TypeError(
      'Journey Booking snapshot response is required.',
    );
  }

  return {
    publicId: response.publicId,
    originName: response.originName,
    destinationName: response.destinationName,
    originCoordinates: mapCoordinates(
      response.originCoordinates,
      'originCoordinates',
    ),
    destinationCoordinates: mapCoordinates(
      response.destinationCoordinates,
      'destinationCoordinates',
    ),
    departureAt: mapTimestamp(
      response.departureAt,
      'departureAt',
    ),
    arrivalAt:
      response.arrivalAt == null
        ? undefined
        : mapTimestamp(response.arrivalAt, 'arrivalAt'),
    timezone: response.timezone,
    vehicle: mapVehicle(response),
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}