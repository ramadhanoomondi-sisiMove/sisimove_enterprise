// -----------------------------------------------------------------------------
// sisiMove — Trust Profile Application DI Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Trust Profile application layer.
//
// TrustProfile is the aggregate responsible for the trust state and trust
// history associated with one member.
//
// Covers:
//
// - Trust Profile repository;
// - Trust Profile command handlers;
// - Trust Profile query handlers.
//
// Aggregate boundary:
//
// TrustProfileAggregate
// ├── TrustProfileEntity
// ├── TrustRatingEntity
// ├── TrustReviewEntity
// ├── TrustProfileBadgeEntity
// └── TrustEventEntity
//
// IMPORTANT:
//
// TrustProfile owns:
//
// - trust profile identity;
// - member public-ID reference;
// - trust profile lifecycle state;
// - verification state;
// - aggregate rating statistics;
// - journey-derived trust statistics;
// - ratings;
// - reviews;
// - profile-badge assignments;
// - trust events.
//
// TrustProfile does NOT own:
//
// - Identity account data;
// - Journey data;
// - Booking data;
// - physical Asset storage;
// - public Asset delivery;
// - Trust Badge definition catalogue.
//
// Cross-domain references remain opaque public identifiers.
//
// The application layer coordinates use cases and delegates business rules to
// TrustProfileAggregate and its entities.
//
// Concrete infrastructure implementations are bound to these tokens by the
// dependency-injection composition layer.
//
// The application layer MUST NOT import concrete infrastructure implementations
// directly.
//
// -----------------------------------------------------------------------------
//
// Public Trust projection:
//
// The public marketplace must not consume the broad operational
// TrustProfileResponse directly.
//
// Public Trust is exposed through a dedicated query handler:
//
//     GetPublicTrustProfileByMemberQueryHandler
//
// That handler returns a reduced public projection containing only information
// suitable for marketplace discovery, such as:
//
// - verification level;
// - aggregate rating;
// - rating count;
// - completed journeys;
// - active public badges.
//
// Public badge artwork is resolved through the Assets public-reference
// capability. TrustProfile stores only opaque Asset public-ID references.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Trust Profile Tokens
// =============================================================================

