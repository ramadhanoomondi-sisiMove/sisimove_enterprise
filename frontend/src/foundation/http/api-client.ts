// -----------------------------------------------------------------------------
// API Client
// -----------------------------------------------------------------------------
//
// Lightweight fetch-based HTTP client.
// No Axios dependency.
//
// Supports:
// - JSON request bodies
// - FormData request bodies
// - Authentication context
// - Correlation IDs
// - Query parameters
// - Request cancellation
// - Request timeout
// - Standardized API errors
//
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

  // ===========================================================================
  // Request
  // ===========================================================================

  private async request<T>(
    method: string,
    path: string,
    options: RequestOptions & { body?: unknown } = {},
  ): Promise<T> {
    const url = this.buildUrl(
      path,
      options.query,
    );

    const headers = new Headers({
      ...apiConfig.headers,
      ...options.headers,
    });

    // -------------------------------------------------------------------------
    // Authentication
    // -------------------------------------------------------------------------

    if (options.context?.accessToken) {
      headers.set(
        'Authorization',
        `Bearer ${options.context.accessToken}`,
      );
    }

    // -------------------------------------------------------------------------
    // Correlation ID
    // -------------------------------------------------------------------------

    if (options.context?.correlationId) {
      headers.set(
        'X-Correlation-ID',
        options.context.correlationId,
      );
    }

    // -------------------------------------------------------------------------
    // Request Body
    // -------------------------------------------------------------------------

    const requestBody =
      this.prepareRequestBody(
        options.body,
        headers,
      );

    // -------------------------------------------------------------------------
    // Timeout Controller
    // -------------------------------------------------------------------------
    //
    // The timeout controller is always created.
    //
    // An external signal may additionally cancel the request. The two signals
    // are combined below so that:
    //
    // - caller cancellation still works;
    // - API timeout still works;
    // - either one can terminate the request.
    //
    // -------------------------------------------------------------------------

    const timeoutController =
      new AbortController();

    const timeout = setTimeout(() => {
      timeoutController.abort();
    }, apiConfig.timeoutMs);

    const signal =
      this.combineAbortSignals(
        timeoutController.signal,
        options.context?.signal,
      );

    // =========================================================================
    // Fetch
    // =========================================================================

    try {
      const response = await fetch(
        url,
        {
          method,
          headers,
          signal,
          credentials: 'include',
          body: requestBody,
        },
      );

      const payload =
        await this.parseResponse(response);

      if (!response.ok) {
        throw new ApiError(
          this.extractErrorMessage(payload),
          response.status,
          undefined,
          payload,
        );
      }

      return this.unwrapResponse<T>(
        payload,
      );
    } catch (error) {
      // -----------------------------------------------------------------------
      // Preserve standardized API errors.
      // -----------------------------------------------------------------------

      if (error instanceof ApiError) {
        throw error;
      }

      // -----------------------------------------------------------------------
      // Abort / timeout / cancellation.
      // -----------------------------------------------------------------------

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

      // -----------------------------------------------------------------------
      // Network failure.
      // -----------------------------------------------------------------------

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

  // ===========================================================================
  // Abort Signals
  // ===========================================================================

  private combineAbortSignals(
    timeoutSignal: AbortSignal,
    externalSignal?: AbortSignal,
  ): AbortSignal {
    // -------------------------------------------------------------------------
    // No external signal.
    // -------------------------------------------------------------------------

    if (!externalSignal) {
      return timeoutSignal;
    }

    // -------------------------------------------------------------------------
    // AbortSignal.any()
    // -------------------------------------------------------------------------
    //
    // Modern browsers support AbortSignal.any(), allowing the request to abort
    // when either the timeout or external signal aborts.
    //
    // -------------------------------------------------------------------------

    if (
      typeof AbortSignal.any === 'function'
    ) {
      return AbortSignal.any([
        timeoutSignal,
        externalSignal,
      ]);
    }

    // -------------------------------------------------------------------------
    // Compatibility fallback.
    // -------------------------------------------------------------------------
    //
    // This fallback creates a combined signal without mutating either source
    // signal.
    //
    // -------------------------------------------------------------------------

    const controller =
      new AbortController();

    const abort = (): void => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    };

    if (timeoutSignal.aborted) {
      abort();
    } else {
      timeoutSignal.addEventListener(
        'abort',
        abort,
        { once: true },
      );
    }

    if (externalSignal.aborted) {
      abort();
    } else {
      externalSignal.addEventListener(
        'abort',
        abort,
        { once: true },
      );
    }

    return controller.signal;
  }

  // ===========================================================================
  // Request Body
  // ===========================================================================

  private prepareRequestBody(
    body: unknown,
    headers: Headers,
  ): BodyInit | undefined {
    if (body === undefined) {
      return undefined;
    }

    if (body instanceof FormData) {
      /**
       * Do not manually specify Content-Type for multipart requests.
       *
       * The browser adds the multipart boundary automatically.
       */
      headers.delete('Content-Type');

      return body;
    }

    if (body instanceof Blob) {
      return body;
    }

    if (body instanceof URLSearchParams) {
      return body;
    }

    if (typeof body === 'string') {
      return body;
    }

    headers.set(
      'Content-Type',
      'application/json',
    );

    return JSON.stringify(body);
  }

  // ===========================================================================
  // URL
  // ===========================================================================

  private buildUrl(
    path: string,
    query?: RequestOptions['query'],
  ): string {
    const normalizedBase =
      this.baseUrl.replace(
        /\/+$/,
        '',
      );

    const normalizedPath =
      path.startsWith('/')
        ? path
        : `/${path}`;

    const url = new URL(
      `${normalizedBase}${normalizedPath}`,
      window.location.origin,
    );

    if (query) {
      for (
        const [key, value]
        of Object.entries(query)
      ) {
        if (
          value !== undefined &&
          value !== null &&
          value !== ''
        ) {
          url.searchParams.set(
            key,
            String(value),
          );
        }
      }
    }

    return url.toString();
  }

  // ===========================================================================
  // Response Parsing
  // ===========================================================================

  private async parseResponse(
    response: Response,
  ): Promise<unknown> {
    const contentType =
      response.headers.get(
        'content-type',
      ) ?? '';

    if (
      contentType.includes(
        'application/json',
      )
    ) {
      return response.json();
    }

    const text =
      await response.text();

    if (!text) {
      return null;
    }

    return text;
  }

  // ===========================================================================
  // Response Unwrapping
  // ===========================================================================

  private unwrapResponse<T>(
    payload: unknown,
  ): T {
    if (
      payload &&
      typeof payload === 'object' &&
      'data' in payload
    ) {
      return (
        payload as {
          data: T;
        }
      ).data;
    }

    return payload as T;
  }

  // ===========================================================================
  // Error Message
  // ===========================================================================

  private extractErrorMessage(
    payload: unknown,
  ): string {
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

// =============================================================================
// Singleton
// =============================================================================

export const apiClient =
  new ApiClient();