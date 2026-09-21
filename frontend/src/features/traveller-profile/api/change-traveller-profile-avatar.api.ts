// -----------------------------------------------------------------------------
// sisiMove — Change Traveller Profile Avatar API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for changing the avatar associated with a
// TravellerProfile.
//
// Backend contract:
//
// PATCH /traveller-profiles/:travellerProfileId/avatar
//
// Body:
// {
//   avatarAssetPublicId: string | null
// }
//
// Responsibilities:
// - Build the authenticated HTTP request.
// - Encode the TravellerProfile public ID.
// - Pass the Asset public ID selected for the avatar.
// - Support clearing the avatar by sending null.
//
// Non-responsibilities:
// - Uploading the Asset.
// - Resolving the Asset URL.
// - Validating Asset ownership.
// - Managing TravellerProfile state.
// - Managing UI state.
//
// Those concerns belong to their respective feature boundaries.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

const TRAVELLER_PROFILES_PATH = '/traveller-profiles';

// -----------------------------------------------------------------------------
// Input
// -----------------------------------------------------------------------------

export interface ChangeTravellerProfileAvatarInput {
  readonly avatarAssetPublicId: string | null;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export async function changeTravellerProfileAvatar(
  travellerProfileId: string,
  input: ChangeTravellerProfileAvatarInput,
): Promise<void> {
  const encodedTravellerProfileId =
    encodeURIComponent(travellerProfileId);

  await authenticatedApiClient.patch<void>(
    `${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/avatar`,
    {
      avatarAssetPublicId: input.avatarAssetPublicId,
    },
  );
}