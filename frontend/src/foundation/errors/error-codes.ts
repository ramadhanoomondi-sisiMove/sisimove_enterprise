// -----------------------------------------------------------------------------
// Error Codes
// -----------------------------------------------------------------------------

export const errorCodes = {
  unknown: 'UNKNOWN_ERROR',

  network: 'NETWORK_ERROR',
  timeout: 'TIMEOUT_ERROR',

  unauthorized: 'UNAUTHORIZED',
  forbidden: 'FORBIDDEN',
  notFound: 'NOT_FOUND',
  validation: 'VALIDATION_ERROR',
  conflict: 'CONFLICT',
  rateLimited: 'RATE_LIMITED',

  server: 'SERVER_ERROR',

  invalidResponse: 'INVALID_RESPONSE',
} as const;

export type ErrorCode =
  (typeof errorCodes)[keyof typeof errorCodes];