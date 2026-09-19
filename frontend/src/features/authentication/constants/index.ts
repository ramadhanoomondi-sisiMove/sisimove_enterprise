// -----------------------------------------------------------------------------
// sisiMove — Authentication Constants Barrel
// -----------------------------------------------------------------------------
//
// Public barrel for authentication constants.
//
// Responsibilities:
// - Re-export authentication constants from the feature constants module.
// - Re-export only type helpers actually owned by that module.
//
// Non-responsibilities:
// - No authentication state.
// - No session storage.
// - No API implementation.
// - No device-domain type ownership.
//
// -----------------------------------------------------------------------------

export {
  AUTHENTICATION_API_PATHS,
  AUTHENTICATION_HEADERS,
  AUTHENTICATION_DEVICE_TYPES,
  DEFAULT_AUTHENTICATION_DEVICE_TYPE,
  REGISTER_USER_STATUS,
  REGISTER_USER_NEXT,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_STORAGE_KEYS,
  AUTHENTICATION_ROUTES,
  AUTHENTICATION_FIELDS,
} from './authentication.constants';

export type {
  RegisterUserStatus,
  RegisterUserNext,
  AuthenticationRoute,
} from './authentication.constants';