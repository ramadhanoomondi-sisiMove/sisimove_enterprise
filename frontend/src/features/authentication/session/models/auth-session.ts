// -----------------------------------------------------------------------------
// sisiMove — Authentication Session Model
// -----------------------------------------------------------------------------
//
// Frontend representation of a successfully authenticated sisiMove session.
//
// This is a client-side transport/session model. It is intentionally NOT a
// mirror of the backend Prisma Session model.
//
// The backend Session contains server-side lifecycle and security information
// such as:
//   - refreshTokenHash
//   - tokenFamilyPublicId
//   - IP address
//   - user agent
//   - expiry timestamps
//   - revocation state
//
// None of those server-side persistence details belong in AuthSession.
//
// The frontend only receives and retains the authentication values required
// to maintain the authenticated application session.
//
// Confirmed backend login response:
//
//   {
//     success: true,
//     identityPublicId,
//     authenticationPublicId,
//     devicePublicId,
//     sessionPublicId,
//     accessToken,
//     refreshToken
//   }
//
// -----------------------------------------------------------------------------

/**
 * Authenticated sisiMove session available to the browser application.
 *
 * Identity, authentication, device, and session identifiers are opaque public
 * identifiers returned by the backend. The frontend must not infer internal
 * database IDs from them.
 *
 * `accessToken` is used for authenticated API requests.
 *
 * `refreshToken` is retained for the authentication/session lifecycle and must
 * not be exposed through presentation components.
 *
 * `devicePublicId` identifies the backend Device associated with this login.
 * It is intentionally different from the client-side device fingerprint sent
 * during login.
 */
export interface AuthSession {
  /**
   * Public identifier of the authenticated Identity.
   */
  readonly identityPublicId: string;

  /**
   * Public identifier of the Authentication record.
   */
  readonly authenticationPublicId: string;

  /**
   * Public identifier of the backend Device associated with this session.
   */
  readonly devicePublicId: string;

  /**
   * Public identifier of the authenticated backend Session.
   */
  readonly sessionPublicId: string;

  /**
   * Access token used to authenticate protected API requests.
   */
  readonly accessToken: string;

  /**
   * Refresh token returned by the authentication backend.
   *
   * The raw refresh token is returned to the client but only its hash is
   * persisted by the backend.
   */
  readonly refreshToken: string;
}

