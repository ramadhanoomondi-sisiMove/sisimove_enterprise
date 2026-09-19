// -----------------------------------------------------------------------------
// sisiMove — Authenticate Login API
// -----------------------------------------------------------------------------
//
// Feature API boundary for:
//
//     POST /authentications/login
//
// The backend login contract intentionally separates:
//
// 1. User credentials
//      - emailOrPhoneNumber
//      - password
//
// 2. Technical device metadata
//      - x-device-type
//      - x-device-fingerprint
//
// The credentials are represented by AuthenticateLoginRequest.
//
// The required device metadata is supplied here at the HTTP boundary because
// it is technical transport information, not part of the user-facing login
// form model.
//
// Backend contract:
//
//     POST /api/v1/authentications/login
//
// Body:
//
//     {
//       "emailOrPhoneNumber": "...",
//       "password": "..."
//     }
//
// Required headers:
//
//     x-device-type
//     x-device-fingerprint
//
// Successful response:
//
//     {
//       "success": true,
//       "identityPublicId": "...",
//       "authenticationPublicId": "...",
//       "devicePublicId": "...",
//       "sessionPublicId": "...",
//       "accessToken": "...",
//       "refreshToken": "..."
//     }
//
// This module does NOT:
//
// - persist the authentication session;
// - update authentication state;
// - navigate the user;
// - validate the form;
// - refresh tokens;
// - decode JWTs;
// - perform authentication orchestration.
//
// Those responsibilities belong to their respective feature boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation — HTTP
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

// -----------------------------------------------------------------------------
// Authentication — Constants
// -----------------------------------------------------------------------------

import {
  AUTHENTICATION_API_PATHS,
  AUTHENTICATION_HEADERS,
  DEFAULT_AUTHENTICATION_DEVICE_TYPE,
} from '../../constants';

// -----------------------------------------------------------------------------
// Authentication — Device
// -----------------------------------------------------------------------------

import { getDeviceFingerprint } from '../../device';

// -----------------------------------------------------------------------------
// Authentication — Models
// -----------------------------------------------------------------------------

import type {
  AuthenticateLoginRequest,
  AuthenticateLoginResponse,
} from '../models';

// =============================================================================
// Authenticate Login
// =============================================================================

/**
 * Authenticates a sisiMove user using their email address or phone number.
 *
 * The request body contains only user credentials.
 *
 * The API boundary adds the required technical device headers expected by
 * the backend Authentication controller:
 *
 * - x-device-type
 * - x-device-fingerprint
 *
 * The browser fingerprint is generated/retrieved by the authentication
 * device boundary rather than by the login form.
 *
 * @param request User-provided login credentials.
 * @returns Successful authentication result containing the created/resolved
 *          device and session identifiers plus access/refresh tokens.
 */
export async function authenticateLogin(
  request: AuthenticateLoginRequest,
): Promise<AuthenticateLoginResponse> {
  return apiClient.post<AuthenticateLoginResponse>(
    AUTHENTICATION_API_PATHS.LOGIN,
    request,
    {
      headers: {
        [AUTHENTICATION_HEADERS.DEVICE_TYPE]:
          DEFAULT_AUTHENTICATION_DEVICE_TYPE,

        [AUTHENTICATION_HEADERS.DEVICE_FINGERPRINT]:
          getDeviceFingerprint(),
      },
    },
  );
}

