// src/domains/trust/application/trust-profile.tokens.ts

export const TRUST_PROFILE_TOKENS = {
  REPOSITORY: Symbol('TrustProfileRepository'),

  COMMAND_HANDLERS: {
    // -------------------------------------------------------------------------
    // Lifecycle
    // -------------------------------------------------------------------------

    CREATE: Symbol('CreateTrustProfileHandler'),

    CHANGE_STATUS: Symbol('ChangeTrustProfileStatusHandler'),
    RESTRICT: Symbol('RestrictTrustProfileHandler'),
    SUSPEND: Symbol('SuspendTrustProfileHandler'),
    RESTORE: Symbol('RestoreTrustProfileHandler'),

    // -------------------------------------------------------------------------
    // Verification
    // -------------------------------------------------------------------------

    GRANT_VERIFICATION: Symbol('GrantTrustVerificationHandler'),
    REVOKE_VERIFICATION: Symbol('RevokeTrustVerificationHandler'),

    // -------------------------------------------------------------------------
    // Journey
    // -------------------------------------------------------------------------

    APPLY_JOURNEY_COMPLETED: Symbol('ApplyJourneyCompletedHandler'),
    APPLY_JOURNEY_CANCELLED: Symbol('ApplyJourneyCancelledHandler'),

    // -------------------------------------------------------------------------
    // Rating
    // -------------------------------------------------------------------------

    RECEIVE_RATING: Symbol('ReceiveTrustRatingHandler'),
    CHANGE_RATING_SCORE: Symbol('ChangeTrustRatingScoreHandler'),
    HIDE_RATING: Symbol('HideTrustRatingHandler'),
    REMOVE_RATING: Symbol('RemoveTrustRatingHandler'),
    RESTORE_RATING: Symbol('RestoreTrustRatingHandler'),

    // -------------------------------------------------------------------------
    // Review
    // -------------------------------------------------------------------------

    CREATE_REVIEW: Symbol('CreateTrustReviewHandler'),
    UPDATE_REVIEW: Symbol('UpdateTrustReviewHandler'),
    REMOVE_REVIEW: Symbol('RemoveTrustReviewHandler'),

    // -------------------------------------------------------------------------
    // Badge
    // -------------------------------------------------------------------------

    AWARD_BADGE: Symbol('AwardTrustBadgeHandler'),
    REVOKE_BADGE: Symbol('RevokeTrustBadgeHandler'),

    // -------------------------------------------------------------------------
    // Dispute
    // -------------------------------------------------------------------------

    APPLY_DISPUTE_OPENED: Symbol('ApplyTrustDisputeOpenedHandler'),
    APPLY_DISPUTE_RESOLVED: Symbol('ApplyTrustDisputeResolvedHandler'),

    // -------------------------------------------------------------------------
    // Manual adjustment
    // -------------------------------------------------------------------------

    APPLY_MANUAL_ADJUSTMENT: Symbol('ApplyTrustManualAdjustmentHandler'),
  },

  QUERY_HANDLERS: {
    // -------------------------------------------------------------------------
    // Profile
    // -------------------------------------------------------------------------

    GET: Symbol('GetTrustProfileQueryHandler'),
    GET_BY_MEMBER_PUBLIC_ID: Symbol(
      'GetTrustProfileByMemberPublicIdQueryHandler',
    ),

    // -------------------------------------------------------------------------
    // Ratings
    // -------------------------------------------------------------------------

    GET_RATINGS: Symbol('GetTrustProfileRatingsQueryHandler'),
    GET_RATING: Symbol('GetTrustProfileRatingQueryHandler'),

    // -------------------------------------------------------------------------
    // Reviews
    // -------------------------------------------------------------------------

    GET_REVIEWS: Symbol('GetTrustProfileReviewsQueryHandler'),
    GET_REVIEW: Symbol('GetTrustProfileReviewQueryHandler'),

    // -------------------------------------------------------------------------
    // Badges
    // -------------------------------------------------------------------------

    GET_BADGES: Symbol('GetTrustProfileBadgesQueryHandler'),
    GET_BADGE: Symbol('GetTrustProfileBadgeQueryHandler'),

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    GET_EVENTS: Symbol('GetTrustProfileEventsQueryHandler'),
  },
} as const;
