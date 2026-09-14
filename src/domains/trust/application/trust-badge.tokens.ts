// -----------------------------------------------------------------------------
// sisiMove — Trust Badge Application DI Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Trust Badge application layer.
//
// TrustBadge is responsible for the lifecycle and definition of reusable Trust
// badge types. A TrustProfile does not own badge definitions; it references
// badge definitions through the Trust domain's profile-badge relationship.
//
// Covers:
//
// - Trust Badge repository;
// - Trust Badge command handlers;
// - Trust Badge query handlers.
//
// Aggregate boundary:
//
// TrustBadgeAggregate
// └── TrustBadgeEntity
//
// IMPORTANT:
//
// Trust Badge owns:
//
// - badge identity;
// - public identity;
// - badge type;
// - badge name;
// - badge description;
// - optional Asset public-ID reference;
// - activation state;
// - badge-definition lifecycle.
//
// Trust Badge does NOT own:
//
// - physical Asset storage;
// - Asset delivery;
// - Trust Profile ownership;
// - badge awarding decisions;
// - profile-badge assignment lifecycle.
//
// Asset references remain opaque. Physical storage and public Asset delivery
// are owned by the Assets bounded context.
//
// The application layer coordinates use cases and delegates business rules to
// TrustBadgeAggregate and TrustBadgeEntity.
//
// Concrete infrastructure implementations are bound to these tokens by the
// dependency-injection composition layer.
//
// The application layer MUST NOT import concrete infrastructure implementations
// directly.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Trust Badge Tokens
// =============================================================================

export const TRUST_BADGE_TOKENS = {
  // ===========================================================================

  // Repository

  // ===========================================================================

  /**
   * Trust Badge aggregate repository.
   *
   * Infrastructure provides the concrete persistence implementation.
   */
  REPOSITORY: Symbol('TrustBadgeRepository'),

  // ===========================================================================

  // Command Handlers

  // ===========================================================================

  COMMAND_HANDLERS: {
    // =========================================================================
    // Lifecycle
    // =========================================================================

    /**
     * Creates a Trust Badge aggregate.
     *
     * This establishes a reusable badge definition.
     */
    CREATE: Symbol('CreateTrustBadgeHandler'),

    /**
     * Updates mutable Trust Badge definition data.
     */
    UPDATE: Symbol('UpdateTrustBadgeHandler'),

    // =========================================================================
    // Definition
    // =========================================================================

    /**
     * Changes the stable business type of a Trust Badge.
     */
    CHANGE_TYPE: Symbol('ChangeTrustBadgeTypeHandler'),

    /**
     * Changes the public display name of a Trust Badge.
     */
    CHANGE_NAME: Symbol('ChangeTrustBadgeNameHandler'),

    /**
     * Changes the optional public description of a Trust Badge.
     */
    CHANGE_DESCRIPTION: Symbol('ChangeTrustBadgeDescriptionHandler'),

    // =========================================================================
    // Asset
    // =========================================================================

    /**
     * Assigns or changes the opaque public identifier of the Asset associated
     * with a Trust Badge definition.
     *
     * Trust Badge stores only the Asset public-ID reference.
     *
     * It does not:
     *
     * - upload physical content;
     * - validate storage metadata;
     * - generate delivery URLs;
     * - access filesystem or object storage;
     * - depend on a concrete Asset implementation.
     */
    SET_ASSET: Symbol('SetTrustBadgeAssetHandler'),

    // =========================================================================
    // Activation
    // =========================================================================

    /**
     * Activates a Trust Badge definition for use by the Trust domain.
     */
    ACTIVATE: Symbol('ActivateTrustBadgeHandler'),

    /**
     * Deactivates a Trust Badge definition.
     *
     * Deactivation does not necessarily remove historical profile-badge
     * assignments. Public projections must decide whether inactive definitions
     * should be omitted from current public badge output.
     */
    DEACTIVATE: Symbol('DeactivateTrustBadgeHandler'),
  } as const,

  // ===========================================================================

  // Query Handlers

  // ===========================================================================

  QUERY_HANDLERS: {
    // =========================================================================
    // Badge
    // =========================================================================

    /**
     * Retrieves a Trust Badge using the query's general criteria.
     */
    GET: Symbol('GetTrustBadgeQueryHandler'),

    /**
     * Retrieves one Trust Badge by its opaque public identifier.
     */
    GET_BY_PUBLIC_ID: Symbol('GetTrustBadgeByPublicIdQueryHandler'),

    /**
     * Retrieves Trust Badges by badge type.
     */
    GET_BY_TYPE: Symbol('GetTrustBadgeByTypeQueryHandler'),

    /**
     * Retrieves Trust Badges by badge name.
     */
    GET_BY_NAME: Symbol('GetTrustBadgeByNameQueryHandler'),

    // =========================================================================
    // Active Badges
    // =========================================================================

    /**
     * Retrieves active Trust Badge definitions.
     *
     * This is the appropriate catalogue query for selecting currently usable
     * badge definitions.
     */
    GET_ACTIVE: Symbol('GetActiveTrustBadgesQueryHandler'),

    // =========================================================================
    // Asset
    // =========================================================================

    /**
     * Retrieves Trust Badge definitions referencing an Asset public ID.
     *
     * This query returns Trust Badge definitions only. It does not retrieve
     * physical Asset content or resolve public Asset URLs.
     */
    GET_BY_ASSET: Symbol('GetTrustBadgesByAssetQueryHandler'),
  } as const,
} as const;

// =============================================================================
// Default Export
// =============================================================================

export default TRUST_BADGE_TOKENS;
