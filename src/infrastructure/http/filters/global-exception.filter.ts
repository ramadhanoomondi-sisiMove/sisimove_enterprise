// -----------------------------------------------------------------------------
// Global HTTP Exception Filter
// -----------------------------------------------------------------------------
//
// Global infrastructure exception filter for the SisiMove HTTP API.
//
// Responsibilities:
//
// - translate DomainException into HTTP responses;
// - preserve NestJS HttpException responses;
// - safely handle unknown exceptions;
// - log unknown infrastructure/application errors;
// - provide a consistent API error envelope;
// - prevent internal exception details from leaking through HTTP.
//
// Architectural boundary:
//
// Domain
// └── DomainException
//
// Application
// └── handlers / use cases
//
// Infrastructure
// └── GlobalExceptionFilter
//
// Presentation
// └── HTTP response
//
// IMPORTANT:
//
// Domain and application layers never depend on this filter.
// The filter depends on DomainException because the HTTP boundary is where
// domain failures are translated into transport semantics.
//
// Unknown exceptions are intentionally logged here. Their internal details
// are NOT exposed to API consumers.
// -----------------------------------------------------------------------------

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { DomainException } from '../../../foundation/kernel/domain/domain-exception';
import { DomainExceptionHttpStatusMapper } from '../mappers/domain-exception-http-status.mapper';

interface HttpErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  path: string;
  timestamp: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  public constructor(
    private readonly domainExceptionHttpStatusMapper: DomainExceptionHttpStatusMapper,
  ) {}

  public catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();

    const response = http.getResponse<Response>();
    const request = http.getRequest<Request>();

    const error = this.toHttpError(exception, request);

    response.status(error.statusCode).json(error);
  }

  // ---------------------------------------------------------------------------
  // Exception translation
  // ---------------------------------------------------------------------------

  private toHttpError(exception: unknown, request: Request): HttpErrorResponse {
    const path = request.originalUrl ?? request.url;
    const timestamp = new Date().toISOString();

    // -------------------------------------------------------------------------
    // Domain exception
    // -------------------------------------------------------------------------

    if (exception instanceof DomainException) {
      return {
        statusCode: this.domainExceptionHttpStatusMapper.map(exception),
        code: exception.code,
        message: exception.message,
        path,
        timestamp,
      };
    }

    // -------------------------------------------------------------------------
    // NestJS HTTP exception
    // -------------------------------------------------------------------------

    if (exception instanceof HttpException) {
      return this.fromNestHttpException(exception, request);
    }

    // -------------------------------------------------------------------------
    // Unknown exception
    // -------------------------------------------------------------------------
    //
    // IMPORTANT:
    //
    // Never expose the internal exception message to the HTTP client.
    //
    // Log the complete exception here so infrastructure/application failures
    // can be diagnosed from the NestJS server output.
    //

    this.logUnknownException(exception, request);

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL.SERVER.ERROR',
      message: 'An unexpected error occurred.',
      path,
      timestamp,
    };
  }

  // ---------------------------------------------------------------------------
  // Unknown exception logging
  // ---------------------------------------------------------------------------

  private logUnknownException(exception: unknown, request: Request): void {
    const method = request.method;
    const path = request.originalUrl ?? request.url;

    if (exception instanceof Error) {
      this.logger.error(
        `${method} ${path} → ${exception.name}: ${exception.message}`,
        exception.stack,
      );

      return;
    }

    this.logger.error(`${method} ${path} → Unknown non-Error exception`);

    this.logger.error(this.safeSerialize(exception));
  }

  // ---------------------------------------------------------------------------
  // Safe unknown-exception serialization
  // ---------------------------------------------------------------------------

  private safeSerialize(value: unknown): string {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  // ---------------------------------------------------------------------------
  // NestJS HTTP exception mapping
  // ---------------------------------------------------------------------------

  private fromNestHttpException(
    exception: HttpException,
    request: Request,
  ): HttpErrorResponse {
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      const response = exceptionResponse as Record<string, unknown>;

      if (typeof response.message === 'string') {
        message = response.message;
      } else if (Array.isArray(response.message)) {
        message = response.message.join(', ');
      }
    }

    return {
      statusCode,
      code: this.httpStatusToCode(statusCode),
      message,
      path: request.originalUrl ?? request.url,
      timestamp: new Date().toISOString(),
    };
  }

  // ---------------------------------------------------------------------------
  // HTTP status → generic transport code
  // ---------------------------------------------------------------------------

  private httpStatusToCode(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return 'HTTP.BAD_REQUEST';

      case 401:
        return 'HTTP.UNAUTHORIZED';

      case 403:
        return 'HTTP.FORBIDDEN';

      case 404:
        return 'HTTP.NOT_FOUND';

      case 409:
        return 'HTTP.CONFLICT';

      case 422:
        return 'HTTP.UNPROCESSABLE_ENTITY';

      case 429:
        return 'HTTP.TOO_MANY_REQUESTS';

      case 500:
        return 'INTERNAL.SERVER.ERROR';

      case 501:
        return 'HTTP.NOT_IMPLEMENTED';

      case 502:
        return 'HTTP.BAD_GATEWAY';

      case 503:
        return 'HTTP.SERVICE_UNAVAILABLE';

      case 504:
        return 'HTTP.GATEWAY_TIMEOUT';

      default:
        return `HTTP.${statusCode}`;
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GlobalExceptionFilter;
