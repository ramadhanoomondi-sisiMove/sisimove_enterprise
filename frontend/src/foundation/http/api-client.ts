// -----------------------------------------------------------------------------
// API Client
// -----------------------------------------------------------------------------
// Lightweight fetch-based HTTP client.
// No Axios dependency.
// -----------------------------------------------------------------------------

import { apiConfig } from '../config/api.config';
import { ApiError } from '../errors/api-error';
import { errorCodes } from '../errors/error-codes';
import type { RequestOptions } from './request-context';

export class ApiClient {
  constructor(
    private readonly baseUrl: string = apiConfig.baseUrl,
  ) {}

  async get<T>(
    path: string,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>('GET', path, options);
  }

  async post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>('POST', path, {
      ...options,
      body,
    });
  }

  async patch<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>('PATCH', path, {
      ...options,
      body,
    });
  }

  async put<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>('PUT', path, {
      ...options,
      body,
    });
  }

  async delete<T>(
    path: string,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>('DELETE', path, options);
  }

  private async request<T>(
    method: string,
    path: string,
    options: RequestOptions & { body?: unknown } = {},
  ): Promise<T> {
    const url = this.buildUrl(path, options.query);

    const headers = new Headers({
      ...apiConfig.headers,
      ...options.headers,
    });

    if (options.context?.accessToken) {
      headers.set(
        'Authorization',
        `Bearer ${options.context.accessToken}`,
      );
    }

    if (options.context?.correlationId) {
      headers.set(
        'X-Correlation-ID',
        options.context.correlationId,
      );
    }

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, apiConfig.timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        headers,
        signal: options.context?.signal ?? controller.signal,
        credentials: 'include',
        body:
          options.body === undefined
            ? undefined
            : JSON.stringify(options.body),
      });

      const payload = await this.parseResponse(response);

      if (!response.ok) {
        throw new ApiError(
          this.extractErrorMessage(payload),
          response.status,
          undefined,
          payload,
        );
      }

      return this.unwrapResponse<T>(payload);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        throw new ApiError(
          'The request timed out or was cancelled.',
          408,
          errorCodes.timeout,
        );
      }

      throw new ApiError(
        'Unable to connect to the SisiMove service.',
        0,
        errorCodes.network,
        error,
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildUrl(
    path: string,
    query?: RequestOptions['query'],
  ): string {
    const normalizedBase = this.baseUrl.replace(/\/+$/, '');
    const normalizedPath = path.startsWith('/')
      ? path
      : `/${path}`;

    const url = new URL(
      `${normalizedBase}${normalizedPath}`,
      window.location.origin,
    );

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (
          value !== undefined &&
          value !== null &&
          value !== ''
        ) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private async parseResponse(
    response: Response,
  ): Promise<unknown> {
    const contentType =
      response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      return response.json();
    }

    const text = await response.text();

    if (!text) {
      return null;
    }

    return text;
  }

  private unwrapResponse<T>(payload: unknown): T {
    if (
      payload &&
      typeof payload === 'object' &&
      'data' in payload
    ) {
      return (payload as { data: T }).data;
    }

    return payload as T;
  }

  private extractErrorMessage(payload: unknown): string {
    if (
      payload &&
      typeof payload === 'object' &&
      'message' in payload
    ) {
      const message = (
        payload as {
          message?: string | string[];
        }
      ).message;

      if (Array.isArray(message)) {
        return message.join(', ');
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    return 'The request could not be completed.';
  }
}

export const apiClient = new ApiClient();