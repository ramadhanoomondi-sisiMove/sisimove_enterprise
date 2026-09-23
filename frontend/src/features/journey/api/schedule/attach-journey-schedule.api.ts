// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Schedule API
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/foundation/http/authenticated-api-client';

export interface AttachJourneyScheduleInput {
  schedulePublicId: string;
}

export async function attachJourneySchedule(
  journeyPublicId: string,
  input: AttachJourneyScheduleInput,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/schedule`,
    input,
  );
}