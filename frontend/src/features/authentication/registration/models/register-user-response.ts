// -----------------------------------------------------------------------------
// sisiMove — Register User Response
// -----------------------------------------------------------------------------
//
// Frontend response model for:
//
//   POST /api/v1/authentications/register
//
// Confirmed backend response:
//
//   {
//     status: "REGISTERED",
//     identityPublicId,
//     travellerHandle,
//     next: "LOGIN"
//   }
//
// Registration does NOT authenticate the user.
//
// Therefore this response intentionally contains:
// - no access token
// - no refresh token
// - no sessionPublicId
// - no devicePublicId
// - no authenticationPublicId
//
// The client uses `next` to continue the registration journey to login.
//
// -----------------------------------------------------------------------------

/**
 * Registration response returned by the sisiMove authentication API.
 */
export interface RegisterUserResponse {
  /**
   * Registration lifecycle result.
   */
  readonly status: 'REGISTERED';

  /**
   * Public identifier of the newly created Identity.
   */
  readonly identityPublicId: string;

  /**
   * Public traveller handle created by the backend.
   *
   * This is authoritative. The frontend must not attempt to reproduce or
   * modify the backend's handle-generation result.
   */
  readonly travellerHandle: string;

  /**
   * Next authentication step after successful registration.
   *
   * Registration intentionally ends before authentication.
   */
  readonly next: 'LOGIN';
}

