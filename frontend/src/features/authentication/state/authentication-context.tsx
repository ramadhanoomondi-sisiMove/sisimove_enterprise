'use client';

// -----------------------------------------------------------------------------
// sisiMove — Authentication Context
// -----------------------------------------------------------------------------
//
// React state boundary for the authenticated sisiMove session.
//
// Responsibilities:
// - Restore the persisted AuthSession on application startup.
// - Expose authentication state to React consumers.
// - Establish state after a successful login.
// - Persist a successful authenticated session.
// - Clear client-side authentication state during logout.
//
// Non-responsibilities:
// - Performing registration.
// - Performing login HTTP requests.
// - Performing token refresh.
// - Loading Identity.
// - Loading Verification.
// - Loading IdentityRole/Permission.
// - Loading TravellerProfile.
// - Loading TrustProfile.
// - Managing the backend Device aggregate.
// - Deciding marketplace verification eligibility.
//
// Login remains owned by the login feature:
//
//   LoginForm
//       ↓
//   useAuthenticateLogin
//       ↓
//   authenticate-login.api
//       ↓
//   AuthSession
//       ↓
//   authentication context
//
// -----------------------------------------------------------------------------

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { AuthSession } from '../session';
import { authSessionStorage } from '../session';

import {
  createAuthenticatedState,
  createAuthenticationErrorState,
  createUnauthenticatedState,
  INITIAL_AUTHENTICATION_STATE,
  type AuthenticationState,
} from './authentication-state';

/**
 * Public React context contract.
 */
export interface AuthenticationContextValue {
  /**
   * Complete authentication state.
   */
  readonly state: AuthenticationState;

  /**
   * Whether an authenticated AuthSession is currently available.
   */
  readonly isAuthenticated: boolean;

  /**
   * Current authenticated session, or null.
   */
  readonly session: AuthSession | null;

  /**
   * Establish a newly authenticated session.
   *
   * Called by the login feature after a successful backend login.
   */
  readonly authenticate: (session: AuthSession) => Promise<void>;

  /**
   * Clear the current client-side authentication session.
   */
  readonly logout: () => Promise<void>;
}

const AuthenticationContext = createContext<
  AuthenticationContextValue | undefined
>(undefined);

export interface AuthenticationProviderProps {
  readonly children: ReactNode;
}

/**
 * Provides authentication state to the sisiMove application.
 */
export function AuthenticationProvider({
  children,
}: AuthenticationProviderProps) {
  const [state, setState] = useState<AuthenticationState>(
    INITIAL_AUTHENTICATION_STATE,
  );

  /**
   * Restore the persisted authentication session once on application startup.
   */
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async (): Promise<void> => {
      try {
        const session = await authSessionStorage.get();

        if (cancelled) {
          return;
        }

        if (session === null) {
          setState(createUnauthenticatedState());
          return;
        }

        setState(createAuthenticatedState(session));
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        setState(
          createAuthenticationErrorState(
            error instanceof Error
              ? error
              : new Error('Unable to restore authentication session.'),
          ),
        );
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Persist and activate a successful authenticated session.
   *
   * Storage is completed before the React state is transitioned. This avoids
   * exposing an authenticated state when the browser could not persist the
   * session required to restore it after a reload.
   */
  const authenticate = useCallback(
    async (session: AuthSession): Promise<void> => {
      if (!session) {
        throw new Error('Authentication session is required.');
      }

      try {
        await authSessionStorage.set(session);

        setState(createAuthenticatedState(session));
      } catch (error: unknown) {
        const normalizedError =
          error instanceof Error
            ? error
            : new Error('Unable to persist authentication session.');

        setState(createAuthenticationErrorState(normalizedError));

        throw normalizedError;
      }
    },
    [],
  );

  /**
   * Remove the persisted session and transition the application to the
   * unauthenticated state.
   *
   * Backend session revocation is intentionally outside this client state
   * boundary. When a backend logout operation exists, it can be composed by
   * the authentication feature before or alongside this operation.
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authSessionStorage.remove();

      setState(createUnauthenticatedState());
    } catch (error: unknown) {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error('Unable to clear authentication session.');

      setState(createAuthenticationErrorState(normalizedError));

      throw normalizedError;
    }
  }, []);

  const value = useMemo<AuthenticationContextValue>(
    () => ({
      state,
      isAuthenticated: state.status === 'AUTHENTICATED',
      session: state.session,
      authenticate,
      logout,
    }),
    [state, authenticate, logout],
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
}

/**
 * Access the current sisiMove authentication context.
 *
 * Throws when used outside AuthenticationProvider so authentication-dependent
 * components cannot silently operate without the provider.
 */
export function useAuthentication(): AuthenticationContextValue {
  const context = useContext(AuthenticationContext);

  if (context === undefined) {
    throw new Error(
      'useAuthentication must be used within an AuthenticationProvider.',
    );
  }

  return context;
}
