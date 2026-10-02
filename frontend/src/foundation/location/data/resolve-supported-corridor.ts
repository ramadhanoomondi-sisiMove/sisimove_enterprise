// -----------------------------------------------------------------------------
// Path: src/foundation/location/data/resolve-supported-corridor.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Supported Journey Corridor Resolver
//
// Resolves a user's selected From + To locations against the SisiMove-owned
// supported corridor catalogue.
//
// Directionality:
// - Supported corridors are stored once in their canonical catalogue direction.
// - Every supported corridor is selectable in BOTH directions.
// - A destination may therefore become an origin and vice versa.
// - Reverse corridors are derived at resolution time; the catalogue does not
//   need duplicate entries.
//
// Responsibilities:
// - resolve a supported origin;
// - resolve a supported destination;
// - resolve a supported corridor in either direction;
// - return the canonical corridor key and directional coordinates;
// - expose supported destinations for either direction;
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
import type {
  ResolvedJourneyCorridor,
  SupportedCorridor,
} from "../types/journey-corridor.types";

// =============================================================================
// Normalization
// =============================================================================

function normalizeLocationKey(value: string): string {
  return value.trim().toUpperCase();
}

// =============================================================================
// Location Resolution
// =============================================================================

/**
 * Finds a SisiMove-supported location by its stable key.
 *
 * Locations are searched across:
 * - corridor origins;
 * - corridor destinations;
 * - intermediate route locations.
 *
 * A location is therefore available regardless of whether it is stored as an
 * origin or destination in the canonical corridor catalogue.
 */
export function findSupportedLocation(
  locationKey: string,
): SupportedLocation | undefined {
  const normalizedKey = normalizeLocationKey(locationKey);

  if (normalizedKey.length === 0) {
    return undefined;
  }

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

// =============================================================================
// Corridor Direction
// =============================================================================

/**
 * Determines whether the requested direction matches the canonical catalogue
 * direction.
 */
function isCanonicalDirection(
  corridor: SupportedCorridor,
  originKey: string,
  destinationKey: string,
): boolean {
  return (
    corridor.origin.key === originKey &&
    corridor.destination.key === destinationKey
  );
}

/**
 * Determines whether the requested direction is the reverse of the canonical
 * catalogue direction.
 */
function isReverseDirection(
  corridor: SupportedCorridor,
  originKey: string,
  destinationKey: string,
): boolean {
  return (
    corridor.destination.key === originKey &&
    corridor.origin.key === destinationKey
  );
}

// =============================================================================
// Reverse Corridor
// =============================================================================

/**
 * Creates the directional representation of a canonical corridor when the
 * Journey travels in the opposite direction.
 *
 * The underlying supported corridor remains canonical in the catalogue.
 *
 * The canonical corridor key is intentionally preserved. Direction is
 * represented by the resolved origin and destination rather than by creating
 * a second corridor identity.
 */
function reverseCorridor(
  corridor: SupportedCorridor,
): ResolvedJourneyCorridor {
  return {
    corridorKey: corridor.key,
    origin: corridor.destination,
    destination: corridor.origin,
  };
}

// =============================================================================
// Corridor Resolution
// =============================================================================

/**
 * Resolves a supported Journey corridor from the selected origin and
 * destination location keys.
 *
 * Both directions are supported.
 *
 * Examples:
 *
 *   NAIROBI → KISUMU
 *   KISUMU  → NAIROBI
 *
 * The supported corridor catalogue only needs to contain the canonical
 * NAIROBI → KISUMU definition.
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

  if (normalizedOriginKey === normalizedDestinationKey) {
    return undefined;
  }

  const corridor = SUPPORTED_CORRIDORS.find(
    (candidate) =>
      isCanonicalDirection(
        candidate,
        normalizedOriginKey,
        normalizedDestinationKey,
      ) ||
      isReverseDirection(
        candidate,
        normalizedOriginKey,
        normalizedDestinationKey,
      ),
  );

  if (corridor === undefined) {
    return undefined;
  }

  if (
    isCanonicalDirection(
      corridor,
      normalizedOriginKey,
      normalizedDestinationKey,
    )
  ) {
    return {
      corridorKey: corridor.key,
      origin: corridor.origin,
      destination: corridor.destination,
    };
  }

  return reverseCorridor(corridor);
}

// =============================================================================
// Corridor Search
// =============================================================================

/**
 * Returns supported corridors whose origin matches the selected origin.
 *
 * This is direction-aware.
 *
 * A location may be:
 * - the canonical origin of a corridor; or
 * - the canonical destination of a corridor, in which case the reverse
 *   direction is exposed.
 */
export function getSupportedCorridorsFromOrigin(
  originKey: string,
): readonly ResolvedJourneyCorridor[] {
  const normalizedOriginKey = normalizeLocationKey(originKey);

  if (normalizedOriginKey.length === 0) {
    return [];
  }

  const corridors: ResolvedJourneyCorridor[] = [];

  for (const corridor of SUPPORTED_CORRIDORS) {
    if (corridor.origin.key === normalizedOriginKey) {
      corridors.push({
        corridorKey: corridor.key,
        origin: corridor.origin,
        destination: corridor.destination,
      });

      continue;
    }

    if (corridor.destination.key === normalizedOriginKey) {
      corridors.push(reverseCorridor(corridor));
    }
  }

  return corridors;
}

// =============================================================================
// Destination Search
// =============================================================================

/**
 * Returns supported destination locations for a selected origin.
 *
 * Both canonical and reverse corridor directions are supported.
 *
 * Therefore:
 *
 *   From: Nairobi
 *   To:   Kisumu, Eldoret, Mombasa, ...
 *
 * and:
 *
 *   From: Kisumu
 *   To:   Nairobi
 *
 * are both valid when the corresponding canonical corridor exists.
 */
export function getSupportedDestinations(
  originKey: string,
): readonly SupportedLocation[] {
  return getSupportedCorridorsFromOrigin(originKey).map(
    (corridor) => corridor.destination,
  );
}