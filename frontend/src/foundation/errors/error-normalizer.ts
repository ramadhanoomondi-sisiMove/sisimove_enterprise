// -----------------------------------------------------------------------------
// Error Normalizer
// -----------------------------------------------------------------------------

import { ApiError } from './api-error';
import { AppError } from './app-error';
import { errorCodes } from './error-codes';

export interface NormalizedError {
  error: AppError;
  message: string;
  code: string;
  statusCode?: number;
}

export function normalizeError(
  error: unknown,
): NormalizedError {
  if (error instanceof ApiError) {
    return {
      error,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof AppError) {
    return {
      error,
      message: error.message,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    const normalized = new AppError(
      error.message,
      errorCodes.unknown,
      error,
    );

    return {
      error: normalized,
      message: normalized.message,
      code: normalized.code,
    };
  }

  const normalized = new AppError(
    'An unexpected error occurred.',
    errorCodes.unknown,
    error,
  );

  return {
    error: normalized,
    message: normalized.message,
    code: normalized.code,
  };
}