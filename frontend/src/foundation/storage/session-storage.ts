// -----------------------------------------------------------------------------
// Session Storage
// -----------------------------------------------------------------------------

import type { Storage } from './storage';

export class SessionStorage implements Storage {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const value = window.sessionStorage.getItem(key);

    if (value === null) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(
      key,
      JSON.stringify(value),
    );
  }

  remove(key: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.removeItem(key);
  }

  clear(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.clear();
  }

  has(key: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.sessionStorage.getItem(key) !== null;
  }
}

export const sessionStorage = new SessionStorage();