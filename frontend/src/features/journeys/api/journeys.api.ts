// -----------------------------------------------------------------------------
// Journeys API
// -----------------------------------------------------------------------------
//
// Public API client for Journey read operations.
//
// This API intentionally consumes public Journey read models rather than
// exposing backend domain entities, Prisma models, or aggregate structures.
//
// Authentication is not required for these public read operations.
// -----------------------------------------------------------------------------

import { apiClient } from '../../../foundation/http/api-client';

import type { Journey } from '../models';

// -----------------------------------------------------------------------------
// API Paths
// -----------------------------------------------------------------------------

const PUBLIC_JOURNEYS_PATH = '/public/journeys';

// -----------------------------------------------------------------------------
// Get Public Journey
// -----------------------------------------------------------------------------

/**
 * Retrieves a publicly discoverable Journey by its public identifier.
 *
 * @param publicId Public Journey identifier.
 */
export async function getPublicJourney(
  publicId: string,
): Promise<Journey> {
  const normalizedPublicId = publicId.trim();

  if (!normalizedPublicId) {
    throw new Error('Journey public ID is required.');
  }

  return apiClient.get<Journey>(
    `${PUBLIC_JOURNEYS_PATH}/${encodeURIComponent(normalizedPublicId)}`,
  );
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export const journeysApi = {
  getPublic: getPublicJourney,
};