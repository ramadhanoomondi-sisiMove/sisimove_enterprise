// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Vehicle API
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/foundation/http';

export interface AttachJourneyVehicleInput {
  vehiclePublicId: string;
}

export async function attachJourneyVehicle(
  journeyPublicId: string,
  input: AttachJourneyVehicleInput,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/vehicle`,
    input,
  );
}