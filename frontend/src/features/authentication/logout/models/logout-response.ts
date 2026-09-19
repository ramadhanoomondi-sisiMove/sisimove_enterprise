// -----------------------------------------------------------------------------
// sisiMove — Logout Response
// -----------------------------------------------------------------------------
//
// Transport model returned by the authenticated logout endpoint.
//
// Backend contract:
//
//     POST /api/v1/sessions/logout
//
// Response:
//
//     {
//       success: true;
//     }
//
// This is intentionally a small transport model. Logout does not return a
// Session aggregate or authentication payload.
// -----------------------------------------------------------------------------

export interface LogoutResponse {
  readonly success: true;
}
