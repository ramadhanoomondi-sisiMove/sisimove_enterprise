// src/domains/social/application/traveller-profile.tokens.ts

export const TRAVELLER_PROFILE_TOKENS = {
  REPOSITORY: Symbol('TravellerProfileRepository'),

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
    SET_PRIMARY_CORRIDOR: Symbol('SetTravellerProfilePrimaryCorridorHandler'),
    CLEAR_PRIMARY_CORRIDOR: Symbol(
      'ClearTravellerProfilePrimaryCorridorHandler',
    ),
  },

  QUERY_HANDLERS: {
    GET: Symbol('GetTravellerProfileQueryHandler'),
    GET_BY_PUBLIC_ID: Symbol('GetTravellerProfileByPublicIdQueryHandler'),
    GET_BY_MEMBER_PUBLIC_ID: Symbol(
      'GetTravellerProfileByMemberPublicIdQueryHandler',
    ),
    GET_BY_HANDLE: Symbol('GetTravellerProfileByHandleQueryHandler'),

    GET_PREFERENCES: Symbol('GetTravellerProfilePreferencesQueryHandler'),

    GET_CORRIDOR: Symbol('GetTravellerProfileCorridorQueryHandler'),
    GET_CORRIDORS: Symbol('GetTravellerProfileCorridorsQueryHandler'),
    GET_PRIMARY_CORRIDOR: Symbol(
      'GetTravellerProfilePrimaryCorridorQueryHandler',
    ),
  },
} as const;
