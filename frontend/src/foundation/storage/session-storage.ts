// -----------------------------------------------------------------------------
// sisiMove — Session Storage Adapter
// -----------------------------------------------------------------------------
//
// Browser sessionStorage implementation of the foundation Storage contract.
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
// Browser semantics:
// - sessionStorage is scoped to the current browser tab.
// - Its contents normally survive page reloads within that tab.
// - Its contents are removed when the browsing session ends.
//
// -----------------------------------------------------------------------------

import type { Storage } from './storage';

class BrowserSessionStorage implements Storage {
  public get<T>(key: string): T | null {
    if (!this.isAvailable()) {
      return null;
    }

    const value = window.sessionStorage.getItem(key);

    if (value === null) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      // Invalid persisted data must not escape the storage boundary.
      window.sessionStorage.removeItem(key);

      return null;
    }
  }

  public set<T>(key: string, value: T): void {
    if (!this.isAvailable()) {
      return;
    }

    window.sessionStorage.setItem(
      key,
      JSON.stringify(value),
    );
  }

  public remove(key: string): void {
    if (!this.isAvailable()) {
      return;
    }

    window.sessionStorage.removeItem(key);
  }

  public clear(): void {
    if (!this.isAvailable()) {
      return;
    }

    window.sessionStorage.clear();
  }

  public has(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    return window.sessionStorage.getItem(key) !== null;
  }

  private isAvailable(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.sessionStorage !== 'undefined'
    );
  }
}

export const sessionStorageAdapter: Storage =
  new BrowserSessionStorage();

