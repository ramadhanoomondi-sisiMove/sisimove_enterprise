// -----------------------------------------------------------------------------
// sisiMove — Authentication Constants
// -----------------------------------------------------------------------------
//
// Frontend constants shared across the authentication feature.
//
// Responsibilities:
// - Define stable authentication-related client constants.
// - Keep authentication API identifiers out of presentation components.
// - Keep authentication entry-route identifiers centralized.
// - Provide stable authentication form field identifiers.
//
// Non-responsibilities:
// - No authentication state.
// - No access-token or refresh-token storage.
// - No backend domain logic.
// - No user credentials.
// - No session mutation.
// - No authenticated application routes.
// - No marketplace capability or verification rules.
//
// Architectural boundary:
//
//     Authentication
//         ├── Registration
//         ├── Login
//         ├── Logout
//         ├── Session
//         └── Device
//
//     Authenticated Application
//         ├── /home
//         ├── /my-journeys
//         └── future authenticated surfaces
//
// Authenticated application routes deliberately do NOT belong in this file.
//
// Backend authentication contract:
//
// POST /api/v1/authentications/login
//
// Headers:
//   x-device-type
//   x-device-fingerprint
//
// Request body:
//   emailOrPhoneNumber
//   password
//
// Successful login response contains:
//   identityPublicId
//   authenticationPublicId
//   devicePublicId
//   sessionPublicId
//   accessToken
//   refreshToken
//
// Logout contract:
//
// POST /api/v1/sessions/logout
//
// Logout does not accept a sessionPublicId from the client.
// The backend derives the current session from the authenticated
// access-token principal.
//
// -----------------------------------------------------------------------------


/**
 * Authentication API paths.
 *
 * These paths are relative to the configured API base URL.
 *
 * Although logout is implemented by the backend Session boundary,
 * it is exposed here because logout is an authentication lifecycle
 * operation from the frontend application's perspective.
 */
export const AUTHENTICATION_API_PATHS = {
  REGISTER: '/authentications/register',
  LOGIN: '/authentications/login',
  LOGOUT: '/sessions/logout',
} as const;


/**
 * Authentication HTTP header names.
 *
 * Keep the exact backend contract here rather than repeating literal
 * header names throughout the login API adapter.
 */
export const AUTHENTICATION_HEADERS = {
  DEVICE_TYPE: 'x-device-type',
  DEVICE_FINGERPRINT: 'x-device-fingerprint',
} as const;


/**
 * Device types currently understood by the sisiMove authentication client.
 *
 * The current browser authentication flow uses WEB.
 *
 * The corresponding TypeScript type is owned by the Device boundary:
 *
 *     authentication/device/device-type.ts
 *
 * This constant remains here because it is part of the authentication
 * transport contract used by login.
 */
export const AUTHENTICATION_DEVICE_TYPES = {
  WEB: 'WEB',
} as const;


/**
 * Default device type for the sisiMove browser application.
 */
export const DEFAULT_AUTHENTICATION_DEVICE_TYPE =
  AUTHENTICATION_DEVICE_TYPES.WEB;


/**
 * Registration result status returned by the backend.
 *
 * Registration creates the account but does not authenticate the user.
 */
export const REGISTER_USER_STATUS = {
  REGISTERED: 'REGISTERED',
} as const;


/**
 * Registration next-step value returned by the backend.
 *
 * Registration explicitly continues to LOGIN.
 */
export const REGISTER_USER_NEXT = {
  LOGIN: 'LOGIN',
} as const;


/**
 * Successful login result indicator returned by the backend.
 */
export const AUTHENTICATION_SUCCESS = true;


/**
 * Storage key namespace used by the authentication feature.
 *
 * The concrete session-storage implementation owns how this key is used.
 * Components and API adapters must not access authentication storage directly.
 */
export const AUTHENTICATION_STORAGE_KEYS = {
  SESSION: 'sisimove.auth.session',
} as const;


/**
 * Authentication entry routes.
 *
 * These are application routes for entering the authentication flow.
 *
 * They intentionally do not contain authenticated application routes such as
 * /home or /my-journeys.
 */
export const AUTHENTICATION_ROUTES = {
  REGISTER: '/register',
  LOGIN: '/login',
} as const;


/**
 * Authentication form field names.
 *
 * These identifiers provide one stable source for field-level validation,
 * error mapping, and form integration.
 *
 * Registration:
 * - travellerName is the human-readable traveller name.
 * - travellerHandle is the unique public handle used by TravellerProfile.
 * - countryCode identifies the registration country context.
 * - email and phoneNumber are authentication contact credentials.
 * - password and confirmPassword belong to the HTTP/form boundary.
 * - termsAccepted is the registration consent field.
 *
 * Login:
 * - emailOrPhoneNumber accepts either supported login identifier.
 * - password is the authentication credential.
 */
export const AUTHENTICATION_FIELDS = {
  REGISTRATION: {
    TRAVELLER_NAME: 'travellerName',
    TRAVELLER_HANDLE: 'travellerHandle',
    COUNTRY_CODE: 'countryCode',
    EMAIL: 'email',
    PHONE_NUMBER: 'phoneNumber',
    PASSWORD: 'password',
    CONFIRM_PASSWORD: 'confirmPassword',
    TERMS_ACCEPTED: 'termsAccepted',
  },

  LOGIN: {
    EMAIL_OR_PHONE_NUMBER: 'emailOrPhoneNumber',
    PASSWORD: 'password',
  },
} as const;


/**
 * Type helpers derived from the immutable constants above.
 *
 * AuthenticationDeviceType is intentionally NOT defined here.
 * Its canonical owner is:
 *
 *     authentication/device/device-type.ts
 */
export type RegisterUserStatus =
  (typeof REGISTER_USER_STATUS)[keyof typeof REGISTER_USER_STATUS];

export type RegisterUserNext =
  (typeof REGISTER_USER_NEXT)[keyof typeof REGISTER_USER_NEXT];

export type AuthenticationRoute =
  (typeof AUTHENTICATION_ROUTES)[keyof typeof AUTHENTICATION_ROUTES];