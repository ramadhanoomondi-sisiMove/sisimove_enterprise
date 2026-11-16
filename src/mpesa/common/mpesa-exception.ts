/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 Exceptions
 * -----------------------------------------------------------------------------
 *
 * Standardized exceptions for Safaricom M-PESA integration failures.
 *
 * Architecture:
 * - Extends NestJS HttpException for compatibility with the global
 *   HTTP exception filter.
 * - Preserves M-PESA-specific error codes for application diagnostics.
 * - Keeps provider error codes and original causes internal.
 *
 * Security:
 * - Never include credentials or security credentials in exception messages.
 * - Never expose raw provider responses to API consumers.
 * - Use safe, meaningful messages when creating exceptions.
 *
 * -----------------------------------------------------------------------------
 */

import { HttpException, HttpStatus } from '@nestjs/common';

// =============================================================================
// Error Categories
// =============================================================================

export enum MpesaErrorCode {
  AUTHENTICATION_FAILED = 'MPESA_AUTHENTICATION_FAILED',
  AUTHORIZATION_FAILED = 'MPESA_AUTHORIZATION_FAILED',
  VALIDATION_FAILED = 'MPESA_VALIDATION_FAILED',
  REQUEST_FAILED = 'MPESA_REQUEST_FAILED',
  REQUEST_TIMEOUT = 'MPESA_REQUEST_TIMEOUT',
  PROVIDER_UNAVAILABLE = 'MPESA_PROVIDER_UNAVAILABLE',
  CALLBACK_VALIDATION_FAILED = 'MPESA_CALLBACK_VALIDATION_FAILED',
  CONFIGURATION_ERROR = 'MPESA_CONFIGURATION_ERROR',
  TOKEN_EXPIRED = 'MPESA_TOKEN_EXPIRED',
  UNKNOWN_ERROR = 'MPESA_UNKNOWN_ERROR',
}

// =============================================================================
// Exception Options
// =============================================================================

export interface MpesaExceptionOptions {
  /**
   * Stable SisiMove M-PESA error code.
   */
  readonly code: MpesaErrorCode;

  /**
   * Safe exception message.
   *
   * This message may be returned to the API consumer.
   * Never include secrets or raw provider response details.
   */
  readonly message: string;

  /**
   * Optional HTTP status override.
   */
  readonly statusCode?: number;

  /**
   * Original error code returned by Safaricom, when available.
   *
   * Retained internally for diagnostics.
   */
  readonly providerCode?: string;

  /**
   * Original underlying exception.
   *
   * Retained as the standard Error cause.
   */
  readonly cause?: unknown;
}

// =============================================================================
// Default HTTP Status Mapping
// =============================================================================

const MPESA_ERROR_HTTP_STATUS: Readonly<Record<MpesaErrorCode, number>> = {
  [MpesaErrorCode.AUTHENTICATION_FAILED]: HttpStatus.BAD_GATEWAY,

  [MpesaErrorCode.AUTHORIZATION_FAILED]: HttpStatus.BAD_GATEWAY,

  [MpesaErrorCode.VALIDATION_FAILED]: HttpStatus.BAD_REQUEST,

  [MpesaErrorCode.REQUEST_FAILED]: HttpStatus.BAD_GATEWAY,

  [MpesaErrorCode.REQUEST_TIMEOUT]: HttpStatus.GATEWAY_TIMEOUT,

  [MpesaErrorCode.PROVIDER_UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,

  [MpesaErrorCode.CALLBACK_VALIDATION_FAILED]: HttpStatus.BAD_REQUEST,

  [MpesaErrorCode.CONFIGURATION_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,

  [MpesaErrorCode.TOKEN_EXPIRED]: HttpStatus.BAD_GATEWAY,

  [MpesaErrorCode.UNKNOWN_ERROR]: HttpStatus.BAD_GATEWAY,
};

// =============================================================================
// M-PESA Exception
// =============================================================================

export class MpesaException extends HttpException {
  /**
   * SisiMove-specific M-PESA error code.
   */
  public readonly code: MpesaErrorCode;

  /**
   * Original Safaricom provider error code.
   *
   * Internal diagnostic information.
   */
  public readonly providerCode: string | undefined;

  /**
   * HTTP status assigned to this exception.
   */
  public readonly statusCode: number;

  constructor(options: MpesaExceptionOptions) {
    const statusCode =
      options.statusCode ?? MPESA_ERROR_HTTP_STATUS[options.code];

    super(
      {
        statusCode,
        code: options.code,
        message: options.message,
      },
      statusCode,
      options.cause !== undefined ? { cause: options.cause } : undefined,
    );

    this.name = MpesaException.name;
    this.code = options.code;
    this.providerCode = options.providerCode;
    this.statusCode = statusCode;
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default MpesaException;
