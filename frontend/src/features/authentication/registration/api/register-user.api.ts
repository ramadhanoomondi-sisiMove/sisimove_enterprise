// -----------------------------------------------------------------------------
// sisiMove — Register User API
// -----------------------------------------------------------------------------
//
// Feature API boundary for user registration.
//
// HTTP endpoint:
//
//     POST /api/v1/authentications/register
//
// Responsibilities:
// - send the registration request to the backend;
// - use the shared foundation ApiClient;
// - return the typed registration response.
//
// This module does NOT:
// - perform validation;
// - hash passwords;
// - create sessions;
// - authenticate the user;
// - store tokens;
// - manipulate authentication state;
// - derive the traveller handle;
// - construct backend commands;
// - know about Identity, Verification, Trust, or TravellerProfile internals.
//
// The backend is authoritative for registration behavior and for the
// travellerHandle returned after successful registration.
//
// -----------------------------------------------------------------------------
//
// Request contract:
//
// {
//   travellerName: string;
//   countryCode: string;
//   email: string;
//   phoneNumber: string;
//   password: string;
//   termsAccepted: boolean;
// }
//
// Response contract:
//
// {
//   status: 'REGISTERED';
//   identityPublicId: string;
//   travellerHandle: string;
//   next: 'LOGIN';
// }
//
// `confirmPassword` is intentionally absent because it is a frontend-only
// validation concern and is NOT part of the backend HTTP contract.
//
// `handle` is intentionally absent because the backend derives the traveller
// handle from travellerName and returns the authoritative value.
//
// Registration does not authenticate the user. The response explicitly tells
// the client that the next action is LOGIN.
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
} from '../../constants';

// -----------------------------------------------------------------------------
// Authentication — Registration Models
// -----------------------------------------------------------------------------

import type {
  RegisterUserRequest,
  RegisterUserResponse,
} from '../models';

// =============================================================================
// Register User API
// =============================================================================

/**
 * Registers a new sisiMove user account.
 *
 * The function is intentionally a thin feature-level adapter over the shared
 * ApiClient. It does not contain registration business logic.
 *
 * @param request - Exact registration HTTP request body.
 * @returns The backend registration result.
 *
 * @throws ApiError when the backend rejects the request or the request cannot
 * connect to the SisiMove service.
 */
export async function registerUser(
  request: RegisterUserRequest,
): Promise<RegisterUserResponse> {
  return apiClient.post<RegisterUserResponse>(
    AUTHENTICATION_API_PATHS.REGISTER,
    request,
  );
}

