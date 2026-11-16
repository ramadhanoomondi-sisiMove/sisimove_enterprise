//src//mpesa/common/mpesa-http.service.ts
/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 HTTP Service
 * -----------------------------------------------------------------------------
 *
 * Shared HTTP transport for Safaricom Daraja API requests.
 *
 * Responsibilities:
 * - Execute authenticated and unauthenticated HTTP requests.
 * - Resolve the correct Daraja environment.
 * - Apply standard HTTP timeouts and headers.
 * - Normalize transport failures.
 *
 * Security:
 * - Never log access tokens or credentials.
 * - Never expose request headers in error messages.
 * - Never expose raw provider response bodies to API consumers.
 * -----------------------------------------------------------------------------
 */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

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

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class MpesaHttpService {
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

      return response.data;
    } catch (error: unknown) {
      this.handleRequestError(error);
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

  private handleRequestError(error: unknown): never {
    if (isAxiosError(error)) {
      const status = error.response?.status;

      if (status !== undefined) {
        throw new HttpException(
          'M-PESA provider request failed.',
          status >= 400 && status <= 599 ? status : HttpStatus.BAD_GATEWAY,
        );
      }

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

    throw new HttpException(
      'An unexpected M-PESA transport error occurred.',
      HttpStatus.BAD_GATEWAY,
    );
  }
}
