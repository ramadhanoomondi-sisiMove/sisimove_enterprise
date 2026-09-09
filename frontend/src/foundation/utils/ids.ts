// -----------------------------------------------------------------------------
// ID Utilities
// -----------------------------------------------------------------------------

export function isPublicId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  );
}