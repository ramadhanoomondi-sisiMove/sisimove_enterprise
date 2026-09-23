// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Preferences API
// -----------------------------------------------------------------------------
//
// Provider-declared Journey preferences.
//
// There is no preference catalogue and therefore no preferencesPublicId.
// The backend creates or updates the JourneyPreferences child from the
// provider-declared values.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/foundation/http';

// =============================================================================
// Input
// =============================================================================

export interface AttachJourneyPreferencesInput {
  smoking:
    | 'ALLOWED'
    | 'NOT_ALLOWED';

  pets:
    | 'ALLOWED'
    | 'NOT_ALLOWED'
    | 'SERVICE_ANIMALS_ONLY';

  luggage:
    | 'NONE'
    | 'LIMITED'
    | 'STANDARD'
    | 'LARGE';

  conversation:
    | 'QUIET'
    | 'MODERATE'
    | 'SOCIAL';

  music:
    | 'NONE'
    | 'LOW'
    | 'MODERATE'
    | 'ANY';
}

// =============================================================================
// API
// =============================================================================

export async function attachJourneyPreferences(
  journeyPublicId: string,
  input: AttachJourneyPreferencesInput,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(
      journeyPublicId,
    )}/preferences`,
    input,
  );
}