// -----------------------------------------------------------------------------
// sisiMove — Authentication HTTP Barrel
// -----------------------------------------------------------------------------
//
// Public HTTP boundary for authentication-aware API requests.
//
// -----------------------------------------------------------------------------

export {
  AuthenticatedApiClient,
  AuthenticationRequiredError,
  authenticatedApiClient,
} from './authenticated-api-client';