// -----------------------------------------------------------------------------
// sisiMove — Application Authentication Provider
// -----------------------------------------------------------------------------
//
// Application/provider composition boundary for authentication.
//
// The authentication feature owns the actual authentication state machine:
//
//     features/authentication/state/authentication-context.tsx
//
// This application-level provider exists so the Next.js application can mount
// authentication once at the root provider boundary without exposing feature
// implementation details throughout the app tree.
//
// Responsibilities:
// - Mount the feature-owned AuthenticationProvider.
// - Provide authentication context to the application tree.
//
// This component intentionally does NOT:
// - Perform login.
// - Perform registration.
// - Perform logout directly.
// - Read or write localStorage.
// - Manage access/refresh tokens.
// - Fetch identity data.
// - Fetch verification status.
// - Manage roles or permissions.
// - Perform route redirects.
//
// Those concerns belong to their respective feature/application boundaries.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import {
  AuthenticationProvider as FeatureAuthenticationProvider,
} from '@/features/authentication/state';

export interface AuthenticationProviderProps {
  readonly children: ReactNode;
}

export function AuthenticationProvider({
  children,
}: AuthenticationProviderProps) {
  return (
    <FeatureAuthenticationProvider>
      {children}
    </FeatureAuthenticationProvider>
  );
}

export default AuthenticationProvider;

