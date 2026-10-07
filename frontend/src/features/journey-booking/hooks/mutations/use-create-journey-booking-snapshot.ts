// frontend/src/features/journey-booking/hooks/use-create-journey-booking-snapshot.ts

import { useMutation } from '@tanstack/react-query';

import {
  createJourneyBookingSnapshot,
  type CreateJourneyBookingSnapshotRequest,
  type CreateJourneyBookingSnapshotResponse,
} from '../../api';

export interface CreateJourneyBookingSnapshotVariables {
  journeyBookingPublicId: string;
  request: CreateJourneyBookingSnapshotRequest;
}

export function useCreateJourneyBookingSnapshot() {
  return useMutation<
    CreateJourneyBookingSnapshotResponse,
    Error,
    CreateJourneyBookingSnapshotVariables
  >({
    mutationFn: ({
      journeyBookingPublicId,
      request,
    }) =>
      createJourneyBookingSnapshot(
        journeyBookingPublicId,
        request,
      ),
  });
}