// -----------------------------------------------------------------------------
// Local Storage
// -----------------------------------------------------------------------------

import type { Storage } from './storage';

export class LocalStorage implements Storage {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const value = window.localStorage.getItem(key);

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

    window.localStorage.setItem(
      key,
      JSON.stringify(value),
    );
  }

  remove(key: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(key);
  }

  clear(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.clear();
  }

  has(key: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(key) !== null;
  }
}

export const localStorage = new LocalStorage();