//frontend/src/features/authentication/http/authenticated-api-client.ts
// -----------------------------------------------------------------------------
// sisiMove — Authenticated API Client
// -----------------------------------------------------------------------------
//
// Authentication-aware HTTP boundary for protected API requests.
//
// Responsibilities:
// - Restore the current AuthSession.
// - Extract the backend-issued access token.
// - Attach the token to RequestContext.
// - Delegate HTTP execution to the foundation ApiClient.
//
// Non-responsibilities:
// - Login.
// - Logout.
// - Token generation.
// - Token refresh.
// - Session validation.
// - localStorage access outside authSessionStorage.
// - Feature-specific API calls.
// - Identity/Profile/Trust/Journey/Booking logic.
//
// Architectural boundary:
//
//   Authentication Session
//          │
//          │ accessToken
//          ▼
//   AuthenticatedApiClient
//          │
//          │ RequestContext.accessToken
//          ▼
//   Foundation ApiClient
//          │
//          ▼
//   SisiMove API
//
// Feature API adapters should use this client when calling protected
// endpoints. They must not read authSessionStorage directly.
//
// IMPORTANT:
// The foundation ApiClient contract distinguishes request body from
// RequestOptions:
//
//   GET    → apiClient.get(path, options)
//   POST   → apiClient.post(path, body, options)
//   PATCH  → apiClient.patch(path, body, options)
//   PUT    → apiClient.put(path, body, options)
//   DELETE → apiClient.delete(path, options)
//
// This client MUST preserve that contract.
//
// -----------------------------------------------------------------------------

import {
  apiClient,
  type RequestOptions,
} from '@/foundation/http';

import { authSessionStorage } from '..';

/**
 * Error thrown when a protected API request is attempted without an
 * authenticated client session.
 *
 * This is deliberately different from an HTTP 401 response:
 *
 * - AuthenticationRequiredError means the browser has no local session.
 * - ApiError with status 401 means the backend rejected the supplied
 *   authentication credential.
 */
export class AuthenticationRequiredError extends Error {
  public readonly code = 'AUTHENTICATION_REQUIRED';

  public constructor() {
    super('An authenticated session is required for this request.');

    this.name = 'AuthenticationRequiredError';
  }
}

/**
 * Authentication-aware HTTP client.
 *
 * The client does not implement HTTP itself. It composes the existing
 * foundation ApiClient and supplies the authentication context required by
 * protected API requests.
 */
export class AuthenticatedApiClient {
  /**
   * Execute an authenticated GET request.
   */
  public async get<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>(
      'GET',
      path,
      undefined,
      options,
    );
  }

  /**
   * Execute an authenticated POST request.
   *
   * The second argument is the request body.
   * The third argument contains RequestOptions.
   */
  public async post<T>(
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>(
      'POST',
      path,
      body,
      options,
    );
  }

  /**
   * Execute an authenticated PATCH request.
   *
   * The second argument is the request body.
   * The third argument contains RequestOptions.
   */
  public async patch<T>(
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>(
      'PATCH',
      path,
      body,
      options,
    );
  }

  /**
   * Execute an authenticated PUT request.
   *
   * The second argument is the request body.
   * The third argument contains RequestOptions.
   */
  public async put<T>(
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>(
      'PUT',
      path,
      body,
      options,
    );
  }

  /**
   * Execute an authenticated DELETE request.
   *
   * DELETE does not carry a request body through this abstraction.
   */
  public async delete<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>(
      'DELETE',
      path,
      undefined,
      options,
    );
  }

  /**
   * Resolve the current access token and delegate the request to the
   * foundation HTTP client.
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    path: string,
    body: unknown,
    options: RequestOptions,
  ): Promise<T> {
    const session = await authSessionStorage.get();

    if (session === null) {
      throw new AuthenticationRequiredError();
    }

    /**
     * Preserve any existing request context and inject the access token
     * belonging to the currently authenticated session.
     */
    const context = {
      ...options.context,
      accessToken: session.accessToken,
    };

    const authenticatedOptions: RequestOptions = {
      ...options,
      context,
    };

    switch (method) {
      case 'GET':
        return apiClient.get<T>(
          path,
          authenticatedOptions,
        );

      case 'POST':
        return apiClient.post<T>(
          path,
          body,
          authenticatedOptions,
        );

      case 'PATCH':
        return apiClient.patch<T>(
          path,
          body,
          authenticatedOptions,
        );

      case 'PUT':
        return apiClient.put<T>(
          path,
          body,
          authenticatedOptions,
        );

      case 'DELETE':
        return apiClient.delete<T>(
          path,
          authenticatedOptions,
        );
    }
  }
}

/**
 * Shared authenticated HTTP client.
 *
 * Feature API adapters should import this instance rather than constructing
 * their own client.
 */
export const authenticatedApiClient = new AuthenticatedApiClient();
