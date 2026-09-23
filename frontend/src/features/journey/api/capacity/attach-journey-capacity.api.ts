import { authenticatedApiClient } from '@/foundation/http';

// =============================================================================
// Types
// =============================================================================

export interface AttachJourneyCapacityInput {
  /**
   * Number of passenger seats the provider is offering for this Journey.
   */
  totalSeats: number;
}

// =============================================================================
// API
// =============================================================================

export async function attachJourneyCapacity(
  journeyPublicId: string,
  input: AttachJourneyCapacityInput,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(
      journeyPublicId,
    )}/capacity`,
    input,
  );
}

