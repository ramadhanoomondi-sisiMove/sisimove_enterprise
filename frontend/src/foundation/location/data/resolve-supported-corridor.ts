// -----------------------------------------------------------------------------
// Path: src/features/journey/lib/resolve-supported-corridor.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Supported Journey Corridor Resolver
//
// Resolves a user's selected From + To locations against the SisiMove-owned
// supported corridor catalogue.
//
// Responsibilities:
// - resolve a supported origin;
// - resolve a supported destination;
// - resolve the supported corridor connecting them;
// - return the canonical corridor key and coordinates;
// - avoid external geocoding or routing services.
//
// This module does NOT:
// - call an external API;
// - access Prisma;
// - create Journey entities;
// - persist anything;
// - modify Journey state.
//
// -----------------------------------------------------------------------------

import type { SupportedLocation } from "@/foundation/location/types/location.types";

import { SUPPORTED_CORRIDORS } from "../data/supported-corridors";
import type { ResolvedJourneyCorridor } from "../types/journey-corridor.types";

// -----------------------------------------------------------------------------
// Normalization
// -----------------------------------------------------------------------------

function normalizeLocationKey(value: string): string {
  return value.trim().toUpperCase();
}

// -----------------------------------------------------------------------------
// Location Resolution
// -----------------------------------------------------------------------------

/**
 * Finds a SisiMove-supported location by its stable key.
 */
export function findSupportedLocation(
  locationKey: string,
): SupportedLocation | undefined {
  const normalizedKey = normalizeLocationKey(locationKey);

  for (const corridor of SUPPORTED_CORRIDORS) {
    const locations: readonly SupportedLocation[] = [
      corridor.origin,
      corridor.destination,
      ...corridor.routes.map((route) => route.location),
    ];

    const location = locations.find(
      (candidate) => candidate.key === normalizedKey,
    );

    if (location !== undefined) {
      return location;
    }
  }

  return undefined;
}

// -----------------------------------------------------------------------------
// Corridor Resolution
// -----------------------------------------------------------------------------

/**
 * Resolves a supported Journey corridor from the selected origin and
 * destination location keys.
 *
 * Both locations must belong to the same supported corridor.
 */
export function resolveSupportedCorridor(
  originKey: string,
  destinationKey: string,
): ResolvedJourneyCorridor | undefined {
  const normalizedOriginKey = normalizeLocationKey(originKey);
  const normalizedDestinationKey = normalizeLocationKey(destinationKey);

  if (
    normalizedOriginKey.length === 0 ||
    normalizedDestinationKey.length === 0
  ) {
    return undefined;
  }

  const corridor = SUPPORTED_CORRIDORS.find(
    (candidate) =>
      candidate.origin.key === normalizedOriginKey &&
      candidate.destination.key === normalizedDestinationKey,
  );

  if (corridor === undefined) {
    return undefined;
  }

  return {
    corridorKey: corridor.key,
    origin: corridor.origin,
    destination: corridor.destination,
  };
}

// -----------------------------------------------------------------------------
// Corridor Search
// -----------------------------------------------------------------------------

/**
 * Returns supported corridors whose origin matches the selected origin.
 *
 * This is useful when the user has selected "From" but has not selected "To"
 * yet.
 */
export function getSupportedCorridorsFromOrigin(
  originKey: string,
): readonly typeof SUPPORTED_CORRIDORS[number][] {
  const normalizedOriginKey = normalizeLocationKey(originKey);

  if (normalizedOriginKey.length === 0) {
    return [];
  }

  return SUPPORTED_CORRIDORS.filter(
    (corridor) => corridor.origin.key === normalizedOriginKey,
  );
}

/**
 * Returns supported destination locations for a selected origin.
 *
 * This allows the Journey creation form to constrain "To" to destinations
 * that SisiMove actually supports from the selected "From" location.
 */
export function getSupportedDestinations(
  originKey: string,
): readonly SupportedLocation[] {
  return getSupportedCorridorsFromOrigin(originKey).map(
    (corridor) => corridor.destination,
  );
}