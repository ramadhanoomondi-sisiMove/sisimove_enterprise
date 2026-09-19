// -----------------------------------------------------------------------------
// sisiMove — Storage Contract
// -----------------------------------------------------------------------------
//
// Generic application storage abstraction.
//
// This contract deliberately knows nothing about:
// - localStorage,
// - sessionStorage,
// - authentication,
// - sessions,
// - identities,
// - tokens,
// - feature-specific data.
//
// Implementations are responsible for translating typed values to and from the
// underlying storage mechanism.
//
// The generic API allows feature code to work with structured values without
// depending directly on browser storage APIs.
//
// Example:
//
//     storage.set('example', { enabled: true });
//
//     const value = storage.get<{ enabled: boolean }>('example');
//
//     storage.has('example');
//
// -----------------------------------------------------------------------------

export interface Storage {
  /**
   * Retrieves a stored value.
   *
   * Returns null when the key does not exist or the stored value cannot be
   * represented as the requested value.
   */
  get<T>(key: string): T | null;

  /**
   * Stores a typed value under the supplied key.
   */
  set<T>(key: string, value: T): void;

  /**
   * Removes a single stored value.
   */
  remove(key: string): void;

  /**
   * Removes all values managed by this storage implementation.
   */
  clear(): void;

  /**
   * Determines whether a key exists in this storage implementation.
   */
  has(key: string): boolean;
}

