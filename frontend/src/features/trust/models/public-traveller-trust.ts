// -----------------------------------------------------------------------------
// sisiMove — Public Traveller Trust
// -----------------------------------------------------------------------------
//
// Public read model for the Trust Profile.
//
// This is intentionally NOT a mirror of the TrustProfile Prisma model.
//
// The Trust domain owns:
// - trust profile lifecycle;
// - verification state;
// - ratings and rating lifecycle;
// - journey statistics;
// - cancellations and completion metrics;
// - trust events;
// - badge definitions and awards;
// - internal cross-domain references.
//
// The public trust boundary exposes only the information required to help a
// marketplace visitor evaluate whether a traveller is trustworthy.
//
// Internal TrustProfile identifiers, Identity references, ratings/reviews,
// disputes, trust events, booking references, and operational metadata remain
// behind the Trust domain boundary.
//
// The public model is therefore a presentation/read contract rather than a
// persistence model.
//
// -----------------------------------------------------------------------------
//
// Public composition:
//
// PublicTravellerTrust
// ├── verificationLevel
// ├── ratingAverage
// ├── ratingCount
// ├── completedJourneys
// └── badges
//
// -----------------------------------------------------------------------------

import type { PublicTrustBadge } from "./public-trust-badge";

// -----------------------------------------------------------------------------
// Public verification level
// -----------------------------------------------------------------------------
//
// These values intentionally mirror the semantic public meaning of the
// backend TrustVerificationLevel enum.
//
// The frontend must not import Prisma/backend enums directly.
//
// -----------------------------------------------------------------------------

export type PublicTrustVerificationLevel =
  | "NONE"
  | "BASIC"
  | "VERIFIED"
  | "HIGHLY_VERIFIED";

// -----------------------------------------------------------------------------
// Public Traveller Trust
// -----------------------------------------------------------------------------

export interface PublicTravellerTrust {
  /**
   * Current public verification level of the traveller.
   *
   * This allows marketplace surfaces to communicate the strength of the
   * traveller's verification without exposing the underlying verification
   * workflow or evidence.
   */
  verificationLevel: PublicTrustVerificationLevel;

  /**
   * Average rating received by the traveller.
   *
   * The backend stores this as a Decimal. The public frontend contract uses
   * number because this value is consumed directly for presentation.
   */
  ratingAverage: number;

  /**
   * Number of active ratings contributing to the public rating summary.
   */
  ratingCount: number;

  /**
   * Number of completed journeys represented by the trust projection.
   *
   * This is intentionally a trust-facing statistic rather than a direct
   * exposure of the entire Traveller Profile statistics model.
   */
  completedJourneys: number;

  /**
   * Active public trust badges awarded to the traveller.
   *
   * Revoked/inactive badge assignments must not be included by the public
   * read boundary.
   */
  badges: PublicTrustBadge[];
}