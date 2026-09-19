// -----------------------------------------------------------------------------
// sisiMove — Local Storage Adapter
// -----------------------------------------------------------------------------
//
// Browser localStorage implementation of the foundation Storage contract.
//
// This adapter is intentionally generic. It does not know about authentication,
// sessions, identities, tokens, or any feature-specific data.
//
// Serialization:
// - Values are serialized with JSON.stringify().
// - Values are deserialized with JSON.parse().
//
// SSR:
// - Browser storage is unavailable during server rendering.
// - Reads return null.
// - has() returns false.
// - writes/removes/clear() are safely ignored.
//
// -----------------------------------------------------------------------------

import type { Storage } from './storage';

class BrowserLocalStorage implements Storage {
  public get<T>(key: string): T | null {
    if (!this.isAvailable()) {
      return null;
    }

    const value = window.localStorage.getItem(key);

    if (value === null) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      // A malformed value should not escape the storage boundary.
      //
      // Remove it so subsequent reads do not repeatedly encounter the same
      // invalid persisted value.
      window.localStorage.removeItem(key);

      return null;
    }
  }

  public set<T>(key: string, value: T): void {
    if (!this.isAvailable()) {
      return;
    }

    window.localStorage.setItem(
      key,
      JSON.stringify(value),
    );
  }

  public remove(key: string): void {
    if (!this.isAvailable()) {
      return;
    }

    window.localStorage.removeItem(key);
  }

  public clear(): void {
    if (!this.isAvailable()) {
      return;
    }

    window.localStorage.clear();
  }

  public has(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    return window.localStorage.getItem(key) !== null;
  }

  private isAvailable(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    );
  }
}

export const localStorageAdapter: Storage =
  new BrowserLocalStorage();
