/**
 * sisiMove — Trust Mutations
 *
 * React Query mutation hooks for Trust profile operations and
 * Trust badge administration.
 *
 * Backend lifecycle rules and authorization remain on the server.
 */

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  trustBadgesApi,
  trustOperationsApi,
} from '../api';

import { trustKeys } from './trust.keys';

// -----------------------------------------------------------------------------
// Shared mutation helper
// -----------------------------------------------------------------------------

type AsyncFunction = (...args: never[]) => Promise<unknown>;

type TrustInvalidationScope = 'profiles' | 'badges' | 'all';

function useTrustMutation<T extends AsyncFunction>(
  mutationFn: T,
  invalidate: TrustInvalidationScope = 'profiles',
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: Parameters<T>) =>
      mutationFn(...args),

    onSuccess: async () => {
      if (
        invalidate === 'profiles' ||
        invalidate === 'all'
      ) {
        await queryClient.invalidateQueries({
          queryKey: trustKeys.profiles(),
        });
      }

      if (
        invalidate === 'badges' ||
        invalidate === 'all'
      ) {
        await queryClient.invalidateQueries({
          queryKey: trustKeys.badges(),
        });
      }
    },
  });
}

// -----------------------------------------------------------------------------
// Trust profile lifecycle
// -----------------------------------------------------------------------------

export function useCreateTrustProfile() {
  return useTrustMutation(trustOperationsApi.createProfile);
}

export function useChangeTrustProfileStatus() {
  return useTrustMutation(
    trustOperationsApi.changeProfileStatus,
  );
}

export function useGrantTrustVerification() {
  return useTrustMutation(
    trustOperationsApi.grantVerification,
  );
}

export function useRevokeTrustVerification() {
  return useTrustMutation(
    trustOperationsApi.revokeVerification,
  );
}

// -----------------------------------------------------------------------------
// Ratings
// -----------------------------------------------------------------------------

export function useReceiveTrustRating() {
  return useTrustMutation(
    trustOperationsApi.receiveRating,
  );
}

export function useChangeTrustRatingScore() {
  return useTrustMutation(
    trustOperationsApi.changeRatingScore,
  );
}

export function useHideTrustRating() {
  return useTrustMutation(
    trustOperationsApi.hideRating,
  );
}

export function useRemoveTrustRating() {
  return useTrustMutation(
    trustOperationsApi.removeRating,
  );
}

export function useRestoreTrustRating() {
  return useTrustMutation(
    trustOperationsApi.restoreRating,
  );
}

// -----------------------------------------------------------------------------
// Reviews
// -----------------------------------------------------------------------------

export function useCreateTrustReview() {
  return useTrustMutation(
    trustOperationsApi.createReview,
  );
}

export function useUpdateTrustReview() {
  return useTrustMutation(
    trustOperationsApi.updateReview,
  );
}

export function useRemoveTrustReview() {
  return useTrustMutation(
    trustOperationsApi.removeReview,
  );
}

// -----------------------------------------------------------------------------
// Profile badges
// -----------------------------------------------------------------------------

export function useAwardTrustBadge() {
  return useTrustMutation(
    trustOperationsApi.awardBadge,
  );
}

export function useRevokeTrustBadge() {
  return useTrustMutation(
    trustOperationsApi.revokeBadge,
  );
}

// -----------------------------------------------------------------------------
// Journey metrics
// -----------------------------------------------------------------------------

export function useApplyTrustJourneyCompleted() {
  return useTrustMutation(
    trustOperationsApi.applyJourneyCompleted,
  );
}

export function useApplyTrustJourneyCancelled() {
  return useTrustMutation(
    trustOperationsApi.applyJourneyCancelled,
  );
}

// -----------------------------------------------------------------------------
// Disputes and manual adjustments
// -----------------------------------------------------------------------------

export function useApplyTrustDisputeOpened() {
  return useTrustMutation(
    trustOperationsApi.applyDisputeOpened,
  );
}

export function useApplyTrustDisputeResolved() {
  return useTrustMutation(
    trustOperationsApi.applyDisputeResolved,
  );
}

export function useApplyTrustManualAdjustment() {
  return useTrustMutation(
    trustOperationsApi.applyManualAdjustment,
  );
}

// -----------------------------------------------------------------------------
// Trust badge administration
// -----------------------------------------------------------------------------

export function useCreateTrustBadge() {
  return useTrustMutation(
    trustBadgesApi.create,
    'all',
  );
}

export function useUpdateTrustBadge() {
  return useTrustMutation(
    trustBadgesApi.update,
    'all',
  );
}

export function useChangeTrustBadgeType() {
  return useTrustMutation(
    trustBadgesApi.changeType,
    'all',
  );
}

export function useChangeTrustBadgeName() {
  return useTrustMutation(
    trustBadgesApi.changeName,
    'all',
  );
}

export function useChangeTrustBadgeDescription() {
  return useTrustMutation(
    trustBadgesApi.changeDescription,
    'all',
  );
}

export function useSetTrustBadgeAsset() {
  return useTrustMutation(
    trustBadgesApi.setAsset,
    'all',
  );
}

export function useActivateTrustBadge() {
  return useTrustMutation(
    trustBadgesApi.activate,
    'all',
  );
}

export function useDeactivateTrustBadge() {
  return useTrustMutation(
    trustBadgesApi.deactivate,
    'all',
  );
}