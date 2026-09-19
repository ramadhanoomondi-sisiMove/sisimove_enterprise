// -----------------------------------------------------------------------------
// sisiMove — Authentication Device Type
// -----------------------------------------------------------------------------
//
// Canonical device-type contract for the Authentication feature.
//
// This represents the type of client initiating authentication. It is NOT the
// backend Device entity and must not be confused with Device.publicId.
//
// Ownership:
//   Authentication → Device → Device Type
//
// Current supported authentication client:
//   WEB
//
// Backend login contract:
//
//   x-device-type: WEB
//
// The frontend intentionally defines its own string union instead of importing
// a backend or Prisma enum. This keeps the frontend independent of backend
// persistence implementation details.
//
// -----------------------------------------------------------------------------

/**
 * Authentication client types supported by the sisiMove frontend.
 *
 * This type describes the client/application surface initiating authentication,
 * not a persisted backend Device entity.
 *
 * Add additional client types here only when the authentication contract
 * explicitly supports them, for example a future native mobile application.
 */
export type AuthenticationDeviceType = 'WEB';

/**
 * Authentication device type used by the current sisiMove web application.
 *
 * This is the canonical runtime value used when constructing the backend
 * authentication request:
 *
 *   x-device-type: WEB
 */
export const AUTHENTICATION_DEVICE_TYPE: AuthenticationDeviceType = 'WEB';