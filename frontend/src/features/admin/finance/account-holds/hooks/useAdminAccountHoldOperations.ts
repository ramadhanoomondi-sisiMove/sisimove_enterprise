
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { adminAccountHoldsApi } from '../api';
import type {
  CreateAdminAccountHoldRequest,
  CaptureAdminAccountHoldRequest,
  ReleaseAdminAccountHoldRequest,
  CancelAdminAccountHoldRequest,
} from '../models';
import { adminAccountHoldKeys } from './useAdminAccountHolds';

export function useAdminAccountHoldOperations() {
  const queryClient = useQueryClient();

  const invalidateHoldData = async () => {
    await queryClient.invalidateQueries({
      queryKey: adminAccountHoldKeys.all,
    });
  };

  const createHold = useMutation({
    mutationFn: (request: CreateAdminAccountHoldRequest) =>
      adminAccountHoldsApi.create(request),
    onSuccess: invalidateHoldData,
  });

  const captureHold = useMutation({
    mutationFn: ({
      holdPublicId,
      request,
    }: {
      holdPublicId: string;
      request: CaptureAdminAccountHoldRequest;
    }) => adminAccountHoldsApi.capture(holdPublicId, request),
    onSuccess: invalidateHoldData,
  });

  const releaseHold = useMutation({
    mutationFn: ({
      holdPublicId,
      request,
    }: {
      holdPublicId: string;
      request: ReleaseAdminAccountHoldRequest;
    }) => adminAccountHoldsApi.release(holdPublicId, request),
    onSuccess: invalidateHoldData,
  });

  const cancelHold = useMutation({
    mutationFn: ({
      holdPublicId,
      request,
    }: {
      holdPublicId: string;
      request: CancelAdminAccountHoldRequest;
    }) => adminAccountHoldsApi.cancel(holdPublicId, request),
    onSuccess: invalidateHoldData,
  });

  return {
    createHold,
    captureHold,
    releaseHold,
    cancelHold,
    isPending:
      createHold.isPending ||
      captureHold.isPending ||
      releaseHold.isPending ||
      cancelHold.isPending,
  };
}
