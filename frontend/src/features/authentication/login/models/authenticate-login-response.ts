// -----------------------------------------------------------------------------
// sisiMove — Authenticate Login Response
// -----------------------------------------------------------------------------
//
// Client-side HTTP response model for:
//
//     POST /api/v1/authentications/login
//
// Successful login returns:
//
//     {
//       success: true,
//       identityPublicId,
//       authenticationPublicId,
//       devicePublicId,
//       sessionPublicId,
//       accessToken,
//       refreshToken
//     }
//
// The response represents the completed authentication workflow.
//
// The frontend does not reconstruct this result from Identity, Authentication,
// Device, or Session resources. The backend login operation is authoritative.
//
// -----------------------------------------------------------------------------

/**
 * Successful login response returned by the authentication API.
 *
 * `devicePublicId` is the backend Device entity identifier associated with
 * this authenticated client device.
 *
 * It is intentionally different from the browser-generated device
 * fingerprint sent as `x-device-fingerprint`.
 */
export interface AuthenticateLoginResponse {
  /**
   * Indicates that the login operation succeeded.
   */
  readonly success: true;

  /**
   * Public identifier of the authenticated Identity.
   */
  readonly identityPublicId: string;

  /**
   * Public identifier of the Authentication record.
   */
  readonly authenticationPublicId: string;

  /**
   * Public identifier of the Device resolved or created during login.
   */
  readonly devicePublicId: string;

  /**
   * Public identifier of the authenticated Session.
   */
  readonly sessionPublicId: string;

  /**
   * Access token used for authenticated API requests.
   */
  readonly accessToken: string;

  /**
   * Refresh token returned by the current login contract.
   *
   * The frontend model represents the HTTP response only. Persistence and
   * refresh-token security policy belong to the authentication session
   * boundary.
   */
  readonly refreshToken: string;
}