export const TRUST_PROFILE_TOKENS = {
  // ===========================================================================

  // Repository

  // ===========================================================================

  /**
   * Trust Profile aggregate repository.
   *
   * Infrastructure provides the concrete persistence implementation.
   */
  REPOSITORY: Symbol('TrustProfileRepository'),

  // ===========================================================================

  // Command Handlers

  // ===========================================================================

  COMMAND_HANDLERS: {
    // =========================================================================
    // Lifecycle
    // =========================================================================

    /**
     * Creates a Trust Profile aggregate for a member.
     */
    CREATE: Symbol('CreateTrustProfileHandler'),

    /**
     * Changes the general lifecycle status of a Trust Profile.
     */
    CHANGE_STATUS: Symbol('ChangeTrustProfileStatusHandler'),

    /**
     * Restricts a Trust Profile according to Trust domain rules.
     */
    RESTRICT: Symbol('RestrictTrustProfileHandler'),

    /**
     * Suspends a Trust Profile according to Trust domain rules.
     */
    SUSPEND: Symbol('SuspendTrustProfileHandler'),

    /**
     * Restores a restricted or suspended Trust Profile when permitted.
     */
    RESTORE: Symbol('RestoreTrustProfileHandler'),

    // =========================================================================
    // Verification
    // =========================================================================

    /**
     * Grants a Trust verification level or verification state.
     */
    GRANT_VERIFICATION: Symbol('GrantTrustVerificationHandler'),

    /**
     * Revokes previously granted Trust verification.
     */
    REVOKE_VERIFICATION: Symbol('RevokeTrustVerificationHandler'),

    // =========================================================================
    // Journey
    // =========================================================================

    /**
     * Applies the Trust consequences of a completed Journey.
     *
     * Journey remains owned by the Journey bounded context.
     */
    APPLY_JOURNEY_COMPLETED: Symbol('ApplyJourneyCompletedHandler'),

    /**
     * Applies the Trust consequences of a cancelled Journey.
     *
     * Journey remains owned by the Journey bounded context.
     */
    APPLY_JOURNEY_CANCELLED: Symbol('ApplyJourneyCancelledHandler'),

    // =========================================================================
    // Rating
    // =========================================================================

    /**
     * Records a rating received by the Trust Profile.
     */
    RECEIVE_RATING: Symbol('ReceiveTrustRatingHandler'),

    /**
     * Changes the score of an existing Trust rating where permitted.
     */
    CHANGE_RATING_SCORE: Symbol('ChangeTrustRatingScoreHandler'),

    /**
     * Hides a Trust rating from the applicable public representation.
     */
    HIDE_RATING: Symbol('HideTrustRatingHandler'),

    /**
     * Removes a Trust rating according to Trust domain rules.
     */
    REMOVE_RATING: Symbol('RemoveTrustRatingHandler'),

    /**
     * Restores a previously hidden or removed Trust rating where permitted.
     */
    RESTORE_RATING: Symbol('RestoreTrustRatingHandler'),

    // =========================================================================
    // Review
    // =========================================================================

    /**
     * Creates a review associated with a Trust rating.
     */
    CREATE_REVIEW: Symbol('CreateTrustReviewHandler'),

    /**
     * Updates an existing Trust review where permitted.
     */
    UPDATE_REVIEW: Symbol('UpdateTrustReviewHandler'),

    /**
     * Removes an existing Trust review according to Trust domain rules.
     */
    REMOVE_REVIEW: Symbol('RemoveTrustReviewHandler'),

    // =========================================================================
    // Badge
    // =========================================================================

    /**
     * Awards a Trust Badge definition to this Trust Profile.
     *
     * The badge definition is owned by the Trust Badge aggregate.
     */
    AWARD_BADGE: Symbol('AwardTrustBadgeHandler'),

    /**
     * Revokes a previously awarded Trust Badge from this Trust Profile.
     */
    REVOKE_BADGE: Symbol('RevokeTrustBadgeHandler'),

    // =========================================================================
    // Dispute
    // =========================================================================

    /**
     * Applies the Trust consequences of an opened dispute.
     */
    APPLY_DISPUTE_OPENED: Symbol('ApplyTrustDisputeOpenedHandler'),

    /**
     * Applies the Trust consequences of a resolved dispute.
     */
    APPLY_DISPUTE_RESOLVED: Symbol('ApplyTrustDisputeResolvedHandler'),

    // =========================================================================
    // Manual Adjustment
    // =========================================================================

    /**
     * Applies an authorized manual Trust adjustment.
     *
     * This is an operational/admin capability and must remain protected by
     * the appropriate authorization policy.
     */
    APPLY_MANUAL_ADJUSTMENT: Symbol('ApplyTrustManualAdjustmentHandler'),
  } as const,

  // ===========================================================================

  // Query Handlers

  // ===========================================================================

  QUERY_HANDLERS: {
    // =========================================================================
    // Profile
    // =========================================================================

    /**
     * Retrieves a Trust Profile using the query's general criteria.
     */
    GET: Symbol('GetTrustProfileQueryHandler'),

    /**
     * Retrieves a Trust Profile by the member's opaque public identifier.
     */
    GET_BY_MEMBER_PUBLIC_ID: Symbol(
      'GetTrustProfileByMemberPublicIdQueryHandler',
    ),

    /**
     * Retrieves the reduced public Trust projection by member public ID.
     *
     * This is the public marketplace read path.
     *
     * It must not return the broad operational TrustProfileResponse.
     */
    GET_PUBLIC_BY_MEMBER_PUBLIC_ID: Symbol(
      'GetPublicTrustProfileByMemberPublicIdQueryHandler',
    ),

    // =========================================================================
    // Ratings
    // =========================================================================

    /**
     * Retrieves ratings belonging to a Trust Profile.
     */
    GET_RATINGS: Symbol('GetTrustProfileRatingsQueryHandler'),

    /**
     * Retrieves one rating belonging to a Trust Profile.
     */
    GET_RATING: Symbol('GetTrustProfileRatingQueryHandler'),

    // =========================================================================
    // Reviews
    // =========================================================================

    /**
     * Retrieves reviews belonging to a Trust Profile.
     */
    GET_REVIEWS: Symbol('GetTrustProfileReviewsQueryHandler'),

    /**
     * Retrieves one review belonging to a Trust Profile.
     */
    GET_REVIEW: Symbol('GetTrustProfileReviewQueryHandler'),

    // =========================================================================
    // Badges
    // =========================================================================

    /**
     * Retrieves badge assignments belonging to a Trust Profile.
     *
     * This is the broad operational read path.
     */
    GET_BADGES: Symbol('GetTrustProfileBadgesQueryHandler'),

    /**
     * Retrieves one badge assignment belonging to a Trust Profile.
     */
    GET_BADGE: Symbol('GetTrustProfileBadgeQueryHandler'),

    // =========================================================================
    // Events
    // =========================================================================

    /**
     * Retrieves Trust events belonging to a Trust Profile.
     *
     * This is an operational read path and must not be exposed through the
     * public marketplace projection.
     */
    GET_EVENTS: Symbol('GetTrustProfileEventsQueryHandler'),
  } as const,
} as const;

// =============================================================================
// Default Export
// =============================================================================

export default TRUST_PROFILE_TOKENS;
