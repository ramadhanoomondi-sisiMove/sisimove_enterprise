import type { AuthSession } from './auth.types';

const AUTH_STORAGE_KEY = 'sisimove.auth.session';

export class AuthStorage {
  public get(): AuthSession | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const raw = window.sessionStorage.getItem(
      AUTH_STORAGE_KEY,
    );

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      this.clear();
      return null;
    }
  }

  public set(session: AuthSession): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(session),
    );
  }

  public clear(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.removeItem(
      AUTH_STORAGE_KEY,
    );
  }
}