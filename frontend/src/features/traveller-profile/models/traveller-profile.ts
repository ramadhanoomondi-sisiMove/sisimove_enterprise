//features/traveller-profile/models/traveller-profile.ts`

// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Model
// -----------------------------------------------------------------------------
//
// Authenticated Traveller Profile representation.
//
// Architectural rules:
// - This is a frontend feature model, not a Prisma model.
// - Cross-domain references remain opaque public IDs.
// - The model mirrors the TravellerProfile API contract.
// - Profile statistics are read-only projections.
// - Profile components such as preferences and corridors are represented by
//   their own feature models.
//
// -----------------------------------------------------------------------------

import type { TravellerProfileCorridor } from "./traveller-profile-corridor";
import type { TravellerProfilePreferences } from "./traveller-profile-preferences";

// -----------------------------------------------------------------------------
// Profile lifecycle
// -----------------------------------------------------------------------------

export type TravellerProfileStatus =
  | "ACTIVE"
  | "RESTRICTED"
  | "SUSPENDED"
  | "CLOSED";

export type TravellerProfileVisibility =
  | "PUBLIC"
  | "LIMITED"
  | "PRIVATE";

// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------

export interface TravellerProfile {
  /**
   * Public identifier of the traveller profile.
   */
  publicId: string;

  /**
   * Public reference to the owning Identity.
   *
   * This is intentionally treated as an opaque cross-domain identifier.
   */
  memberPublicId: string;

  /**
   * Public traveller handle.
   *
   * Example:
   *   john_doe
   */
  handle: string;

  /**
   * Optional traveller biography.
   */
  bio: string | null;

  /**
   * Public reference to the traveller's avatar Asset.
   *
   * This is intentionally not expanded into an Asset model here.
   */
  avatarAssetPublicId: string | null;

  /**
   * ISO 3166-1 alpha-2 country code.
   *
   * Example:
   *   KE
   */
  countryCode: string;

  /**
   * Profile lifecycle state.
   */
  status: TravellerProfileStatus;

  /**
   * Public profile visibility.
   */
  visibility: TravellerProfileVisibility;

  // ---------------------------------------------------------------------------
  // Materialized journey statistics
  //
  // Journey remains authoritative.
  // These values are projections exposed by Traveller Profile.
  // ---------------------------------------------------------------------------

  totalJourneys: number;
  completedJourneys: number;

  providerJourneys: number;
  passengerJourneys: number;

  completedProviderJourneys: number;
  completedPassengerJourneys: number;

  // ---------------------------------------------------------------------------
  // Profile components
  // ---------------------------------------------------------------------------

  preferences: TravellerProfilePreferences | null;

  corridors: TravellerProfileCorridor[];

  // ---------------------------------------------------------------------------
  // Audit timestamps
  // ---------------------------------------------------------------------------

  createdAt: string;
  updatedAt: string;
}







