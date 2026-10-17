
const DEFAULT_DATE_FALLBACK = "—";

export function formatVerificationDate(
  value: string | null | undefined,
  fallback = DEFAULT_DATE_FALLBACK,
): string {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatVerificationDateTime(
  value: string | null | undefined,
  fallback = DEFAULT_DATE_FALLBACK,
): string {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatVerificationFileSize(
  sizeBytes: number | null | undefined,
  fallback = DEFAULT_DATE_FALLBACK,
): string {
  if (
    sizeBytes === null ||
    sizeBytes === undefined ||
    !Number.isFinite(sizeBytes) ||
    sizeBytes < 0
  ) {
    return fallback;
  }

  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  if (sizeBytes < 1024 * 1024 * 1024) {
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(sizeBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
