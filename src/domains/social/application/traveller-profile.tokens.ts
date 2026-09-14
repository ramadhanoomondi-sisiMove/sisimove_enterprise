// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Application Tokens
// -----------------------------------------------------------------------------
//
// Dependency-injection tokens for Traveller Profile command and query handlers.
//
// Tokens are intentionally grouped by application responsibility:
//
// - REPOSITORY
// - COMMAND_HANDLERS
// - QUERY_HANDLERS
//
// Public query handlers are kept distinct from broad Traveller Profile queries.
// This allows anonymous/public consumers to use reduced visibility-safe read
// boundaries without exposing the broader Traveller Profile representation.
//
// -----------------------------------------------------------------------------

export const TRAVELLER_PROFILE_TOKENS = {
  REPOSITORY: Symbol('TravellerProfileRepository'),

  // ---------------------------------------------------------------------------
  // Command Handlers
  // ---------------------------------------------------------------------------

  COMMAND_HANDLERS: {
    CREATE: Symbol('CreateTravellerProfileHandler'),
    CHANGE_HANDLE: Symbol('ChangeTravellerProfileHandleHandler'),
    CHANGE_BIO: Symbol('ChangeTravellerProfileBioHandler'),
    CHANGE_AVATAR: Symbol('ChangeTravellerProfileAvatarHandler'),
    CHANGE_COUNTRY: Symbol('ChangeTravellerProfileCountryHandler'),
    CHANGE_STATUS: Symbol('ChangeTravellerProfileStatusHandler'),
    CHANGE_VISIBILITY: Symbol('ChangeTravellerProfileVisibilityHandler'),

    CREATE_PREFERENCES: Symbol('CreateTravellerProfilePreferencesHandler'),
    CHANGE_PREFERENCES: Symbol('ChangeTravellerProfilePreferencesHandler'),
    REMOVE_PREFERENCES: Symbol('RemoveTravellerProfilePreferencesHandler'),

    ADD_CORRIDOR: Symbol('AddTravellerProfileCorridorHandler'),
    UPDATE_CORRIDOR: Symbol('UpdateTravellerProfileCorridorHandler'),
    REMOVE_CORRIDOR: Symbol('RemoveTravellerProfileCorridorHandler'),
    SET_PRIMARY_CORRIDOR: Symbol('SetPrimaryTravellerProfileCorridorHandler'),
    CLEAR_PRIMARY_CORRIDOR: Symbol(
      'ClearPrimaryTravellerProfileCorridorHandler',
    ),
  },

  // ---------------------------------------------------------------------------
  // Query Handlers
  // ---------------------------------------------------------------------------

  QUERY_HANDLERS: {
    GET: Symbol('GetTravellerProfileQueryHandler'),

    GET_BY_PUBLIC_ID: Symbol('GetTravellerProfileByPublicIdQueryHandler'),

    GET_BY_MEMBER_PUBLIC_ID: Symbol(
      'GetTravellerProfileByMemberPublicIdQueryHandler',
    ),

    // -------------------------------------------------------------------------
    // Public Traveller Profile
    // -------------------------------------------------------------------------
    //
    // Public queries intentionally have their own handlers rather than reusing
    // broad Traveller Profile queries. The public handlers enforce the public
    // visibility boundary before returning the reduced public representation.
    //

    GET_PUBLIC_BY_MEMBER_PUBLIC_ID: Symbol(
      'GetPublicTravellerByMemberQueryHandler',
    ),

    GET_PUBLIC_BY_HANDLE: Symbol('GetPublicTravellerByHandleQueryHandler'),

    // -------------------------------------------------------------------------
    // Broad Traveller Profile Queries
    // -------------------------------------------------------------------------

    GET_BY_HANDLE: Symbol('GetTravellerProfileByHandleQueryHandler'),

    GET_PREFERENCES: Symbol('GetTravellerProfilePreferencesQueryHandler'),

    GET_CORRIDOR: Symbol('GetTravellerProfileCorridorQueryHandler'),

    GET_CORRIDORS: Symbol('GetTravellerProfileCorridorsQueryHandler'),

    GET_PRIMARY_CORRIDOR: Symbol(
      'GetTravellerProfilePrimaryCorridorQueryHandler',
    ),
  },
} as const;
