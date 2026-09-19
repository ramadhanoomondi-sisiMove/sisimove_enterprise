// -----------------------------------------------------------------------------
// sisiMove — Authenticate Login Request
// -----------------------------------------------------------------------------
//
// Client-side HTTP request model for:
//
//     POST /api/v1/authentications/login
//
// The public login body contains only user credentials:
//
//     emailOrPhoneNumber
//     password
//
// Device and session metadata are deliberately excluded from this model.
// They are technical HTTP request metadata supplied by the authentication
// feature/API boundary through request headers.
//
// This model therefore does NOT contain:
//
// - device fingerprint;
// - device type;
// - device name;
// - device platform;
// - operating system;
// - browser;
// - IP address;
// - country;
// - city;
// - user agent;
// - correlation ID;
// - causation ID.
//
// Those values belong to the HTTP/application infrastructure boundary and
// should not become part of the login form contract.
//
// -----------------------------------------------------------------------------

/**
 * HTTP request body accepted by the login endpoint.
 *
 * This is intentionally a transport-facing model rather than a mirror of
 * AuthenticateLoginCommand.
 */
export interface AuthenticateLoginRequest {
  /**
   * Email address or phone number used to identify the account.
   */
  readonly emailOrPhoneNumber: string;

  /**
   * Plaintext password entered by the user.
   *
   * The password is transmitted to the HTTPS API and is never persisted by
   * this frontend model or session storage.
   */
  readonly password: string;
}

