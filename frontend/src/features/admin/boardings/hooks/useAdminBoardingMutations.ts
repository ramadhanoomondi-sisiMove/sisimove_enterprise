/**
 * sisiMove — Admin Boarding Mutations Hook
 *
 * Path:
 * src/features/admin/boardings/hooks/useAdminBoardingMutations.ts
 *
 * Responsibilities:
 * - Expose boarding lifecycle mutations.
 * - Invalidate affected boarding queries after success.
 * - Keep API execution and cache management out of UI components.
 */

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { adminBoardingsApi } from '../api/admin-boardings.api';

import type {
  CreateAdminBoardingRequest,
  OpenAdminBoardingRequest,
  StartAdminJourneyRequest,
  CancelAdminBoardingRequest,
  BoardAdminProviderRequest,
  BoardAdminPassengerRequest,
  MarkAdminPassengerNoShowRequest,
  WithdrawAdminBoardingParticipantRequest,
  RemoveAdminBoardingParticipantRequest,
} from '../api/admin-boardings.api';

import { adminBoardingQueryKeys } from './useAdminBoardings';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminBoardingMutations() {
  const queryClient = useQueryClient();

  const invalidateBoardings = async (
    boardingPublicId?: string,
  ): Promise<void> => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: adminBoardingQueryKeys.all,
      }),
      ...(boardingPublicId
        ? [
            queryClient.invalidateQueries({
              queryKey: adminBoardingQueryKeys.detail(
                boardingPublicId,
              ),
            }),
          ]
        : []),
    ]);
  };

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  const createBoarding = useMutation({
    mutationFn: (request: CreateAdminBoardingRequest) =>
      adminBoardingsApi.create(request),

    onSuccess: async () => {
      await invalidateBoardings();
    },
  });

  // ---------------------------------------------------------------------------
  // Open
  // ---------------------------------------------------------------------------

  const openBoarding = useMutation({
    mutationFn: ({
      boardingPublicId,
      request,
    }: {
      boardingPublicId: string;
      request?: OpenAdminBoardingRequest;
    }) =>
      adminBoardingsApi.open(boardingPublicId, request),

    onSuccess: async (_data, variables) => {
      await invalidateBoardings(variables.boardingPublicId);
    },
  });

  // ---------------------------------------------------------------------------
  // Provider Boarding
  // ---------------------------------------------------------------------------

  const boardProvider = useMutation({
    mutationFn: ({
      boardingPublicId,
      request,
    }: {
      boardingPublicId: string;
      request?: BoardAdminProviderRequest;
    }) =>
      adminBoardingsApi.boardProvider(
        boardingPublicId,
        request,
      ),

    onSuccess: async (_data, variables) => {
      await invalidateBoardings(variables.boardingPublicId);
    },
  });

  // ---------------------------------------------------------------------------
  // Passenger Boarding
  // ---------------------------------------------------------------------------

  const boardPassenger = useMutation({
    mutationFn: ({
      boardingPublicId,
      participantPublicId,
      request,
    }: {
      boardingPublicId: string;
      participantPublicId: string;
      request?: BoardAdminPassengerRequest;
    }) =>
      adminBoardingsApi.boardPassenger(
        boardingPublicId,
        participantPublicId,
        request,
      ),

    onSuccess: async (_data, variables) => {
      await invalidateBoardings(variables.boardingPublicId);
    },
  });

  // ---------------------------------------------------------------------------
  // Passenger No-Show
  // ---------------------------------------------------------------------------

  const markPassengerNoShow = useMutation({
    mutationFn: ({
      boardingPublicId,
      participantPublicId,
      request,
    }: {
      boardingPublicId: string;
      participantPublicId: string;
      request?: MarkAdminPassengerNoShowRequest;
    }) =>
      adminBoardingsApi.markPassengerNoShow(
        boardingPublicId,
        participantPublicId,
        request,
      ),

    onSuccess: async (_data, variables) => {
      await invalidateBoardings(variables.boardingPublicId);
    },
  });

  // ---------------------------------------------------------------------------
  // Withdraw Participant
  // ---------------------------------------------------------------------------

  const withdrawParticipant = useMutation({
    mutationFn: ({
      boardingPublicId,
      participantPublicId,
      request,
    }: {
      boardingPublicId: string;
      participantPublicId: string;
      request?: WithdrawAdminBoardingParticipantRequest;
    }) =>
      adminBoardingsApi.withdrawParticipant(
        boardingPublicId,
        participantPublicId,
        request,
      ),

    onSuccess: async (_data, variables) => {
      await invalidateBoardings(variables.boardingPublicId);
    },
  });

  // ---------------------------------------------------------------------------
  // Remove Participant
  // ---------------------------------------------------------------------------

  const removeParticipant = useMutation({
    mutationFn: ({
      boardingPublicId,
      participantPublicId,
      request,
    }: {
      boardingPublicId: string;
      participantPublicId: string;
      request?: RemoveAdminBoardingParticipantRequest;
    }) =>
      adminBoardingsApi.removeParticipant(
        boardingPublicId,
        participantPublicId,
        request,
      ),

    onSuccess: async (_data, variables) => {
      await invalidateBoardings(variables.boardingPublicId);
    },
  });

  // ---------------------------------------------------------------------------
  // Start Journey
  // ---------------------------------------------------------------------------

  const startJourney = useMutation({
    mutationFn: ({
      boardingPublicId,
      request,
    }: {
      boardingPublicId: string;
      request?: StartAdminJourneyRequest;
    }) =>
      adminBoardingsApi.startJourney(
        boardingPublicId,
        request,
      ),

    onSuccess: async (_data, variables) => {
      await invalidateBoardings(variables.boardingPublicId);
    },
  });

  // ---------------------------------------------------------------------------
  // Cancel Boarding
  // ---------------------------------------------------------------------------

  const cancelBoarding = useMutation({
    mutationFn: ({
      boardingPublicId,
      request,
    }: {
      boardingPublicId: string;
      request?: CancelAdminBoardingRequest;
    }) =>
      adminBoardingsApi.cancel(
        boardingPublicId,
        request,
      ),

    onSuccess: async (_data, variables) => {
      await invalidateBoardings(variables.boardingPublicId);
    },
  });

  return {
    createBoarding,
    openBoarding,
    boardProvider,
    boardPassenger,
    markPassengerNoShow,
    withdrawParticipant,
    removeParticipant,
    startJourney,
    cancelBoarding,
  };
}
