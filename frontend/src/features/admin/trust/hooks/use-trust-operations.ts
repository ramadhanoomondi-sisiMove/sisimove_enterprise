/**
 * sisiMove — Trust Operations Hook
 *
 * Groups existing Trust mutation hooks for convenient UI consumption.
 * Business rules and authorization remain on the backend.
 */

import {
  useApplyTrustDisputeOpened,
  useApplyTrustDisputeResolved,
  useApplyTrustJourneyCancelled,
  useApplyTrustJourneyCompleted,
  useApplyTrustManualAdjustment,
  useAwardTrustBadge,
  useChangeTrustProfileStatus,
  useChangeTrustRatingScore,
  useCreateTrustProfile,
  useCreateTrustReview,
  useGrantTrustVerification,
  useHideTrustRating,
  useReceiveTrustRating,
  useRemoveTrustRating,
  useRemoveTrustReview,
  useRestoreTrustRating,
  useRevokeTrustBadge,
  useRevokeTrustVerification,
  useUpdateTrustReview,
} from '../queries';

export function useTrustOperations() {
  return {
    createProfile: useCreateTrustProfile(),
    changeProfileStatus: useChangeTrustProfileStatus(),

    grantVerification: useGrantTrustVerification(),
    revokeVerification: useRevokeTrustVerification(),

    receiveRating: useReceiveTrustRating(),
    changeRatingScore: useChangeTrustRatingScore(),
    hideRating: useHideTrustRating(),
    removeRating: useRemoveTrustRating(),
    restoreRating: useRestoreTrustRating(),

    createReview: useCreateTrustReview(),
    updateReview: useUpdateTrustReview(),
    removeReview: useRemoveTrustReview(),

    awardBadge: useAwardTrustBadge(),
    revokeBadge: useRevokeTrustBadge(),

    applyJourneyCompleted: useApplyTrustJourneyCompleted(),
    applyJourneyCancelled: useApplyTrustJourneyCancelled(),

    applyDisputeOpened: useApplyTrustDisputeOpened(),
    applyDisputeResolved: useApplyTrustDisputeResolved(),

    applyManualAdjustment: useApplyTrustManualAdjustment(),
  };
}
