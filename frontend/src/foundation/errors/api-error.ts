// -----------------------------------------------------------------------------
// API Error
// -----------------------------------------------------------------------------

import { AppError } from './app-error';
import { errorCodes, type ErrorCode } from './error-codes';

export class ApiError extends AppError {
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
    code?: ErrorCode,
    details?: unknown,
  ) {
    super(
      message,
      code ?? mapStatusToErrorCode(statusCode),
      details,
    );

    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

function mapStatusToErrorCode(statusCode: number): ErrorCode {
  switch (statusCode) {
    case 401:
      return errorCodes.unauthorized;

    case 403:
      return errorCodes.forbidden;

    case 404:
      return errorCodes.notFound;

    case 409:
      return errorCodes.conflict;

    case 422:
      return errorCodes.validation;

    case 429:
      return errorCodes.rateLimited;

    default:
      if (statusCode >= 500) {
        return errorCodes.server;
      }

      return errorCodes.unknown;
  }
}