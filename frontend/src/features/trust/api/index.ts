// -----------------------------------------------------------------------------
// sisiMove — Trust API Barrel
// -----------------------------------------------------------------------------
//
// Public exports for the Trust feature's HTTP API boundary.
//
// This barrel exposes:
// - Trust API operations
// - Trust API transport contracts
//
// It does not expose:
// - Trust mappers
// - Trust domain implementation details
// - Persistence models
// - Internal Trust-domain structures
//
// -----------------------------------------------------------------------------

export {
  getPublicTrustProfile,
  trustApi,
} from './trust.api';

export type {
  PublicTrustProfileResponse,
  PublicTrustVerificationResponse,
  PublicTrustRatingResponse,
  PublicTrustJourneyHistoryResponse,
  PublicTrustBadgeResponse,
} from './trust-profile.types';