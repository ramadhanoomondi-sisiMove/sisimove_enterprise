// -----------------------------------------------------------------------------
// sisiMove — Trust Badge Application DI Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Trust Badge application layer.
//
// TrustBadge owns reusable badge definitions. TrustProfile owns the lifecycle
// of profile-badge assignments.
//
// -----------------------------------------------------------------------------

export const TRUST_BADGE_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('TrustBadgeRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    // Lifecycle
    CREATE: Symbol('CreateTrustBadgeHandler'),
    UPDATE: Symbol('UpdateTrustBadgeHandler'),

    // Definition
    CHANGE_TYPE: Symbol('ChangeTrustBadgeTypeHandler'),
    CHANGE_NAME: Symbol('ChangeTrustBadgeNameHandler'),
    CHANGE_DESCRIPTION: Symbol('ChangeTrustBadgeDescriptionHandler'),

    // Asset reference
    SET_ASSET: Symbol('SetTrustBadgeAssetHandler'),

    // Activation
    ACTIVATE: Symbol('ActivateTrustBadgeHandler'),
    DEACTIVATE: Symbol('DeactivateTrustBadgeHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // Single badge
    GET: Symbol('GetTrustBadgeQueryHandler'),
    GET_BY_PUBLIC_ID: Symbol('GetTrustBadgeByPublicIdQueryHandler'),

    // Badge lookups
    GET_BY_TYPE: Symbol('GetTrustBadgeByTypeQueryHandler'),
    GET_BY_NAME: Symbol('GetTrustBadgeByNameQueryHandler'),

    // Badge collections
    GET_ALL: Symbol('GetTrustBadgesQueryHandler'),
    GET_ACTIVE: Symbol('GetActiveTrustBadgesQueryHandler'),

    // Asset reference
    GET_BY_ASSET: Symbol('GetTrustBadgesByAssetQueryHandler'),
  } as const,
} as const;

// =============================================================================
// Default Export
// =============================================================================

export default TRUST_BADGE_TOKENS;
