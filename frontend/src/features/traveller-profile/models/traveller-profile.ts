// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------
//
// Canonical frontend representation of a SisiMove traveller profile.
//
// The Traveller Profile is a product/social representation of a traveller.
// It is NOT the authoritative identity record.
//
// Identity remains responsible for:
// - Digital identity
// - Authentication
// - Authoritative names/identity attributes
// - Account lifecycle
// - Identity verification
//
// Traveller Profile is responsible for:
// - Social-facing profile presentation
// - Traveller handle
// - Public profile information
// - Traveller biography
// - Primary travel corridor
// - Traveller preferences
// - Profile visibility
//
// This model must remain independent of backend persistence models, Prisma
// models, domain aggregates, and database identifiers.
//
// -----------------------------------------------------------------------------

import type { TravellerCorridor } from './traveller-corridor';
import type { TravellerPreferences } from './traveller-preferences';

// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------

/**
 * Canonical frontend Traveller Profile model.
 *
 * This model can be used by both public and authenticated profile experiences.
 *
 * Public consumers must only receive fields that are intentionally exposed by
 * the public traveller-profile read model.
 */
export interface TravellerProfile {
  /**
   * Social-facing public handle.
   *
   * The handle is the primary public reference to a traveller within the
   * SisiMove social experience.
   */
  handle: string;

  /**
   * Traveller's display name.
   *
   * This is presentation data and does not replace the authoritative Identity
   * domain representation.
   */
  displayName: string;

  /**
   * Public profile avatar.
   *
   * Null when the traveller has no configured public avatar.
   */
  avatarUrl: string | null;

  /**
   * Traveller's public biography.
   *
   * Null when no biography has been provided.
   */
  bio: string | null;

  /**
   * Traveller's primary travel corridor.
   *
   * This represents the corridor the traveller commonly travels or shares.
   *
   * It is intentionally separate from an individual Journey route.
   */
  primaryCorridor: TravellerCorridor | null;

  /**
   * Traveller's configured travel preferences.
   *
   * These preferences describe the traveller's general travel style and
   * matching preferences. They are not booking, commercial, or financial
   * rules.
   */
  preferences: TravellerPreferences;

  /**
   * Indicates whether the traveller has chosen to make their profile publicly
   * discoverable.
   *
   * This is a profile visibility property and must not be interpreted as an
   * IdentityStatus.
   */
  isPublic: boolean;
}