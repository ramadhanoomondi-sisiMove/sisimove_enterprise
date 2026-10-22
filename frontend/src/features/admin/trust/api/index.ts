/**
 * sisiMove — Trust API
 *
 * Public exports for Trust feature API adapters.
 */

export { trustProfilesApi } from './trust-profiles.api';

export { trustBadgesApi } from './trust-badges.api';

export { trustOperationsApi } from './trust-operations.api';

export type {
  CreateTrustBadgeRequest,
  UpdateTrustBadgeRequest,
  ChangeTrustBadgeTypeRequest,
  ChangeTrustBadgeNameRequest,
  ChangeTrustBadgeDescriptionRequest,
  SetTrustBadgeAssetRequest,
  TrustBadgeMutationResponse,
} from './trust-badges.api';
