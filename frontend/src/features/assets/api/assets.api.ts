// -----------------------------------------------------------------------------
// sisiMove — Assets API
// -----------------------------------------------------------------------------
//
// Public Asset API.
//
// This client exposes only public asset retrieval.
//
// Asset ownership, upload authorization, storage-provider details,
// moderation, and lifecycle management remain backend concerns.
//
// The backend is responsible for determining whether an asset is public
// and for resolving its appropriate delivery URL.
// -----------------------------------------------------------------------------

import { apiClient } from '../../../foundation/http/api-client';

import type { PublicAsset } from '../models';

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

const PUBLIC_ASSETS_PATH = '/public/assets';

// -----------------------------------------------------------------------------
// Get Public Asset
// -----------------------------------------------------------------------------

export async function getPublicAsset(
  publicId: string,
): Promise<PublicAsset> {
  const normalizedPublicId = publicId.trim();

  if (!normalizedPublicId) {
    throw new Error('Asset public ID is required.');
  }

  const encodedPublicId =
    encodeURIComponent(normalizedPublicId);

  return apiClient.get<PublicAsset>(
    `${PUBLIC_ASSETS_PATH}/${encodedPublicId}`,
  );
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export const assetsApi = {
  getPublic: getPublicAsset,
} as const;