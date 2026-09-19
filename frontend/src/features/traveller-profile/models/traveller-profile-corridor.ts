//features/traveller-profile/models/traveller-profile-corridor.ts`


// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Corridor Model
// -----------------------------------------------------------------------------
//
// Authenticated Traveller Profile frequent-travel-corridor representation.
//
// Architectural rules:
// - A corridor belongs to Traveller Profile.
// - A corridor is NOT a Journey reference.
// - corridorKey is a discovery/matching identifier, not a foreign key.
// - Coordinates are represented as numbers at the frontend boundary.
// - The frontend does not infer or construct Journey relationships from this
//   model.
//
// -----------------------------------------------------------------------------

export interface TravellerProfileCorridor {
  /**
   * Public identifier of the corridor.
   */
  publicId: string;

  /**
   * Owning Traveller Profile identifier.
   */
  profileId: string;

  // ---------------------------------------------------------------------------
  // Human-readable corridor
  // ---------------------------------------------------------------------------

  /**
   * Origin display name.
   *
   * Example:
   *   Nairobi
   */
  originName: string;

  /**
   * Destination display name.
   *
   * Example:
   *   Mombasa
   */
  destinationName: string;

  // ---------------------------------------------------------------------------
  // Geographic discovery coordinates
  // ---------------------------------------------------------------------------

  /**
   * Origin latitude.
   */
  originLatitude: number;

  /**
   * Origin longitude.
   */
  originLongitude: number;

  /**
   * Destination latitude.
   */
  destinationLatitude: number;

  /**
   * Destination longitude.
   */
  destinationLongitude: number;

  // ---------------------------------------------------------------------------
  // Discovery / matching
  // ---------------------------------------------------------------------------

  /**
   * Stable corridor discovery/matching identifier.
   *
   * This is intentionally NOT a Journey identifier.
   */
  corridorKey: string | null;

  /**
   * Whether this is the traveller's primary corridor.
   */
  isPrimary: boolean;

  // ---------------------------------------------------------------------------
  // Audit timestamps
  // ---------------------------------------------------------------------------

  createdAt: string;
  updatedAt: string;
}

