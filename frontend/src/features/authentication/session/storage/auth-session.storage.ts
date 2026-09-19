
// -----------------------------------------------------------------------------
// sisiMove — Authentication Session Storage
// -----------------------------------------------------------------------------
//
// Client-side persistence boundary for the authenticated sisiMove session.
//
// Responsibilities:
// - Persist the AuthSession returned by a successful login.
// - Restore the persisted AuthSession when the application starts.
// - Remove the persisted AuthSession during client-side logout.
// - Keep storage access out of React components, hooks, and API adapters.
//
// Non-responsibilities:
// - Login or logout HTTP requests.
// - Token generation.
// - Token refresh.
// - Session validation.
// - Authentication state management.
// - Identity/Profile/Trust/Verification state.
// - Device management.
//
// The storage layer stores the complete AuthSession because all values belong
// to the backend-issued authentication session:
//
//   identityPublicId
//   authenticationPublicId
//   devicePublicId
//   sessionPublicId
//   accessToken
//   refreshToken
//
// The storage implementation intentionally uses browser localStorage because
// the authenticated session is expected to survive a browser restart.
//
// Security boundary:
// - This module is browser-only.
// - No credentials are stored here.
// - No password is stored here.
// - No device fingerprint is stored here.
// - No registration data is stored here.
// - Tokens are persisted only as part of the AuthSession returned by login.
//
// If the application later moves token persistence to HttpOnly cookies, this
// file remains the natural replacement boundary and consumers do not need to
// change.
//
// -----------------------------------------------------------------------------

import type { AuthSession } from '../models/auth-session';

/**
 * Storage key used for the persisted sisiMove authentication session.
 *
 * The key is intentionally owned by the authentication session storage
 * boundary rather than being exposed to application components.
 */
const AUTH_SESSION_STORAGE_KEY = 'sisimove.auth.session';

/**
 * Authentication session storage contract.
 *
 * Consumers depend on this interface rather than on localStorage directly.
 */
export interface AuthSessionStorage {
  /**
   * Restore the previously persisted authentication session.
   *
   * Returns null when no session has been persisted.
   */
  get(): Promise<AuthSession | null>;

  /**
   * Persist an authenticated session.
   */
  set(session: AuthSession): Promise<void>;

  /**
   * Remove the currently persisted authentication session.
   */
  remove(): Promise<void>;
}

/**
 * Browser localStorage implementation of AuthSessionStorage.
 *
 * All browser-storage access is isolated here.
 */
class LocalAuthSessionStorage implements AuthSessionStorage {
  /**
   * Restore the persisted authentication session.
   *
   * Invalid or malformed JSON is treated as an unavailable session rather
   * than being allowed to crash authentication initialization.
   */
  public async get(): Promise<AuthSession | null> {
    if (typeof window === 'undefined') {
      return null;
    }

    const serializedSession = window.localStorage.getItem(
      AUTH_SESSION_STORAGE_KEY,
    );

    if (serializedSession === null) {
      return null;
    }

    try {
      const parsedSession: unknown = JSON.parse(serializedSession);

      if (!isAuthSession(parsedSession)) {
        window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        return null;
      }

      return parsedSession;
    } catch {
      /**
       * A corrupted persisted value must not prevent the application from
       * loading. Remove the invalid value and treat the browser as
       * unauthenticated.
       */
      window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      return null;
    }
  }

  /**
   * Persist the complete authenticated session.
   */
  public async set(session: AuthSession): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    if (!isAuthSession(session)) {
      throw new Error('A valid authentication session is required.');
    }

    window.localStorage.setItem(
      AUTH_SESSION_STORAGE_KEY,
      JSON.stringify(session),
    );
  }

  /**
   * Remove the persisted authentication session.
   */
  public async remove(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  }
}

/**
 * Runtime validation for data restored from browser storage.
 *
 * localStorage contains untyped external data from the application's
 * perspective. TypeScript cannot guarantee that the stored JSON still
 * conforms to AuthSession, so the boundary performs a minimal structural
 * validation before returning it to the application.
 *
 * This validates the storage shape only. It does NOT validate whether the
 * access token or refresh token is still accepted by the backend.
 */
function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.identityPublicId === 'string' &&
    candidate.identityPublicId.length > 0 &&
    typeof candidate.authenticationPublicId === 'string' &&
    candidate.authenticationPublicId.length > 0 &&
    typeof candidate.devicePublicId === 'string' &&
    candidate.devicePublicId.length > 0 &&
    typeof candidate.sessionPublicId === 'string' &&
    candidate.sessionPublicId.length > 0 &&
    typeof candidate.accessToken === 'string' &&
    candidate.accessToken.length > 0 &&
    typeof candidate.refreshToken === 'string' &&
    candidate.refreshToken.length > 0
  );
}

/**
 * Singleton authentication session storage.
 *
 * The rest of the frontend should import this object rather than constructing
 * storage implementations or accessing localStorage directly.
 */
export const authSessionStorage: AuthSessionStorage =
  new LocalAuthSessionStorage();
