// -----------------------------------------------------------------------------
// sisiMove — Register User Request
// -----------------------------------------------------------------------------
//
// Frontend request model for:
//
//   POST /api/v1/authentications/register
//
// This model represents the HTTP request body sent to the backend.
//
// Confirmed backend contract:
//
//   {
//     travellerName,
//     countryCode,
//     email,
//     phoneNumber,
//     password,
//     termsAccepted
//   }
//
// Important:
// - `confirmPassword` is intentionally NOT included.
// - `confirmPassword` is a presentation/form validation concern.
// - `handle` is intentionally NOT included.
// - The backend derives the traveller handle from `travellerName`.
// - No authentication/session information belongs in this request.
//
// -----------------------------------------------------------------------------

/**
 * Registration request sent to the sisiMove authentication API.
 */
export interface RegisterUserRequest {
  /**
   * Traveller's display name supplied during account registration.
   *
   * The backend uses this information when creating the TravellerProfile and
   * deriving the public traveller handle.
   */
  readonly travellerName: string;

  /**
   * ISO 3166-1 alpha-2 country code.
   *
   * The current sisiMove registration default is Kenya (`KE`).
   */
  readonly countryCode: string;

  /**
   * Email address used as an authentication identifier.
   */
  readonly email: string;

  /**
   * Phone number used as an authentication identifier.
   */
  readonly phoneNumber: string;

  /**
   * Password supplied for authentication.
   *
   * The password is sent only to the authentication API and is never stored
   * in frontend application state after registration.
   */
  readonly password: string;

  /**
   * Indicates acceptance of the sisiMove Terms and Privacy Policy.
   */
  readonly termsAccepted: boolean;
}

