// -----------------------------------------------------------------------------
// sisiMove — Traveller Trust Model
// -----------------------------------------------------------------------------
//
// Authenticated trust representation for the current traveller.
//
// This is a frontend application model.
// It is intentionally not a Prisma mirror.
//
// Responsibilities:
// - Represent the authenticated traveller's trust state.
// - Represent rating statistics.
// - Represent journey/completion statistics.
// - Represent cancellation statistics.
// - Represent the traveller's trust badges.
//
// Non-responsibilities:
// - Trust events.
// - Internal database identifiers.
// - Reviewer/moderation data.
// - Cross-domain persistence concerns.
// - Trust calculation logic.
//
// -----------------------------------------------------------------------------

import type { PublicTrustBadge } from './public-trust-badge';

export type TravellerTrustStatus =
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'REVOKED';

export type TravellerTrustVerificationLevel =
  | 'NONE'
  | 'MEMBER'
  | 'DRIVER';

export interface TravellerTrust {
  publicId: string;

  status: TravellerTrustStatus;
  verificationLevel: TravellerTrustVerificationLevel;

  // ---------------------------------------------------------------------------
  // Rating statistics
  // ---------------------------------------------------------------------------

  ratingAverage: number;
  ratingCount: number;

  // ---------------------------------------------------------------------------
  // Journey statistics
  // ---------------------------------------------------------------------------

  completedJourneys: number;
  providerJourneys: number;
  passengerJourneys: number;

  completedProviderJourneys: number;
  completedPassengerJourneys: number;

  // ---------------------------------------------------------------------------
  // Cancellation statistics
  // ---------------------------------------------------------------------------

  cancelledJourneys: number;
  providerCancellations: number;
  passengerCancellations: number;

  // ---------------------------------------------------------------------------
  // Trust statistics
  // ---------------------------------------------------------------------------

  completionRate: number;
  cancellationRate: number;

  // ---------------------------------------------------------------------------
  // Badges
  // ---------------------------------------------------------------------------

  badges: readonly PublicTrustBadge[];

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  createdAt: string;
  updatedAt: string;
}