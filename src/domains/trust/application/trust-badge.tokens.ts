// src/domains/trust/application/trust-badge.tokens.ts

export const TRUST_BADGE_TOKENS = {
  REPOSITORY: Symbol('TrustBadgeRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    // -------------------------------------------------------------------------
    // Lifecycle
    // -------------------------------------------------------------------------

    CREATE: Symbol('CreateTrustBadgeHandler'),
    UPDATE: Symbol('UpdateTrustBadgeHandler'),

    // -------------------------------------------------------------------------
    // Definition
    // -------------------------------------------------------------------------

    CHANGE_TYPE: Symbol('ChangeTrustBadgeTypeHandler'),
    CHANGE_NAME: Symbol('ChangeTrustBadgeNameHandler'),
    CHANGE_DESCRIPTION: Symbol('ChangeTrustBadgeDescriptionHandler'),

    // -------------------------------------------------------------------------
    // Asset
    // -------------------------------------------------------------------------

    SET_ASSET: Symbol('SetTrustBadgeAssetHandler'),

    // -------------------------------------------------------------------------
    // Activation
    // -------------------------------------------------------------------------

    ACTIVATE: Symbol('ActivateTrustBadgeHandler'),
    DEACTIVATE: Symbol('DeactivateTrustBadgeHandler'),
  },

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // -------------------------------------------------------------------------
    // Badge
    // -------------------------------------------------------------------------

    GET: Symbol('GetTrustBadgeQueryHandler'),
    GET_BY_PUBLIC_ID: Symbol('GetTrustBadgeByPublicIdQueryHandler'),
    GET_BY_TYPE: Symbol('GetTrustBadgeByTypeQueryHandler'),
    GET_BY_NAME: Symbol('GetTrustBadgeByNameQueryHandler'),

    // -------------------------------------------------------------------------
    // Active Badges
    // -------------------------------------------------------------------------

    GET_ACTIVE: Symbol('GetActiveTrustBadgesQueryHandler'),

    // -------------------------------------------------------------------------
    // Asset
    // -------------------------------------------------------------------------

    GET_BY_ASSET: Symbol('GetTrustBadgesByAssetQueryHandler'),
  },
} as const;
