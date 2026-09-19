// -----------------------------------------------------------------------------
// sisiMove — Authentication State Barrel
// -----------------------------------------------------------------------------

export {
  INITIAL_AUTHENTICATION_STATE,
  createAuthenticatedState,
  createUnauthenticatedState,
  createAuthenticationErrorState,
  isAuthenticated,
  isUnauthenticated,
  hasAuthenticationError,
} from './authentication-state';

export type {
  AuthenticationStatus,
  AuthenticationState,
} from './authentication-state';

export {
  AuthenticationProvider,
  useAuthentication,
} from './authentication-context';

export type {
  AuthenticationContextValue,
  AuthenticationProviderProps,
} from './authentication-context';

