'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { ApiClient } from '../http';
import {
  AuthStorage,
} from './auth-storage';
import {
  DefaultAuthClient,
} from './auth-client';

import type {
  AuthSession,
  AuthState,
  LoginCredentials,
  RegisterInput,
} from './auth.types';

interface AuthContextValue extends AuthState {
  login(
    credentials: LoginCredentials,
  ): Promise<void>;

  register(
    input: RegisterInput,
  ): Promise<void>;

  logout(): Promise<void>;

  refresh(): Promise<void>;
}

export const AuthContext =
  createContext<AuthContextValue | null>(null);

const apiClient = new ApiClient();
const authClient = new DefaultAuthClient(apiClient);
const authStorage = new AuthStorage();

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] =
    useState<AuthSession | null>(null);

  const [status, setStatus] =
    useState<AuthState['status']>('unknown');

  const restore = useCallback(async () => {
    const storedSession = authStorage.get();

    if (storedSession) {
      setSession(storedSession);
      setStatus('authenticated');
      return;
    }

    const currentIdentity =
      await authClient.getCurrentIdentity();

    if (currentIdentity) {
      setStatus('authenticated');

      setSession({
        identity: currentIdentity,
        accessToken: '',
        expiresAt: 0,
      });

      return;
    }

    setStatus('unauthenticated');
  }, []);

  useEffect(() => {
    void restore();
  }, [restore]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const nextSession =
        await authClient.login(credentials);

      authStorage.set(nextSession);

      setSession(nextSession);
      setStatus('authenticated');
    },
    [],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const nextSession =
        await authClient.register(input);

      authStorage.set(nextSession);

      setSession(nextSession);
      setStatus('authenticated');
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authClient.logout();
    } finally {
      authStorage.clear();
      setSession(null);
      setStatus('unauthenticated');
    }
  }, []);

  const refresh = useCallback(async () => {
    const nextSession =
      await authClient.refresh();

    if (!nextSession) {
      authStorage.clear();
      setSession(null);
      setStatus('unauthenticated');
      return;
    }

    authStorage.set(nextSession);

    setSession(nextSession);
    setStatus('authenticated');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      identity: session?.identity ?? null,
      login,
      register,
      logout,
      refresh,
    }),
    [
      status,
      session,
      login,
      register,
      logout,
      refresh,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}