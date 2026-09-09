// -----------------------------------------------------------------------------
// Object Utilities
// -----------------------------------------------------------------------------

export function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function omit<
  T extends Record<string, unknown>,
  K extends keyof T,
>(
  object: T,
  keys: readonly K[],
): Omit<T, K> {
  const result = { ...object };

  for (const key of keys) {
    delete result[key];
  }

  return result;
}