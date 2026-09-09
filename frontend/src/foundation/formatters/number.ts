export function formatNumber(
  value: number,
): string {
  return new Intl.NumberFormat('en-KE').format(value);
}