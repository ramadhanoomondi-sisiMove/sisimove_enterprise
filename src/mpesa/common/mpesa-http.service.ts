/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 HTTP Service
 * -----------------------------------------------------------------------------
 *
 * Shared HTTP transport for Safaricom Daraja API requests.
 *
 * Security:
 * - Never log access tokens or credentials.
 * - Never expose request headers.
 * - Never expose raw provider response bodies.
 * - Log only approved provider diagnostic fields.
 * -----------------------------------------------------------------------------
 */

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';

import { isAxiosError } from 'axios';

import { firstValueFrom } from 'rxjs';

import { MPESA_BASE_URLS, MPESA_HTTP } from './mpesa.constants';

import { MpesaEnvironment } from './mpesa.config';

// =============================================================================
// Types
// =============================================================================

export interface MpesaHttpRequestOptions {
  readonly accessToken?: string;
  readonly timeoutMs?: number;
  readonly headers?: Readonly<Record<string, string>>;
}

interface MpesaRequestContext {
  readonly method: 'GET' | 'POST';
  readonly path: string;
  readonly environment: MpesaEnvironment;
}

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class MpesaHttpService {
  private readonly logger = new Logger(MpesaHttpService.name);

  constructor(private readonly httpService: HttpService) {}

  // ===========================================================================
  // GET
  // ===========================================================================

  async get<TResponse>(
    environment: MpesaEnvironment,
    path: string,
    options: MpesaHttpRequestOptions = {},
  ): Promise<TResponse> {
    return this.execute<TResponse>(
      'GET',
      environment,
      path,
      undefined,
      options,
    );
  }

  // ===========================================================================
  // POST
  // ===========================================================================

  async post<TResponse>(
    environment: MpesaEnvironment,
    path: string,
    body: unknown,
    options: MpesaHttpRequestOptions = {},
  ): Promise<TResponse> {
    return this.execute<TResponse>('POST', environment, path, body, options);
  }

  // ===========================================================================
  // Request Execution
  // ===========================================================================

  private async execute<TResponse>(
    method: 'GET' | 'POST',
    environment: MpesaEnvironment,
    path: string,
    body: unknown,
    options: MpesaHttpRequestOptions,
  ): Promise<TResponse> {
    const baseURL = this.resolveBaseUrl(environment);

    const headers: Record<string, string> = {
      Accept: MPESA_HTTP.ACCEPT,
      'Content-Type': MPESA_HTTP.CONTENT_TYPE,
      ...options.headers,
    };

    if (options.accessToken) {
      headers.Authorization = `Bearer ${options.accessToken}`;
    }

    const traceId = `MPESA-HTTP-${Date.now()}`;
    const startedAt = Date.now();

    this.logger.warn(
      `[${traceId}] OUTBOUND REQUEST START: ${JSON.stringify({
        method,
        environment,
        path,
        baseURL,
        hasAccessToken: Boolean(options.accessToken),
        contentType: MPESA_HTTP.CONTENT_TYPE,
      })}`,
    );

    try {
      const response = await firstValueFrom(
        this.httpService.request<TResponse>({
          method,
          baseURL,
          url: path,
          data: body,
          headers,
          timeout: options.timeoutMs ?? MPESA_HTTP.TIMEOUT_MS,
        }),
      );

      const durationMs = Date.now() - startedAt;
      const responseData: unknown = response.data;

      const providerResponse =
        typeof responseData === 'object' && responseData !== null
          ? (responseData as Record<string, unknown>)
          : {};

      this.logger.warn(
        `[${traceId}] OUTBOUND RESPONSE RECEIVED: ${JSON.stringify({
          method,
          environment,
          path,
          httpStatus: response.status,
          durationMs,
          responseCode: providerResponse.ResponseCode ?? null,
          responseDescription: providerResponse.ResponseDescription ?? null,
          originatorConversationID:
            providerResponse.OriginatorConversationID ?? null,
          conversationID: providerResponse.ConversationID ?? null,
          customerMessage: providerResponse.CustomerMessage ?? null,
        })}`,
      );

      return response.data;
    } catch (error: unknown) {
      this.logger.error(
        `[${traceId}] OUTBOUND REQUEST FAILED: ${JSON.stringify({
          method,
          environment,
          path,
          durationMs: Date.now() - startedAt,
        })}`,
      );

      this.handleRequestError(error, {
        method,
        path,
        environment,
      });
    }
  }

  // ===========================================================================
  // Environment Resolution
  // ===========================================================================

  private resolveBaseUrl(environment: MpesaEnvironment): string {
    switch (environment) {
      case 'sandbox':
        return MPESA_BASE_URLS.SANDBOX;

      case 'production':
        return MPESA_BASE_URLS.PRODUCTION;

      default:
        throw new HttpException(
          'Unsupported M-PESA environment.',
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  // ===========================================================================
  // Error Handling
  // ===========================================================================

  private handleRequestError(
    error: unknown,
    context: MpesaRequestContext,
  ): never {
    if (isAxiosError(error)) {
      const status = error.response?.status;

      if (status !== undefined) {
        const responseData: unknown = error.response?.data;

        const providerError =
          typeof responseData === 'object' && responseData !== null
            ? (responseData as Record<string, unknown>)
            : {};

        const diagnostic = {
          method: context.method,
          path: context.path,
          environment: context.environment,
          httpStatus: status,
          transportCode: error.code ?? null,
          providerRequestId:
            typeof providerError.requestId === 'string'
              ? providerError.requestId.slice(0, 100)
              : null,
          providerErrorCode:
            typeof providerError.errorCode === 'string' ||
            typeof providerError.errorCode === 'number'
              ? providerError.errorCode
              : null,
          providerErrorMessage:
            typeof providerError.errorMessage === 'string'
              ? providerError.errorMessage.replace(/[\r\n]/g, ' ').slice(0, 300)
              : null,
        };

        this.logger.error(
          `M-PESA provider HTTP failure: ${JSON.stringify(diagnostic)}`,
        );

        throw new HttpException(
          'M-PESA provider request failed.',
          status >= 400 && status <= 599 ? status : HttpStatus.BAD_GATEWAY,
        );
      }

      this.logger.error(
        `M-PESA transport failure: ${JSON.stringify({
          method: context.method,
          path: context.path,
          environment: context.environment,
          transportCode: error.code ?? null,
          message:
            error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
              ? 'Request timed out.'
              : 'No HTTP response received from provider.',
        })}`,
      );

      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new HttpException(
          'M-PESA provider request timed out.',
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }

      throw new HttpException(
        'Unable to communicate with the M-PESA provider.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    this.logger.error(
      `Unexpected M-PESA transport error: ${context.method} ${context.path}`,
    );

    throw new HttpException(
      'An unexpected M-PESA transport error occurred.',
      HttpStatus.BAD_GATEWAY,
    );
  }
}
