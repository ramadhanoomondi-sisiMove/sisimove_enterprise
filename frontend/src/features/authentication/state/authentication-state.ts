// -----------------------------------------------------------------------------
// sisiMove — Authentication State
// -----------------------------------------------------------------------------
//
// Client-side authentication state.
//
// This state represents whether the browser currently has an authenticated
// sisiMove session. It deliberately does NOT mirror the backend Identity,
// Authentication, Session, Device, Verification, Role, TravellerProfile, or
// TrustProfile models.
//
// Domain boundaries:
//
//   AuthenticationState
//       └── AuthSession
//
// Other account information belongs to its own feature/domain boundary.
//
// Registration does not authenticate the user. A successful registration
// therefore never creates an authenticated state.
//
// -----------------------------------------------------------------------------

import type { AuthSession } from '../session';

/**
 * Lifecycle of the client-side authentication state.
 *
 * INITIALIZING
 *   The application is restoring the persisted session.
 *
 * AUTHENTICATED
 *   A persisted or newly authenticated session is available.
 *
 * UNAUTHENTICATED
 *   No authenticated session is available.
 *
 * ERROR
 *   The application could not initialize or persist authentication state.
 */
export type AuthenticationStatus =
  | 'INITIALIZING'
  | 'AUTHENTICATED'
  | 'UNAUTHENTICATED'
  | 'ERROR';

/**
 * Complete client-side authentication state.
 */
export interface AuthenticationState {
  readonly status: AuthenticationStatus;
  readonly session: AuthSession | null;
  readonly error: Error | null;
}

/**
 * Initial state used while the authentication provider restores the persisted
 * browser session.
 */
export const INITIAL_AUTHENTICATION_STATE: AuthenticationState = {
  status: 'INITIALIZING',
  session: null,
  error: null,
};

/**
 * Create an authenticated state from a backend-issued AuthSession.
 */
export function createAuthenticatedState(
  session: AuthSession,
): AuthenticationState {
  if (!session) {
    throw new Error('Authentication session is required.');
  }

  return {
    status: 'AUTHENTICATED',
    session,
    error: null,
  };
}

/**
 * Create an unauthenticated state.
 */
export function createUnauthenticatedState(): AuthenticationState {
  return {
    status: 'UNAUTHENTICATED',
    session: null,
    error: null,
  };
}

/**
 * Create an authentication error state.
 */
export function createAuthenticationErrorState(
  error: Error,
): AuthenticationState {
  if (!error) {
    throw new Error('Authentication error is required.');
  }

  return {
    status: 'ERROR',
    session: null,
    error,
  };
}

/**
 * Determine whether the state contains an authenticated session.
 */
export function isAuthenticated(
  state: AuthenticationState,
): state is AuthenticationState & {
  readonly status: 'AUTHENTICATED';
  readonly session: AuthSession;
} {
  return state.status === 'AUTHENTICATED' && state.session !== null;
}

/**
 * Determine whether the state is explicitly unauthenticated.
 */
export function isUnauthenticated(
  state: AuthenticationState,
): state is AuthenticationState & {
  readonly status: 'UNAUTHENTICATED';
  readonly session: null;
} {
  return state.status === 'UNAUTHENTICATED' && state.session === null;
}

/**
 * Determine whether authentication initialization/state management failed.
 */
export function hasAuthenticationError(
  state: AuthenticationState,
): state is AuthenticationState & {
  readonly status: 'ERROR';
  readonly session: null;
  readonly error: Error;
} {
  return state.status === 'ERROR' && state.error !== null;
}
